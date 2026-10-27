import { useNavigate, useParams } from "react-router";
import { ArrowLeft, KeyRound, Loader2, Lock, SearchX } from "lucide-react";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/ui/page-header";
import { PageShell } from "@/shared/components/ui/page-shell";
import { useToast } from "@/shared/components/ui/toast";
import { useCan } from "@/features/auth/hooks/use-can";
import {
  useCreatePerfilMutation,
  useFeatureCatalogQuery,
  usePerfisQuery,
  useUpdatePerfilMutation,
} from "../hooks/use-perfis";
import { PerfilForm } from "../components/perfil-form";
import { isSystemRole } from "../lib/permissions";
import type { PerfilFormData } from "../lib/schemas";

export const PERFIS_PATH = "/administracao/perfis";

function Voltar() {
  const navigate = useNavigate();
  return (
    <Button variant="outline" size="sm" onClick={() => navigate(PERFIS_PATH)} className="h-9">
      <ArrowLeft className="h-4 w-4" />
      Perfis
    </Button>
  );
}

function Aviso({ icon: Icon, titulo, texto }: { icon: React.ElementType; titulo: string; texto: string }) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
      <div>
        <p className="font-semibold text-foreground">{titulo}</p>
        <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
      </div>
      <Voltar />
    </section>
  );
}

function Carregando() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

/** /administracao/perfis/novo */
export function PerfilNovoPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { can } = useCan();
  const { data: features = [], isLoading } = useFeatureCatalogQuery();
  const createMutation = useCreatePerfilMutation();

  const handleSubmit = (data: PerfilFormData) =>
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Perfil criado", data.name.toUpperCase());
        navigate(PERFIS_PATH);
      },
      onError: (err) => toast.error("Não foi possível criar o perfil", getApiErrorMessage(err, "Tente novamente.")),
    });

  return (
    <PageShell>
      <PageHeader
        icon={KeyRound}
        title="Novo perfil"
        description="Dê um nome ao perfil e marque o que os usuários dele podem fazer em cada módulo"
        actions={<Voltar />}
      />
      {!can("administracao.permissoes:create") ? (
        <Aviso icon={Lock} titulo="Sem permissão" texto="Seu perfil não pode criar perfis." />
      ) : isLoading ? (
        <Carregando />
      ) : (
        <PerfilForm
          features={features}
          onSubmit={handleSubmit}
          onCancel={() => navigate(PERFIS_PATH)}
          isLoading={createMutation.isPending}
        />
      )}
    </PageShell>
  );
}

/** /administracao/perfis/:id/editar (somente leitura para o perfil do sistema ou sem permissão de editar) */
export function PerfilEditarPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();
  const { can } = useCan();
  const perfis = usePerfisQuery();
  const catalogo = useFeatureCatalogQuery();
  const updateMutation = useUpdatePerfilMutation();

  const perfil = perfis.data?.find((r) => r.id === id);
  const somenteLeitura = !perfil || isSystemRole(perfil) || !can("administracao.permissoes:update");

  const handleSubmit = (data: PerfilFormData) =>
    perfil &&
    updateMutation.mutate(
      { id: perfil.id, data },
      {
        onSuccess: () => {
          toast.success("Perfil atualizado", "As permissões já valem para os usuários deste perfil.");
          navigate(PERFIS_PATH);
        },
        onError: (err) => toast.error("Não foi possível salvar o perfil", getApiErrorMessage(err, "Tente novamente.")),
      }
    );

  const descricao = !perfil
    ? undefined
    : isSystemRole(perfil)
      ? "Perfil do sistema: recebe automaticamente todas as permissões e não pode ser alterado"
      : somenteLeitura
        ? "Seu perfil só pode visualizar estas permissões"
        : "Ajuste o nome, a descrição e o que os usuários deste perfil podem fazer";

  return (
    <PageShell>
      <PageHeader
        icon={KeyRound}
        title={perfil ? (somenteLeitura ? `Perfil ${perfil.name}` : `Editar perfil ${perfil.name}`) : "Perfil"}
        description={descricao}
        actions={<Voltar />}
      />
      {perfis.isLoading || catalogo.isLoading ? (
        <Carregando />
      ) : !perfil ? (
        <Aviso icon={SearchX} titulo="Perfil não encontrado" texto="Ele pode ter sido excluído. Volte à lista de perfis." />
      ) : (
        <PerfilForm
          key={perfil.id}
          initialData={perfil}
          features={catalogo.data ?? []}
          readOnly={somenteLeitura}
          onSubmit={handleSubmit}
          onCancel={() => navigate(PERFIS_PATH)}
          isLoading={updateMutation.isPending}
        />
      )}
    </PageShell>
  );
}
