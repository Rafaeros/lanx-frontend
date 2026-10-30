import * as React from "react";
import { Edit2 } from "lucide-react";
import type { PageResult, UserResponse } from "@/shared/types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export interface UsuariosTableProps {
  data?: PageResult<UserResponse> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onEdit: (user: UserResponse) => void;
}

export function UsuariosTable({ data, isLoading, onPageChange, onSizeChange, onEdit }: UsuariosTableProps) {
  const columns: Column<UserResponse>[] = React.useMemo(
    () => [
      {
        key: "username",
        header: "Usuário",
        cell: (user) => (
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user.username.charAt(0).toUpperCase()}
            </span>
            <span className="font-medium text-foreground">{user.username}</span>
          </div>
        ),
      },
      {
        key: "departamento",
        hideBelow: "md",
        header: "Departamento",
        cell: (user) =>
          user.departamento ? (
            <span className="text-sm text-foreground">{user.departamento.nome}</span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          ),
      },
      {
        key: "roles",
        hideBelow: "sm",
        header: "Perfis",
        cell: (user) => (
          <div className="flex flex-wrap gap-1">
            {user.roles.map((role) => (
              <Badge key={role.id} variant="brand">
                {role.name}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "190px",
        cell: (user) => (
          <div className="flex flex-wrap items-center gap-1.5">
            {user.active ? <Badge variant="success">Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>}
            {user.firstAccess && (
              <Badge variant="warning" title="Ainda não trocou a senha provisória">
                Primeiro acesso pendente
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: "acoes",
        header: "Ações",
        width: "90px",
        align: "right",
        cell: (user) => (
          <PermissionGate permission="administracao.usuarios:update">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(user)}
              title="Editar usuário"
              aria-label={`Editar ${user.username}`}
              className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </PermissionGate>
        ),
      },
    ],
    [onEdit]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      emptyMessage="Nenhum usuário encontrado."
    />
  );
}
