import * as React from "react";
import { Plus, Search, RefreshCw, Edit2, Truck } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { usePagination } from "@/shared/hooks/use-pagination";
import {
  useFornecedoresQuery,
  useCreateFornecedorMutation,
  useUpdateFornecedorMutation,
  useDeleteFornecedorMutation,
} from "../api/use-fornecedores";
import { FornecedorTable } from "../components/fornecedor-table";
import { FornecedorForm } from "../components/fornecedor-form";
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
import type { FornecedorRequest, FornecedorResponse } from "../types";
import type { FornecedorFormData } from "../schemas";

/** Converte o formulário no corpo da API: select vazio = sem país. */
function toRequest(data: FornecedorFormData): FornecedorRequest {
  return { nome: data.nome.trim(), paisId: data.paisId || null };
}

export function FornecedoresListPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [busca, setBusca] = React.useState("");
  const debouncedBusca = useDebounce(busca, 350);

  const { data: fornecedoresPage, isLoading, refetch, isFetching } = useFornecedoresQuery(
    { busca: debouncedBusca },
    page,
    size
  );

  const createMutation = useCreateFornecedorMutation();
  const updateMutation = useUpdateFornecedorMutation();
  const deleteMutation = useDeleteFornecedorMutation();

  // Estados de Modais: View, Edit/Create, Delete
  const [viewTarget, setViewTarget] = React.useState<FornecedorResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = React.useState<FornecedorResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<FornecedorResponse | null>(null);

  const handleOpenCreate = () => {
    setSelectedFornecedor(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (fornecedor: FornecedorResponse) => {
    setViewTarget(null);
    setSelectedFornecedor(fornecedor);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: FornecedorFormData) => {
    const request = toRequest(data);
    if (selectedFornecedor) {
      updateMutation.mutate(
        { id: selectedFornecedor.id, data: request },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setSelectedFornecedor(null);
            toast.success("Fornecedor atualizado", request.nome);
          },
          onError: (err) =>
            toast.error("Não foi possível atualizar o fornecedor", getApiErrorMessage(err, "Tente novamente.")),
        }
      );
    } else {
      createMutation.mutate(request, {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success("Fornecedor cadastrado", request.nome);
        },
        onError: (err) =>
          toast.error("Não foi possível cadastrar o fornecedor", getApiErrorMessage(err, "Tente novamente.")),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          toast.success("Fornecedor excluído", deleteTarget.nome);
          setDeleteTarget(null);
        },
        onError: (err) =>
          toast.error("Não foi possível excluir o fornecedor", getApiErrorMessage(err, "Tente novamente.")),
      });
    }
  };

  return (
    <PageShell fill>
      <PageHeader
        icon={Truck}
        title="Fornecedores"
        description="Consulte, cadastre e mantenha os fornecedores usados nos pedidos de compra"
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
            <PermissionGate permission="cadastros.fornecedores:create">
              <Button variant="primary" size="sm" onClick={handleOpenCreate} className="h-9">
                <Plus className="h-4 w-4" />
                Novo fornecedor
              </Button>
            </PermissionGate>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 sm:max-w-md">
          <Input
            placeholder="Buscar por nome"
            aria-label="Buscar por nome"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPage(0);
            }}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        {busca && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setBusca("");
              setPage(0);
            }}
            className="self-start text-muted-foreground sm:self-center"
          >
            Limpar filtros
          </Button>
        )}
      </div>

      <FornecedorTable
        data={fornecedoresPage}
        isLoading={isLoading}
        onPageChange={setPage}
        onSizeChange={(newSize) => {
          setSize(newSize);
          setPage(0);
        }}
        onView={(fornecedor) => setViewTarget(fornecedor)}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
      />

      {/* 1. Modal Dialog: VIEW Fornecedor */}
      <Dialog
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Detalhes do fornecedor"
        description="Visualização dos dados cadastrais do fornecedor no sistema."
        maxWidth="lg"
      >
        {viewTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div className="space-y-1 overflow-hidden">
                <Badge variant="secondary">
                  {viewTarget.pais ? `${viewTarget.pais.codigoIso2} - ${viewTarget.pais.nome}` : "Sem país"}
                </Badge>
                <h3 className="text-base font-semibold text-foreground pt-1">{viewTarget.nome}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-card border border-border">
                <span className="text-muted-foreground block mb-1">Identificador Único (UUID)</span>
                <span className="font-mono text-foreground select-all break-all">{viewTarget.id}</span>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <span className="text-muted-foreground block mb-1">País</span>
                <span className="font-semibold text-foreground">{viewTarget.pais?.nome ?? "Não informado"}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button variant="outline" onClick={() => setViewTarget(null)}>
                Fechar
              </Button>
              <PermissionGate permission="cadastros.fornecedores:update">
                <Button variant="primary" onClick={() => handleOpenEdit(viewTarget)}>
                  <Edit2 className="h-4 w-4" />
                  <span>Editar fornecedor</span>
                </Button>
              </PermissionGate>
            </div>
          </div>
        )}
      </Dialog>

      {/* 2. Modal Dialog: CREATE / EDIT Fornecedor */}
      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedFornecedor ? "Editar fornecedor" : "Novo fornecedor"}
        description={
          selectedFornecedor
            ? `Atualize as informações cadastrais de ${selectedFornecedor.nome}.`
            : "Preencha as informações abaixo para incluir um novo fornecedor."
        }
      >
        <FornecedorForm
          key={selectedFornecedor?.id ?? "new"}
          initialData={selectedFornecedor}
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
        title="Excluir fornecedor"
        description="O fornecedor sai do cadastro; pedidos já importados não são afetados."
        confirmLabel="Excluir fornecedor"
      >
        <p className="text-sm font-bold text-foreground">{deleteTarget?.nome}</p>
        <p className="pt-1 text-xs text-muted-foreground">
          País: <span className="font-semibold">{deleteTarget?.pais?.nome ?? "-"}</span>
        </p>
      </ConfirmDialog>
    </PageShell>
  );
}
