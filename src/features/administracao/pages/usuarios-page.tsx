import * as React from "react";
import { Plus, RefreshCw, Search, UserCog } from "lucide-react";
import { usePagination } from "@/shared/hooks/use-pagination";
import { paginate } from "@/shared/lib/pagination";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog } from "@/shared/components/ui/dialog";
import { PageHeader } from "@/shared/components/ui/page-header";
import { PageShell } from "@/shared/components/ui/page-shell";
import { useToast } from "@/shared/components/ui/toast";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import type { UserResponse } from "@/shared/types";
import { useCreateUsuarioMutation, useUpdateUsuarioMutation, useUsuariosQuery } from "../hooks/use-usuarios";
import { usePerfisQuery } from "../hooks/use-perfis";
import { UsuariosTable } from "../components/usuarios-table";
import { EditarUsuarioForm, NovoUsuarioForm } from "../components/usuario-form";
import {
  toRegisterUserRequest,
  toUpdateUserRequest,
  type EditarUsuarioFormData,
  type NovoUsuarioFormData,
} from "../lib/schemas";

export function UsuariosPage() {
  const toast = useToast();
  const { user: currentUser } = useCurrentUser();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [busca, setBusca] = React.useState("");

  const { data: usuarios = [], isLoading, isFetching, refetch } = useUsuariosQuery();
  const { data: perfis = [] } = usePerfisQuery();
  const createMutation = useCreateUsuarioMutation();
  const updateMutation = useUpdateUsuarioMutation();

  const [creating, setCreating] = React.useState(false);
  const [editing, setEditing] = React.useState<UserResponse | null>(null);

  const filtered = React.useMemo(() => {
    const term = busca.trim().toLowerCase();
    return term ? usuarios.filter((u) => u.username.includes(term)) : usuarios;
  }, [usuarios, busca]);

  const handleCreate = (data: NovoUsuarioFormData) =>
    createMutation.mutate(toRegisterUserRequest(data), {
      onSuccess: () => {
        setCreating(false);
        toast.success("Usuário cadastrado", data.username);
      },
      onError: (err) =>
        toast.error("Não foi possível cadastrar o usuário", getApiErrorMessage(err, "Tente novamente.")),
    });

  const handleUpdate = (data: EditarUsuarioFormData) => {
    if (!editing) return;
    updateMutation.mutate(
      { id: editing.id, data: toUpdateUserRequest(data) },
      {
        onSuccess: () => {
          toast.success("Usuário atualizado", editing.username);
          setEditing(null);
        },
        onError: (err) =>
          toast.error("Não foi possível atualizar o usuário", getApiErrorMessage(err, "Tente novamente.")),
      }
    );
  };

  const openEdit = React.useCallback((user: UserResponse) => setEditing(user), []);

  return (
    <PageShell fill>
      <PageHeader
        icon={UserCog}
        title="Usuários"
        description="Quem pode entrar no sistema e com quais perfis"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-9">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="administracao.usuarios:create">
              <Button variant="primary" size="sm" onClick={() => setCreating(true)} className="h-9">
                <Plus className="h-4 w-4" />
                Novo usuário
              </Button>
            </PermissionGate>
          </>
        }
      />

      <div className="max-w-md">
        <Input
          placeholder="Buscar por usuário"
          aria-label="Buscar por usuário"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPage(0);
          }}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      <UsuariosTable
        data={paginate(filtered, page, size)}
        isLoading={isLoading}
        onPageChange={setPage}
        onSizeChange={(newSize) => {
          setSize(newSize);
          setPage(0);
        }}
        onEdit={openEdit}
      />

      <Dialog open={creating} onClose={() => setCreating(false)} title="Novo usuário" maxWidth="md">
        <NovoUsuarioForm
          roles={perfis}
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
          isLoading={createMutation.isPending}
        />
      </Dialog>

      <Dialog open={!!editing} onClose={() => setEditing(null)} title="Editar usuário" maxWidth="md">
        {editing && (
          <EditarUsuarioForm
            key={editing.id}
            user={editing}
            roles={perfis}
            isSelf={editing.id === currentUser?.id}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Dialog>
    </PageShell>
  );
}
