import * as React from "react";
import { Plus, Search, RefreshCw, Layers, Eye, Edit2, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { usePagination } from "@/shared/hooks/use-pagination";
import {
  useMateriaisQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} from "../api/use-materiais";
import { MaterialTable } from "../components/material-table";
import { MaterialForm } from "../components/material-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog } from "@/shared/components/ui/dialog";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import type { MaterialResponse } from "@/shared/api/schema";
import type { MaterialFormData } from "../schemas";

export function MateriaisListPage() {
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [searchCodigo, setSearchCodigo] = React.useState("");
  const [searchDescricao, setSearchDescricao] = React.useState("");

  const debouncedCodigo = useDebounce(searchCodigo, 350);
  const debouncedDescricao = useDebounce(searchDescricao, 350);

  // Queries e Mutations
  const {
    data: materiaisPage,
    isLoading,
    refetch,
    isFetching,
  } = useMateriaisQuery(
    { codigo: debouncedCodigo, descricao: debouncedDescricao },
    page,
    size
  );

  const createMutation = useCreateMaterialMutation();
  const updateMutation = useUpdateMaterialMutation();
  const deleteMutation = useDeleteMaterialMutation();

  // Estados de Modais: View, Edit/Create, Delete
  const [viewTarget, setViewTarget] = React.useState<MaterialResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedMaterial, setSelectedMaterial] = React.useState<MaterialResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<MaterialResponse | null>(null);

  // Feedback toast message
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleOpenCreate = () => {
    setSelectedMaterial(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (material: MaterialResponse) => {
    setViewTarget(null);
    setSelectedMaterial(material);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: MaterialFormData) => {
    if (selectedMaterial) {
      updateMutation.mutate(
        { id: selectedMaterial.id, data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setSelectedMaterial(null);
            showFeedback("Material atualizado com sucesso!");
          },
          onError: (err: any) => {
            alert(err?.response?.data?.message || err?.message || "Erro ao atualizar material.");
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsFormOpen(false);
          showFeedback("Material cadastrado com sucesso!");
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message || err?.message || "Erro ao cadastrar material.");
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          setDeleteTarget(null);
          showFeedback("Material excluído com sucesso!");
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message || err?.message || "Erro ao excluir material.");
        },
      });
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/90 text-white px-4 py-3 shadow-xl backdrop-blur-md animate-fade-in text-sm font-medium">
          <CheckCircle className="h-5 w-5" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[var(--brand-purple)] to-[var(--brand-blue)] text-white shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
                Catálogo de Materiais
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                Consulte, cadastre e gerencie insumos e itens industriais conectados ao backend
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 h-9"
            title="Sincronizar com o backend"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>

          <PermissionGate permission="cadastros.materiais:create">
            <Button
              variant="gradient"
              size="sm"
              onClick={handleOpenCreate}
              className="gap-2 h-9 font-medium shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Material</span>
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Input
              placeholder="Buscar por código (ex: AMOSTRA, MAT)..."
              value={searchCodigo}
              onChange={(e) => {
                setSearchCodigo(e.target.value);
                setPage(0);
              }}
              leftIcon={<Search className="h-4 w-4" />}
            />

            <Input
              placeholder="Buscar por descrição..."
              value={searchDescricao}
              onChange={(e) => {
                setSearchDescricao(e.target.value);
                setPage(0);
              }}
              leftIcon={<Search className="h-4 w-4" />}
            />

            {(searchCodigo || searchDescricao) && (
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchCodigo("");
                    setSearchDescricao("");
                    setPage(0);
                  }}
                  className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table Section (100% width, fully responsive) */}
      <div className="w-full">
        <MaterialTable
          data={materiaisPage}
          isLoading={isLoading}
          onPageChange={setPage}
          onSizeChange={(newSize) => {
            setSize(newSize);
            setPage(0);
          }}
          onView={(material) => setViewTarget(material)}
          onEdit={handleOpenEdit}
          onDelete={(item) => setDeleteTarget(item)}
        />
      </div>

      {/* 1. Modal Dialog: VIEW Material Details */}
      <Dialog
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Detalhes do Material"
        description="Visualização dos dados cadastrais do item no sistema."
        maxWidth="lg"
      >
        {viewTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--muted)]/50 border border-[var(--card-border)]">
              <div className="p-3 rounded-lg bg-[var(--brand-purple)]/10 text-[var(--brand-purple)] shrink-0">
                <Package className="h-6 w-6" />
              </div>
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[var(--brand-purple)] bg-[var(--brand-purple)]/10 px-2.5 py-0.5 rounded border border-[var(--brand-purple)]/20">
                    {viewTarget.codigo}
                  </span>
                  <Badge variant="secondary">
                    {viewTarget.unidadeMedida?.sigla?.toUpperCase() || "-"} -{" "}
                    {viewTarget.unidadeMedida?.nome || "-"}
                  </Badge>
                </div>
                <h3 className="text-base font-semibold text-[var(--foreground)] pt-1">
                  {viewTarget.descricao}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]">
                <span className="text-[var(--muted-foreground)] block mb-1">Identificador Único (UUID)</span>
                <span className="font-mono text-[var(--foreground)] select-all break-all">{viewTarget.id}</span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]">
                <span className="text-[var(--muted-foreground)] block mb-1">Unidade de Medida</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {viewTarget.unidadeMedida?.nome} ({viewTarget.unidadeMedida?.sigla})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--card-border)]">
              <Button variant="outline" onClick={() => setViewTarget(null)}>
                Fechar
              </Button>
              <PermissionGate permission="cadastros.materiais:update">
                <Button
                  variant="gradient"
                  onClick={() => handleOpenEdit(viewTarget)}
                  className="gap-1.5"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Editar este Material</span>
                </Button>
              </PermissionGate>
            </div>
          </div>
        )}
      </Dialog>

      {/* 2. Modal Dialog: CREATE / EDIT Material */}
      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedMaterial ? "Editar Material" : "Novo Cadastro de Material"}
        description={
          selectedMaterial
            ? `Atualize as informações cadastrais do material ${selectedMaterial.codigo}.`
            : "Preencha as informações abaixo para incluir um novo material no catálogo."
        }
      >
        <MaterialForm
          initialData={selectedMaterial}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Dialog>

      {/* 3. Modal Dialog: CONFIRM DELETE */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="md"
        title="Confirmar Exclusão de Material"
        description="Esta ação removerá o material do catálogo ativo no sistema."
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400">
            <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Atenção ao excluir o item:</p>
              <p className="mt-1 text-xs opacity-90">
                Tem certeza que deseja excluir o material abaixo?
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[var(--muted)]/60 p-4 border border-[var(--card-border)] space-y-1">
            <div className="font-mono text-sm font-bold text-[var(--foreground)]">
              {deleteTarget?.codigo}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              {deleteTarget?.descricao}
            </div>
            <div className="text-xs text-[var(--muted-foreground)] pt-1">
              Unidade: <span className="font-semibold">{deleteTarget?.unidadeMedida?.sigla}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--card-border)]">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={deleteMutation.isPending}
              className="gap-1.5 shadow-sm"
            >
              Sim, Excluir Material
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
