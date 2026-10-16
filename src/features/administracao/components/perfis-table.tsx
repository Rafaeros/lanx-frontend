import * as React from "react";
import { Edit2, Eye } from "lucide-react";
import type { PageResult, RoleResponse } from "@/shared/api/schema";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useCan } from "@/features/auth/hooks/use-can";
import { isSystemRole } from "../lib/permissions";

export interface PerfisTableProps {
  data?: PageResult<RoleResponse> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onOpen: (role: RoleResponse) => void;
}

export function PerfisTable({ data, isLoading, onPageChange, onSizeChange, onOpen }: PerfisTableProps) {
  const { can } = useCan();
  const canUpdate = can("administracao.permissoes:update");

  const columns: Column<RoleResponse>[] = React.useMemo(
    () => [
      {
        key: "name",
        header: "Perfil",
        cell: (role) => (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{role.name}</span>
            {isSystemRole(role) && <Badge variant="secondary">Sistema</Badge>}
          </div>
        ),
      },
      {
        key: "description",
        header: "Descrição",
        cell: (role) => <span className="text-muted-foreground">{role.description || "-"}</span>,
      },
      {
        key: "permissions",
        header: "Permissões",
        width: "130px",
        align: "center",
        cell: (role) => <span className="tabular-nums">{role.permissions.length}</span>,
      },
      {
        key: "acoes",
        header: "Ações",
        width: "90px",
        align: "right",
        cell: (role) => {
          const editable = canUpdate && !isSystemRole(role);
          const Icon = editable ? Edit2 : Eye;
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpen(role)}
              title={editable ? "Editar perfil" : "Ver permissões"}
              aria-label={`${editable ? "Editar" : "Ver"} ${role.name}`}
              className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        },
      },
    ],
    [canUpdate, onOpen]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      emptyMessage="Nenhum perfil cadastrado."
    />
  );
}
