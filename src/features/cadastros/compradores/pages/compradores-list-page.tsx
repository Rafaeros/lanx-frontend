import * as React from "react";
import { Plus, RefreshCw, Search, ShoppingBag } from "lucide-react";
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
import type { CompradorRequest, CompradorResponse } from "../types";
import {
  useCreateCompradorMutation,
  useDeleteCompradorMutation,
  useCompradoresSearchQuery,
  useUpdateCompradorMutation,
} from "../hooks/use-compradores";
import { CompradorTable } from "../components/comprador-table";
import { CompradorForm } from "../components/comprador-form";
import type { CompradorFormData } from "../schemas";

export function CompradoresListPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [busca, setBusca] = React.useState("");
  const debouncedBusca = useDebounce(busca, 350);

  const { data, isLoading, isFetching, refetch } = useCompradoresSearchQuery(
    { busca: debouncedBusca },
    page,
    size
  );

  const createMutation = useCreateCompradorMutation();
  const updateMutation = useUpdateCompradorMutation();
  const deleteMutation = useDeleteCompradorMutation();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CompradorResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<CompradorResponse | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = React.useCallback((comprador: CompradorResponse) => {
    setEditing(comprador);
    setFormOpen(true);
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: CompradorFormData) => {
    // Select vazio = sem usuário vinculado
    const request: CompradorRequest = { nome: formData.nome.trim(), userId: formData.userId || null };
    const onError = (err: unknown) =>
      toast.error("Não foi possível salvar o comprador", getApiErrorMessage(err, "Tente novamente."));

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: request },
        {
          onSuccess: () => {
            closeForm();
            toast.success("Comprador atualizado", request.nome);
          },
          onError,
        }
      );
    } else {
      createMutation.mutate(request, {
        onSuccess: () => {
          closeForm();
          toast.success("Comprador cadastrado", request.nome);
        },
        onError,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Comprador excluído", deleteTarget.nome);
        setDeleteTarget(null);
      },
      onError: (err) =>
        toast.error("Não foi possível excluir o comprador", getApiErrorMessage(err, "Tente novamente.")),
    });
  };

  return (
    <PageShell fill>
      <PageHeader
        icon={ShoppingBag}
        title="Compradores"
        description="Compradores vindos do ERP e o usuário do LANX de cada um"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-9">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="cadastros.compradores:create">
              <Button variant="primary" size="sm" onClick={openCreate} className="h-9">
                <Plus className="h-4 w-4" />
                Novo comprador
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
          aria-label="Buscar compradores"
        />
      </div>

      <CompradorTable
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
        title={editing ? "Editar comprador" : "Novo comprador"}
        maxWidth="md"
      >
        <CompradorForm
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
        title="Excluir comprador"
        description="O comprador sai do cadastro. Itens importados do ERP que usam o comprador impedem a exclusão."
        confirmLabel="Excluir comprador"
      >
        <p className="text-sm font-bold text-foreground">{deleteTarget?.nome}</p>
        <p className="pt-1 text-xs text-muted-foreground">
          Usuário: <span className="font-semibold">{deleteTarget?.usuario?.username ?? "sem vínculo"}</span>
        </p>
      </ConfirmDialog>
    </PageShell>
  );
}
