import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSearchSelect } from "@/shared/components/form/form-search-select";
import { Button } from "@/shared/components/ui/button";
import { useCan } from "@/features/auth/hooks/use-can";
import { useUsuariosParaVinculoQuery } from "../hooks/use-compradores";
import type { CompradorResponse } from "../types";
import { compradorSchema, type CompradorFormData } from "../schemas";

export interface CompradorFormProps {
  initialData?: CompradorResponse | null;
  onSubmit: (data: CompradorFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CompradorForm({ initialData, onSubmit, onCancel, isLoading }: CompradorFormProps) {
  const { can } = useCan();
  const podeListarUsuarios = can("administracao.usuarios:read");
  const { data: usuarios, isLoading: isLoadingUsuarios } = useUsuariosParaVinculoQuery(podeListarUsuarios);

  const methods = useForm<CompradorFormData>({
    resolver: zodResolver(compradorSchema),
    defaultValues: {
      nome: initialData?.nome ?? "",
      userId: initialData?.usuario?.id ?? "",
    },
  });

  // Usuários com a role de comprador aparecem primeiro, mas qualquer usuário ativo pode ser vinculado
  const usuarioOptions = React.useMemo(
    () =>
      (usuarios || [])
        .filter((u) => u.active || u.id === initialData?.usuario?.id)
        .map((u) => {
          const roles = u.roles.map((r) => r.name);
          return { value: u.id, label: u.username, description: roles.join(", ") || "Sem perfil", roles };
        })
        .sort((a, b) => {
          const comprador = (o: { roles: string[] }) => (o.roles.some((r) => /compra/i.test(r)) ? 0 : 1);
          return comprador(a) - comprador(b) || a.label.localeCompare(b.label);
        }),
    [usuarios, initialData?.usuario?.id]
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="nome"
          label="Nome no ERP"
          placeholder="Ex: MARIANA SILVA"
          hint="Exatamente como aparece nos pedidos importados: é por ele que a importação liga os itens."
          required
          autoFocus
        />

        <FormSearchSelect
          name="userId"
          label="Usuário do LANX"
          placeholder={podeListarUsuarios ? "Sem usuário vinculado" : (initialData?.usuario?.username ?? "Sem usuário vinculado")}
          searchPlaceholder="Buscar usuário"
          emptyMessage="Nenhum usuário com esse nome."
          options={usuarioOptions}
          isLoading={podeListarUsuarios && isLoadingUsuarios}
          disabled={!podeListarUsuarios}
          clearable
          hint={
            podeListarUsuarios
              ? "Opcional. Vincule para o comprador ver os próprios pedidos; use o X para desfazer."
              : "Para vincular um usuário é preciso a permissão de ver usuários (Administração)."
          }
        />

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Salvar alterações" : "Cadastrar comprador"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
