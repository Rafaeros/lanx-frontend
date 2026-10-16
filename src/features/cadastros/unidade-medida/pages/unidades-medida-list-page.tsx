import * as React from "react";
import { Plus, RefreshCw, Ruler, Search } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { usePagination } from "@/shared/hooks/use-pagination";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog } from "@/shared/components/ui/dialog";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { PageHeader } from "@/shared/components/ui/page-header";
import { useToast } from "@/shared/components/ui/toast";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import type { UnidadeMedidaResponse } from "@/shared/api/schema";
import {
  useCreateUnidadeMedidaMutation,
  useDeleteUnidadeMedidaMutation,
  useUnidadesMedidaSearchQuery,
  useUpdateUnidadeMedidaMutation,
} from "../hooks/use-unidades-medida";
import { UnidadeMedidaTable } from "../components/unidade-medida-table";
import { UnidadeMedidaForm } from "../components/unidade-medida-form";
import type { UnidadeMedidaFormData } from "../schemas";

export function UnidadesMedidaListPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [busca, setBusca] = React.useState("");
  const debouncedBusca = useDebounce(busca, 350);

  const { data, isLoading, isFetching, refetch } = useUnidadesMedidaSearchQuery(
    { busca: debouncedBusca },
    page,
    size
  );

  const createMutation = useCreateUnidadeMedidaMutation();
  const updateMutation = useUpdateUnidadeMedidaMutation();
  const deleteMutation = useDeleteUnidadeMedidaMutation();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<UnidadeMedidaResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<UnidadeMedidaResponse | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = React.useCallback((unidade: UnidadeMedidaResponse) => {
    setEditing(unidade);
    setFormOpen(true);
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: UnidadeMedidaFormData) => {
    const onError = (err: unknown) =>
      toast.error("Não foi possível salvar a unidade", getApiErrorMessage(err, "Tente novamente."));

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: formData },
        {
          onSuccess: () => {
            closeForm();
            toast.success("Unidade atualizada", `${formData.nome} (${formData.sigla})`);
          },
          onError,
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          closeForm();
          toast.success("Unidade cadastrada", `${formData.nome} (${formData.sigla})`);
        },
        onError,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Unidade excluída", deleteTarget.nome);
        setDeleteTarget(null);
      },
      onError: (err) =>
        toast.error(
          "Não foi possível excluir a unidade",
          getApiErrorMessage(err, "Verifique se ela não está em uso por algum material.")
        ),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Ruler}
        title="Unidades de medida"
        description="Unidades usadas no cadastro de materiais e nas compras"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-9">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="cadastros.unidade-medida:create">
              <Button variant="primary" size="sm" onClick={openCreate} className="h-9">
                <Plus className="h-4 w-4" />
                Nova unidade
              </Button>
            </PermissionGate>
          </>
        }
      />

      <div className="max-w-md">
        <Input
          placeholder="Buscar por nome ou sigla"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPage(0);
          }}
          leftIcon={<Search className="h-4 w-4" />}
          aria-label="Buscar unidades de medida"
        />
      </div>

      <UnidadeMedidaTable
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
        title={editing ? "Editar unidade de medida" : "Nova unidade de medida"}
        maxWidth="md"
      >
        <UnidadeMedidaForm
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
        title="Excluir unidade de medida"
        description="A unidade será removida do cadastro. Materiais que a utilizam podem impedir a exclusão."
        confirmLabel="Excluir unidade"
      >
        <p className="font-mono text-sm font-bold text-foreground">{deleteTarget?.sigla}</p>
        <p className="text-xs text-muted-foreground">{deleteTarget?.nome}</p>
      </ConfirmDialog>
    </div>
  );
}
