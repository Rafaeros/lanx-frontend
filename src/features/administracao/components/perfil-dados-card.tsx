import { IdCard } from "lucide-react";
import { FormInput } from "@/shared/components/form/form-input";

/** Nome e descrição do perfil (campos do formulário em volta, via FormProvider). */
export function PerfilDadosCard({ readOnly, autoFocus }: { readOnly?: boolean; autoFocus?: boolean }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-foreground">
        <IdCard className="h-4 w-4 text-primary" />
        Dados do perfil
      </h2>
      <div className="space-y-4">
        <FormInput
          name="name"
          label="Nome"
          placeholder="Ex: COMPRADOR"
          hint="Gravado em maiúsculas."
          required
          disabled={readOnly}
          autoFocus={autoFocus}
        />
        <FormInput name="description" label="Descrição" placeholder="O que este perfil pode fazer" disabled={readOnly} />
      </div>
    </section>
  );
}
