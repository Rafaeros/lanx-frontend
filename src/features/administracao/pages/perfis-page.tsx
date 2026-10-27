import * as React from "react";
import { useNavigate } from "react-router";
import { KeyRound, Plus, RefreshCw } from "lucide-react";
import { usePagination } from "@/shared/hooks/use-pagination";
import { paginate } from "@/shared/lib/pagination";
import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/ui/page-header";
import { PageShell } from "@/shared/components/ui/page-shell";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import type { RoleResponse } from "../types";
import { usePerfisQuery } from "../hooks/use-perfis";
import { PerfisTable } from "../components/perfis-table";
import { PERFIS_PATH } from "./perfil-form-page";

export function PerfisPage() {
  const navigate = useNavigate();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const { data: perfis = [], isLoading, isFetching, refetch } = usePerfisQuery();

  // criar e editar abrem em tela própria: a matriz de permissões não cabe bem num modal
  const openRole = React.useCallback(
    (role: RoleResponse) => navigate(`${PERFIS_PATH}/${role.id}/editar`),
    [navigate]
  );

  return (
    <PageShell fill>
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
              <Button variant="primary" size="sm" onClick={() => navigate(`${PERFIS_PATH}/novo`)} className="h-9">
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
    </PageShell>
  );
}
