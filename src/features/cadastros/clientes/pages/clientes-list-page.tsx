import * as React from "react";
import { Plus, RefreshCw, Search, Briefcase } from "lucide-react";
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
import type { ClienteRequest, ClienteResponse } from "../types";
import {
  useCreateClienteMutation,
  useDeleteClienteMutation,
  useClientesSearchQuery,
  useUpdateClienteMutation,
} from "../hooks/use-clientes";
import { ClienteTable } from "../components/cliente-table";
import { ClienteForm } from "../components/cliente-form";
import type { ClienteFormData } from "../schemas";
import { soDigitos } from "../lib/cnpj";

export function ClientesListPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [busca, setBusca] = React.useState("");
  const debouncedBusca = useDebounce(busca, 350);

  const { data, isLoading, isFetching, refetch } = useClientesSearchQuery(
    { busca: debouncedBusca },
    page,
    size
  );

  const createMutation = useCreateClienteMutation();
  const updateMutation = useUpdateClienteMutation();
  const deleteMutation = useDeleteClienteMutation();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ClienteResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ClienteResponse | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = React.useCallback((cliente: ClienteResponse) => {
    setEditing(cliente);
    setFormOpen(true);
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: ClienteFormData) => {
    const cnpj = soDigitos(formData.cnpj);
    const request: ClienteRequest = { nome: formData.nome.trim(), cnpj: cnpj || null };
    const onError = (err: unknown) =>
      toast.error("Não foi possível salvar o cliente", getApiErrorMessage(err, "Tente novamente."));

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: request },
        {
          onSuccess: () => {
            closeForm();
            toast.success("Cliente atualizado", request.nome);
          },
          onError,
        }
      );
    } else {
      createMutation.mutate(request, {
        onSuccess: () => {
          closeForm();
          toast.success("Cliente cadastrado", request.nome);
        },
        onError,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Cliente excluído", deleteTarget.nome);
        setDeleteTarget(null);
      },
      onError: (err) =>
        toast.error(
          "Não foi possível excluir o cliente",
          getApiErrorMessage(err, "Verifique se ele não está em uso por ordens de produção.")
        ),
    });
  };

  return (
    <PageShell fill>
      <PageHeader
        icon={Briefcase}
        title="Clientes"
        description="Clientes atendidos pelas ordens de produção"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-9">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="cadastros.clientes:create">
              <Button variant="primary" size="sm" onClick={openCreate} className="h-9">
                <Plus className="h-4 w-4" />
                Novo cliente
              </Button>
            </PermissionGate>
          </>
        }
      />

      <div className="max-w-md">
        <Input
          placeholder="Buscar por nome ou CNPJ"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPage(0);
          }}
          leftIcon={<Search className="h-4 w-4" />}
          aria-label="Buscar clientes"
        />
      </div>

      <ClienteTable
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
        title={editing ? "Editar cliente" : "Novo cliente"}
        maxWidth="md"
      >
        <ClienteForm
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
        title="Excluir cliente"
        description="O cliente será removido do cadastro. Ordens de produção do cliente impedem a exclusão."
        confirmLabel="Excluir cliente"
      >
        <p className="text-sm font-bold text-foreground">{deleteTarget?.nome}</p>
      </ConfirmDialog>
    </PageShell>
  );
}
