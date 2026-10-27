import * as React from "react";
import { Plus, RefreshCw, Search, ClipboardList } from "lucide-react";
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
import type { OrdemProducaoRequest, OrdemProducaoResponse } from "../types";
import {
  useCreateOrdemProducaoMutation,
  useDeleteOrdemProducaoMutation,
  useOrdensProducaoSearchQuery,
  useUpdateOrdemProducaoMutation,
} from "../hooks/use-ordens-producao";
import { OrdemProducaoTable } from "../components/ordem-producao-table";
import { OrdemProducaoForm } from "../components/ordem-producao-form";
import type { OrdemProducaoFormData } from "../schemas";

export function OrdensProducaoListPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [busca, setBusca] = React.useState("");
  const debouncedBusca = useDebounce(busca, 350);

  const { data, isLoading, isFetching, refetch } = useOrdensProducaoSearchQuery(
    { busca: debouncedBusca },
    page,
    size
  );

  const createMutation = useCreateOrdemProducaoMutation();
  const updateMutation = useUpdateOrdemProducaoMutation();
  const deleteMutation = useDeleteOrdemProducaoMutation();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<OrdemProducaoResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<OrdemProducaoResponse | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = React.useCallback((ordem: OrdemProducaoResponse) => {
    setEditing(ordem);
    setFormOpen(true);
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: OrdemProducaoFormData) => {
    const request: OrdemProducaoRequest = {
      codigo: formData.codigo.trim(),
      clienteId: formData.clienteId,
      materialId: formData.materialId,
      quantidade: Number(formData.quantidade.replace(",", ".")),
      previsao: formData.previsao,
      etapaAtual: formData.etapaAtual.trim() || null,
    };
    const onError = (err: unknown) =>
      toast.error("Não foi possível salvar a ordem de produção", getApiErrorMessage(err, "Tente novamente."));

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: request },
        {
          onSuccess: () => {
            closeForm();
            toast.success("Ordem de produção atualizada", request.codigo);
          },
          onError,
        }
      );
    } else {
      createMutation.mutate(request, {
        onSuccess: () => {
          closeForm();
          toast.success("Ordem de produção cadastrada", request.codigo);
        },
        onError,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Ordem de produção excluída", deleteTarget.codigo);
        setDeleteTarget(null);
      },
      onError: (err) =>
        toast.error("Não foi possível excluir a ordem de produção", getApiErrorMessage(err, "Tente novamente.")),
    });
  };

  return (
    <PageShell fill>
      <PageHeader
        icon={ClipboardList}
        title="Ordens de produção"
        description="O que produzir, para qual cliente, quanto e até quando"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-9">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="producao.ordens-producao:create">
              <Button variant="primary" size="sm" onClick={openCreate} className="h-9">
                <Plus className="h-4 w-4" />
                Nova OP
              </Button>
            </PermissionGate>
          </>
        }
      />

      <div className="max-w-md">
        <Input
          placeholder="Buscar por OP, cliente ou produto"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPage(0);
          }}
          leftIcon={<Search className="h-4 w-4" />}
          aria-label="Buscar ordens de produção"
        />
      </div>

      <OrdemProducaoTable
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
        title={editing ? "Editar ordem de produção" : "Nova ordem de produção"}
        maxWidth="lg"
      >
        <OrdemProducaoForm
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
        title="Excluir ordem de produção"
        description="A OP sai da lista e o código fica livre para uma nova ordem."
        confirmLabel="Excluir OP"
      >
        <p className="text-sm font-bold text-foreground">{deleteTarget?.codigo}</p>
      </ConfirmDialog>
    </PageShell>
  );
}
