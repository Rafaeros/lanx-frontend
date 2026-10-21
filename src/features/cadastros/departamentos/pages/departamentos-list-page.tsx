import * as React from "react";
import { Building2, Plus, RefreshCw, Search } from "lucide-react";
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
import type { DepartamentoRequest, DepartamentoResponse } from "../types";
import {
  useCreateDepartamentoMutation,
  useDeleteDepartamentoMutation,
  useDepartamentosSearchQuery,
  useUpdateDepartamentoMutation,
} from "../hooks/use-departamentos";
import { DepartamentoTable } from "../components/departamento-table";
import { DepartamentoForm } from "../components/departamento-form";
import type { DepartamentoFormData } from "../schemas";

export function DepartamentosListPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [busca, setBusca] = React.useState("");
  const debouncedBusca = useDebounce(busca, 350);

  const { data, isLoading, isFetching, refetch } = useDepartamentosSearchQuery(
    { busca: debouncedBusca },
    page,
    size
  );

  const createMutation = useCreateDepartamentoMutation();
  const updateMutation = useUpdateDepartamentoMutation();
  const deleteMutation = useDeleteDepartamentoMutation();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<DepartamentoResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<DepartamentoResponse | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = React.useCallback((departamento: DepartamentoResponse) => {
    setEditing(departamento);
    setFormOpen(true);
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: DepartamentoFormData) => {
    const request: DepartamentoRequest = { nome: formData.nome.trim() };
    const onError = (err: unknown) =>
      toast.error("Não foi possível salvar o departamento", getApiErrorMessage(err, "Tente novamente."));

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: request },
        {
          onSuccess: () => {
            closeForm();
            toast.success("Departamento atualizado", request.nome);
          },
          onError,
        }
      );
    } else {
      createMutation.mutate(request, {
        onSuccess: () => {
          closeForm();
          toast.success("Departamento cadastrado", request.nome);
        },
        onError,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Departamento excluído", deleteTarget.nome);
        setDeleteTarget(null);
      },
      onError: (err) =>
        toast.error(
          "Não foi possível excluir o departamento",
          getApiErrorMessage(err, "Verifique se ele não está em uso por algum operador.")
        ),
    });
  };

  return (
    <PageShell fill>
      <PageHeader
        icon={Building2}
        title="Departamentos"
        description="Departamentos da fábrica aos quais os operadores pertencem"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-9">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="cadastros.departamentos:create">
              <Button variant="primary" size="sm" onClick={openCreate} className="h-9">
                <Plus className="h-4 w-4" />
                Novo departamento
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
          aria-label="Buscar departamentos"
        />
      </div>

      <DepartamentoTable
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
        title={editing ? "Editar departamento" : "Novo departamento"}
        maxWidth="md"
      >
        <DepartamentoForm
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
        title="Excluir departamento"
        description="O departamento será removido do cadastro. Operadores ou usuários vinculados a ele impedem a exclusão."
        confirmLabel="Excluir departamento"
      >
        <p className="text-sm font-bold text-foreground">{deleteTarget?.nome}</p>
      </ConfirmDialog>
    </PageShell>
  );
}
