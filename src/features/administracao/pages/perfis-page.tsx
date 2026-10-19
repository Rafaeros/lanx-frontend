import * as React from "react";
import { KeyRound, Plus, RefreshCw } from "lucide-react";
import { usePagination } from "@/shared/hooks/use-pagination";
import { paginate } from "@/shared/lib/pagination";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { Button } from "@/shared/components/ui/button";
import { Dialog } from "@/shared/components/ui/dialog";
import { PageHeader } from "@/shared/components/ui/page-header";
import { useToast } from "@/shared/components/ui/toast";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { useCan } from "@/features/auth/hooks/use-can";
import type { RoleResponse } from "@/shared/api/schema";
import {
  useCreatePerfilMutation,
  useFeatureCatalogQuery,
  usePerfisQuery,
  useUpdatePerfilMutation,
} from "../hooks/use-perfis";
import { PerfisTable } from "../components/perfis-table";
import { PerfilForm } from "../components/perfil-form";
import { isSystemRole } from "../lib/permissions";
import type { PerfilFormData } from "../lib/schemas";

type DialogState = { mode: "create" } | { mode: "edit" | "view"; role: RoleResponse } | null;

export function PerfisPage() {
  const toast = useToast();
  const { can } = useCan();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });

  const { data: perfis = [], isLoading, isFetching, refetch } = usePerfisQuery();
  const { data: features = [] } = useFeatureCatalogQuery();
  const createMutation = useCreatePerfilMutation();
  const updateMutation = useUpdatePerfilMutation();

  const [dialog, setDialog] = React.useState<DialogState>(null);
  const close = () => setDialog(null);

  const openRole = React.useCallback(
    (role: RoleResponse) =>
      setDialog({
        mode: can("administracao.permissoes:update") && !isSystemRole(role) ? "edit" : "view",
        role,
      }),
    [can]
  );

  const handleSubmit = (data: PerfilFormData) => {
    const onError = (err: unknown) =>
      toast.error("Não foi possível salvar o perfil", getApiErrorMessage(err, "Tente novamente."));
    const name = data.name.toUpperCase();

    if (dialog?.mode === "edit") {
      updateMutation.mutate(
        { id: dialog.role.id, data },
        {
          onSuccess: () => {
            close();
            toast.success("Perfil atualizado", "As permissões já valem para os usuários deste perfil.");
          },
          onError,
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          close();
          toast.success("Perfil criado", name);
        },
        onError,
      });
    }
  };

  const title =
    dialog?.mode === "create"
      ? "Novo perfil"
      : dialog?.mode === "edit"
        ? `Editar perfil ${dialog.role.name}`
        : dialog
          ? `Perfil ${dialog.role.name}`
          : "";

  const description =
    dialog && dialog.mode === "view" && isSystemRole(dialog.role)
      ? "Perfil do sistema: recebe automaticamente todas as permissões e não pode ser alterado."
      : "Marque o que os usuários deste perfil podem fazer em cada módulo.";

  return (
    <div className="space-y-6">
      <PageHeader
        icon={KeyRound}
        title="Perfis e permissões"
        description="Agrupe permissões em perfis e atribua os perfis aos usuários"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-9">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="administracao.permissoes:create">
              <Button variant="primary" size="sm" onClick={() => setDialog({ mode: "create" })} className="h-9">
                <Plus className="h-4 w-4" />
                Novo perfil
              </Button>
            </PermissionGate>
          </>
        }
      />

      <PerfisTable
        data={paginate(perfis, page, size)}
        isLoading={isLoading}
        onPageChange={setPage}
        onSizeChange={(newSize) => {
          setSize(newSize);
          setPage(0);
        }}
        onOpen={openRole}
      />

      <Dialog open={!!dialog} onClose={close} title={title} description={description} maxWidth="5xl" scrollable>
        {dialog && (
          <PerfilForm
            key={dialog.mode === "create" ? "new" : dialog.role.id}
            initialData={dialog.mode === "create" ? null : dialog.role}
            features={features}
            readOnly={dialog.mode === "view"}
            onSubmit={handleSubmit}
            onCancel={close}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </Dialog>
    </div>
  );
}
