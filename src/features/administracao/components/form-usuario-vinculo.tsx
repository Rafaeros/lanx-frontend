import * as React from "react";
import { FormSearchSelect } from "@/shared/components/form/form-search-select";
import { useCan } from "@/features/auth/hooks/use-can";
import { useUsuariosParaVinculoQuery } from "../hooks/use-usuarios";

export interface FormUsuarioVinculoProps {
  /** Campo do formulário com o id do usuário ("" = sem vínculo). */
  name?: string;
  label?: string;
  /** Usuário já vinculado: mostrado mesmo sem permissão para listar usuários ou se estiver inativo. */
  usuarioAtual?: { id: string; username: string } | null;
  /** Perfis cujo nome casa com este padrão aparecem primeiro (ex.: /compra/i para compradores). */
  perfilPrioritario?: RegExp;
  /** Dica quando o vínculo é possível. */
  hint?: string;
}

/**
 * Seleção do usuário do LANX vinculado a um cadastro (comprador, operador). Busca por nome,
 * mostra os perfis de cada usuário e fica bloqueado, com explicação, para quem não pode listar usuários.
 */
export function FormUsuarioVinculo({
  name = "userId",
  label = "Usuário do LANX",
  usuarioAtual,
  perfilPrioritario,
  hint = "Opcional. Use o X para desfazer o vínculo.",
}: FormUsuarioVinculoProps) {
  const { can } = useCan();
  const podeListar = can("administracao.usuarios:read");
  const { data: usuarios, isLoading } = useUsuariosParaVinculoQuery(podeListar);

  const options = React.useMemo(() => {
    const prioridade = (perfis: string[]) => (perfilPrioritario && perfis.some((p) => perfilPrioritario.test(p)) ? 0 : 1);
    return (usuarios || [])
      .filter((u) => u.active || u.id === usuarioAtual?.id)
      .map((u) => {
        const perfis = u.roles.map((r) => r.name);
        return { value: u.id, label: u.username, description: perfis.join(", ") || "Sem perfil", perfis };
      })
      .sort((a, b) => prioridade(a.perfis) - prioridade(b.perfis) || a.label.localeCompare(b.label));
  }, [usuarios, usuarioAtual?.id, perfilPrioritario]);

  return (
    <FormSearchSelect
      name={name}
      label={label}
      placeholder={podeListar ? "Sem usuário vinculado" : (usuarioAtual?.username ?? "Sem usuário vinculado")}
      searchPlaceholder="Buscar usuário"
      emptyMessage="Nenhum usuário com esse nome."
      options={options}
      isLoading={podeListar && isLoading}
      disabled={!podeListar}
      clearable
      hint={podeListar ? hint : "Para vincular um usuário é preciso a permissão de ver usuários (Administração)."}
    />
  );
}
