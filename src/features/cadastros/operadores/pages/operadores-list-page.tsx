import * as React from "react";
import { HardHat, Plus, RefreshCw, Search } from "lucide-react";
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
import type { OperadorRequest, OperadorResponse } from "../types";
import {
  useCreateOperadorMutation,
  useDeleteOperadorMutation,
  useOperadoresSearchQuery,
  useUpdateOperadorMutation,
} from "../hooks/use-operadores";
import { OperadorTable } from "../components/operador-table";
import { OperadorForm } from "../components/operador-form";
import type { OperadorFormData } from "../schemas";

export function OperadoresListPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [busca, setBusca] = React.useState("");
  const debouncedBusca = useDebounce(busca, 350);

  const { data, isLoading, isFetching, refetch } = useOperadoresSearchQuery(
    { busca: debouncedBusca },
    page,
    size
  );

  const createMutation = useCreateOperadorMutation();
  const updateMutation = useUpdateOperadorMutation();
  const deleteMutation = useDeleteOperadorMutation();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<OperadorResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<OperadorResponse | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = React.useCallback((operador: OperadorResponse) => {
    setEditing(operador);
    setFormOpen(true);
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: OperadorFormData) => {
    // Select vazio = sem departamento / sem usuário
    const request: OperadorRequest = {
      nome: formData.nome.trim(),
      departamentoId: formData.departamentoId || null,
      userId: formData.userId || null,
    };
    const onError = (err: unknown) =>
      toast.error("Não foi possível salvar o operador", getApiErrorMessage(err, "Tente novamente."));

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: request },
        {
          onSuccess: () => {
            closeForm();
            toast.success("Operador atualizado", request.nome);
          },
          onError,
        }
      );
    } else {
      createMutation.mutate(request, {
        onSuccess: () => {
          closeForm();
          toast.success("Operador cadastrado", request.nome);
        },
        onError,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Operador excluído", deleteTarget.nome);
        setDeleteTarget(null);
      },
      onError: (err) =>
        toast.error("Não foi possível excluir o operador", getApiErrorMessage(err, "Tente novamente.")),
    });
  };

  return (
    <PageShell fill>
      <PageHeader
        icon={HardHat}
        title="Operadores"
        description="Operadores da produção e o departamento de cada um"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-9">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="cadastros.operadores:create">
              <Button variant="primary" size="sm" onClick={openCreate} className="h-9">
                <Plus className="h-4 w-4" />
                Novo operador
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
          aria-label="Buscar operadores"
        />
      </div>

      <OperadorTable
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
        title={editing ? "Editar operador" : "Novo operador"}
        maxWidth="md"
      >
        <OperadorForm
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
        title="Excluir operador"
        description="O operador sai do cadastro."
        confirmLabel="Excluir operador"
      >
        <p className="text-sm font-bold text-foreground">{deleteTarget?.nome}</p>
        <p className="pt-1 text-xs text-muted-foreground">
          Departamento: <span className="font-semibold">{deleteTarget?.departamento?.nome ?? "-"}</span>
        </p>
      </ConfirmDialog>
    </PageShell>
  );
}
