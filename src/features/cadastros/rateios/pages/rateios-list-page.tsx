import * as React from "react";
import { Plus, RefreshCw, Search, Split } from "lucide-react";
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
import type { RateioRequest, RateioResponse } from "../types";
import {
  useCreateRateioMutation,
  useDeleteRateioMutation,
  useRateiosSearchQuery,
  useUpdateRateioMutation,
} from "../hooks/use-rateios";
import { RateioTable } from "../components/rateio-table";
import { RateioForm } from "../components/rateio-form";
import type { RateioFormData } from "../schemas";

export function RateiosListPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [busca, setBusca] = React.useState("");
  const debouncedBusca = useDebounce(busca, 350);

  const { data, isLoading, isFetching, refetch } = useRateiosSearchQuery(
    { busca: debouncedBusca },
    page,
    size
  );

  const createMutation = useCreateRateioMutation();
  const updateMutation = useUpdateRateioMutation();
  const deleteMutation = useDeleteRateioMutation();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<RateioResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<RateioResponse | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = React.useCallback((rateio: RateioResponse) => {
    setEditing(rateio);
    setFormOpen(true);
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: RateioFormData) => {
    const request: RateioRequest = { nome: formData.nome.trim() };
    const onError = (err: unknown) =>
      toast.error("Não foi possível salvar o rateio", getApiErrorMessage(err, "Tente novamente."));

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: request },
        {
          onSuccess: () => {
            closeForm();
            toast.success("Rateio atualizado", request.nome);
          },
          onError,
        }
      );
    } else {
      createMutation.mutate(request, {
        onSuccess: () => {
          closeForm();
          toast.success("Rateio cadastrado", request.nome);
        },
        onError,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Rateio excluído", deleteTarget.nome);
        setDeleteTarget(null);
      },
      onError: (err) =>
        toast.error(
          "Não foi possível excluir o rateio",
          getApiErrorMessage(err, "Verifique se ele não está em uso por itens importados.")
        ),
    });
  };

  return (
    <PageShell fill>
      <PageHeader
        icon={Split}
        title="Rateios"
        description="Centros de rateio dos pedidos de compra, usados na análise de pedidos e no IQF"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-9">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="cadastros.rateios:create">
              <Button variant="primary" size="sm" onClick={openCreate} className="h-9">
                <Plus className="h-4 w-4" />
                Novo rateio
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
          aria-label="Buscar rateios"
        />
      </div>

      <RateioTable
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
        title={editing ? "Editar rateio" : "Novo rateio"}
        maxWidth="md"
      >
        <RateioForm
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
        title="Excluir rateio"
        description="O rateio será removido do cadastro. Itens importados do ERP que usam o rateio impedem a exclusão."
        confirmLabel="Excluir rateio"
      >
        <p className="text-sm font-bold text-foreground">{deleteTarget?.nome}</p>
      </ConfirmDialog>
    </PageShell>
  );
}
