import * as React from "react";
import { Tags, Plus, RefreshCw, Search } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { usePagination } from "@/shared/hooks/use-pagination";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog } from "@/shared/components/ui/dialog";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { PageHeader } from "@/shared/components/ui/page-header";
import { PageShell } from "@/shared/components/ui/page-shell";
import { useToast } from "@/shared/components/ui/toast";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import type { TipoNaoConformidadeResponse } from "../types";
import {
  useCreateTipoNaoConformidadeMutation,
  useDeleteTipoNaoConformidadeMutation,
  useTiposNaoConformidadeSearchQuery,
  useUpdateTipoNaoConformidadeMutation,
} from "../hooks/use-tipos-nao-conformidade";
import { TipoNaoConformidadeTable } from "../components/tipo-nao-conformidade-table";
import { TipoNaoConformidadeForm } from "../components/tipo-nao-conformidade-form";
import { toTipoNaoConformidadeRequest, type TipoNaoConformidadeFormData } from "../schemas";

export function TiposNaoConformidadeListPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [busca, setBusca] = React.useState("");
  const debouncedBusca = useDebounce(busca, 350);

  const { data, isLoading, isFetching, refetch } = useTiposNaoConformidadeSearchQuery(
    { busca: debouncedBusca },
    page,
    size
  );

  const createMutation = useCreateTipoNaoConformidadeMutation();
  const updateMutation = useUpdateTipoNaoConformidadeMutation();
  const deleteMutation = useDeleteTipoNaoConformidadeMutation();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TipoNaoConformidadeResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<TipoNaoConformidadeResponse | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = React.useCallback((tipo: TipoNaoConformidadeResponse) => {
    setEditing(tipo);
    setFormOpen(true);
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: TipoNaoConformidadeFormData) => {
    const request = toTipoNaoConformidadeRequest(formData);
    const onError = (err: unknown) =>
      toast.error("Não foi possível salvar o tipo", getApiErrorMessage(err, "Tente novamente."));

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: request },
        {
          onSuccess: () => {
            closeForm();
            toast.success("Tipo atualizado", request.nome);
          },
          onError,
        }
      );
    } else {
      createMutation.mutate(request, {
        onSuccess: () => {
          closeForm();
          toast.success("Tipo cadastrado", request.nome);
        },
        onError,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Tipo excluído", deleteTarget.nome);
        setDeleteTarget(null);
      },
      onError: (err) =>
        toast.error(
          "Não foi possível excluir o tipo",
          getApiErrorMessage(err, "Verifique se ele não está em uso por alguma não conformidade.")
        ),
    });
  };

  return (
    <PageShell fill>
      <PageHeader
        icon={Tags}
        title="Tipos de não conformidade"
        description="Defeitos registrados nas não conformidades de teste e inspeção (ex.: inversão, conector errado)"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-9">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="cadastros.tipos-nao-conformidade:create">
              <Button variant="primary" size="sm" onClick={openCreate} className="h-9">
                <Plus className="h-4 w-4" />
                Novo tipo
              </Button>
            </PermissionGate>
          </>
        }
      />

      <div className="max-w-md">
        <Input
          placeholder="Buscar por nome"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPage(0);
          }}
          leftIcon={<Search className="h-4 w-4" />}
          aria-label="Buscar tipos de não conformidade"
        />
      </div>

      <TipoNaoConformidadeTable
        data={data}
        isLoading={isLoading}
        onPageChange={setPage}
        onSizeChange={(newSize) => {
          setSize(newSize);
          setPage(0);
        }}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <Dialog
        open={formOpen}
        onClose={closeForm}
        title={editing ? "Editar tipo de não conformidade" : "Novo tipo de não conformidade"}
        maxWidth="md"
      >
        <TipoNaoConformidadeForm
          key={editing?.id ?? "new"}
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title="Excluir tipo de não conformidade"
        description="O tipo será removido do cadastro. Não conformidades registradas com ele impedem a exclusão."
        confirmLabel="Excluir tipo"
      >
        <p className="text-sm font-bold text-foreground">{deleteTarget?.nome}</p>
      </ConfirmDialog>
    </PageShell>
  );
}
