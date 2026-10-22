import * as React from "react";
import { Plus, Search, RefreshCw, Edit2, Package } from "lucide-react";
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
import { Badge } from "@/shared/components/ui/badge";
import { Dialog } from "@/shared/components/ui/dialog";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { PageHeader } from "@/shared/components/ui/page-header";
import { PageShell } from "@/shared/components/ui/page-shell";
import { useToast } from "@/shared/components/ui/toast";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import type { MaterialResponse, TipoMaterial } from "../types";
import { SearchSelect } from "@/shared/components/ui/search-select";
import { TIPOS_MATERIAL } from "../lib/tipo-material";
import { TipoMaterialBadge } from "../components/tipo-material-badge";
import type { MaterialFormData } from "../schemas";

export function MateriaisListPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [searchCodigo, setSearchCodigo] = React.useState("");
  const [searchDescricao, setSearchDescricao] = React.useState("");
  const [tipo, setTipo] = React.useState<TipoMaterial | "">("");

  const debouncedCodigo = useDebounce(searchCodigo, 350);
  const debouncedDescricao = useDebounce(searchDescricao, 350);

  // Queries e Mutations
  const {
    data: materiaisPage,
    isLoading,
    refetch,
    isFetching,
  } = useMateriaisQuery(
    { codigo: debouncedCodigo, descricao: debouncedDescricao, tipo },
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
            toast.success("Material atualizado", data.codigo);
          },
          onError: (err) =>
            toast.error("Não foi possível atualizar o material", getApiErrorMessage(err, "Tente novamente.")),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success("Material cadastrado", data.codigo);
        },
        onError: (err) =>
          toast.error("Não foi possível cadastrar o material", getApiErrorMessage(err, "Tente novamente.")),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          toast.success("Material excluído", deleteTarget.codigo);
          setDeleteTarget(null);
        },
        onError: (err) =>
          toast.error("Não foi possível excluir o material", getApiErrorMessage(err, "Tente novamente.")),
      });
    }
  };

  return (
    <PageShell fill>
      <PageHeader
        icon={Package}
        title="Materiais"
        description="Consulte, cadastre e mantenha os itens usados em compras e produção"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9"
              title="Recarregar lista"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="cadastros.materiais:create">
              <Button variant="primary" size="sm" onClick={handleOpenCreate} className="h-9">
                <Plus className="h-4 w-4" />
                Novo material
              </Button>
            </PermissionGate>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-[1fr_1fr_14rem]">
          <Input
            placeholder="Buscar por código"
            aria-label="Buscar por código"
            value={searchCodigo}
            onChange={(e) => {
              setSearchCodigo(e.target.value);
              setPage(0);
            }}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Input
            placeholder="Buscar por descrição"
            aria-label="Buscar por descrição"
            value={searchDescricao}
            onChange={(e) => {
              setSearchDescricao(e.target.value);
              setPage(0);
            }}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <SearchSelect
            aria-label="Filtrar por tipo"
            options={TIPOS_MATERIAL.map((t) => ({ value: t.value, label: t.label, description: t.description }))}
            value={tipo}
            onChange={(value) => {
              setTipo(value as TipoMaterial | "");
              setPage(0);
            }}
            placeholder="Todos os tipos"
            searchPlaceholder="Buscar tipo"
            clearable
          />
        </div>
        {(searchCodigo || searchDescricao || tipo) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchCodigo("");
              setSearchDescricao("");
              setTipo("");
              setPage(0);
            }}
            className="self-start text-muted-foreground sm:self-center"
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Table Section (100% width, fully responsive) */}
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

      {/* 1. Modal Dialog: VIEW Material Details */}
      <Dialog
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Detalhes do material"
        description="Visualização dos dados cadastrais do item no sistema."
        maxWidth="lg"
      >
        {viewTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                <Package className="h-6 w-6" />
              </div>
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20">
                    {viewTarget.codigo}
                  </span>
                  <Badge variant="secondary">
                    {viewTarget.unidadeMedida?.sigla?.toUpperCase() || "-"} -{" "}
                    {viewTarget.unidadeMedida?.nome || "-"}
                  </Badge>
                  <TipoMaterialBadge tipo={viewTarget.tipo} />
                </div>
                <h3 className="text-base font-semibold text-foreground pt-1">
                  {viewTarget.descricao}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-card border border-border">
                <span className="text-muted-foreground block mb-1">Identificador Único (UUID)</span>
                <span className="font-mono text-foreground select-all break-all">{viewTarget.id}</span>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <span className="text-muted-foreground block mb-1">Unidade de Medida</span>
                <span className="font-semibold text-foreground">
                  {viewTarget.unidadeMedida?.nome} ({viewTarget.unidadeMedida?.sigla})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button variant="outline" onClick={() => setViewTarget(null)}>
                Fechar
              </Button>
              <PermissionGate permission="cadastros.materiais:update">
                <Button variant="primary" onClick={() => handleOpenEdit(viewTarget)}>
                  <Edit2 className="h-4 w-4" />
                  <span>Editar material</span>
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
        title={selectedMaterial ? "Editar material" : "Novo material"}
        description={
          selectedMaterial
            ? `Atualize as informações cadastrais do material ${selectedMaterial.codigo}.`
            : "Preencha as informações abaixo para incluir um novo material no catálogo."
        }
      >
        <MaterialForm
          key={selectedMaterial?.id ?? "new"}
          initialData={selectedMaterial}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Dialog>

      {/* 3. Confirmação de exclusão */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        title="Excluir material"
        description="O material será removido do catálogo."
        confirmLabel="Excluir material"
      >
        <p className="font-mono text-sm font-bold text-foreground">{deleteTarget?.codigo}</p>
        <p className="text-xs text-muted-foreground">{deleteTarget?.descricao}</p>
        <p className="pt-1 text-xs text-muted-foreground">
          Unidade: <span className="font-semibold">{deleteTarget?.unidadeMedida?.sigla}</span>
        </p>
      </ConfirmDialog>
    </PageShell>
  );
}
