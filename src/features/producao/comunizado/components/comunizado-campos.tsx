import { CalendarDays, ClipboardList, Hash, Package, User } from "lucide-react";
import { FormInput } from "@/shared/components/form/form-input";

/** Título de um grupo de campos do formulário. */
function Grupo({ titulo, descricao, children }: { titulo: string; descricao: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1">
        <span className="block text-sm font-semibold text-foreground">{titulo}</span>
        <span className="block text-xs text-muted-foreground">{descricao}</span>
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/** Campos do cabeçalho do comunizado (dentro de um FormProvider). */
export function ComunizadoCampos({ disabled }: { disabled?: boolean }) {
  return (
    <div className="space-y-6">
      <Grupo titulo="Produção" descricao="Não estão na IT. Em branco, saem vazios para preencher à mão.">
        <FormInput name="operador" label="Operador" placeholder="Ex.: João" leftIcon={<User className="h-4 w-4" />} disabled={disabled} />
        <FormInput name="op" label="OP" placeholder="Ordem de produção" leftIcon={<ClipboardList className="h-4 w-4" />} disabled={disabled} />
        <FormInput
          name="quantidade"
          label="Quantidade"
          placeholder="Ex.: 74"
          hint='Só o número vira "74 PÇS".'
          leftIcon={<Hash className="h-4 w-4" />}
          disabled={disabled}
        />
        <FormInput name="realizadoEm" type="date" label="Realizado em" leftIcon={<CalendarDays className="h-4 w-4" />} disabled={disabled} />
        <FormInput name="inicio" label="Início" placeholder="Ex.: 20/10 08:00" disabled={disabled} />
        <FormInput name="fim" label="Fim" placeholder="Ex.: 20/10 17:00" disabled={disabled} />
      </Grupo>

      <Grupo titulo="Sobrescrever a IT" descricao="Opcional: por padrão vêm do cabeçalho da IT.">
        <FormInput
          name="produto"
          label="Produto"
          placeholder='"Código" da IT'
          hint="Obrigatório só se a IT não tiver o código."
          leftIcon={<Package className="h-4 w-4" />}
          disabled={disabled}
        />
        <FormInput name="docReferencia" type="date" label="Doc. referência" hint="Data da revisão da IT." disabled={disabled} />
      </Grupo>
    </div>
  );
}
