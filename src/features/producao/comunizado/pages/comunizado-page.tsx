import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cable, Download, FileCheck2 } from "lucide-react";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { FileDropzone } from "@/shared/components/ui/file-dropzone";
import { PageHeader } from "@/shared/components/ui/page-header";
import { PageShell } from "@/shared/components/ui/page-shell";
import { useToast } from "@/shared/components/ui/toast";
import { useCan } from "@/features/auth/hooks/use-can";
import { hojeIso } from "@/shared/lib/date";
import { useGerarComunizadoMutation } from "../hooks/use-comunizado";
import { comunizadoSchema, type ComunizadoFormData } from "../lib/schema";
import { ComunizadoCampos } from "../components/comunizado-campos";
import { ComunizadoGuia } from "../components/comunizado-guia";

const PERMISSAO_GERAR = "producao.comunizado:importar";

const valoresIniciais = (): ComunizadoFormData => ({
  operador: "",
  op: "",
  quantidade: "",
  inicio: "",
  fim: "",
  realizadoEm: hojeIso(),
  produto: "",
  docReferencia: "",
});

/** Gera o comunizado a partir da IT (lista de corte) e dos dados da produção. */
export function ComunizadoPage() {
  const toast = useToast();
  const { can } = useCan();
  const podeGerar = can(PERMISSAO_GERAR);
  const gerar = useGerarComunizadoMutation();

  const [arquivo, setArquivo] = React.useState<File | null>(null);
  const [erroArquivo, setErroArquivo] = React.useState<string>();
  const [ultimoGerado, setUltimoGerado] = React.useState<string | null>(null);

  const methods = useForm<ComunizadoFormData>({
    resolver: zodResolver(comunizadoSchema),
    defaultValues: valoresIniciais(),
  });

  const onSubmit = (dados: ComunizadoFormData) => {
    if (!arquivo) {
      setErroArquivo("Envie a IT (lista de corte) em .xlsx ou .xls.");
      return;
    }
    gerar.mutate(
      { arquivo, dados },
      {
        onSuccess: (nome) => {
          setUltimoGerado(nome);
          toast.success("Comunizado gerado", nome);
        },
        onError: (err) => toast.error("Não foi possível gerar o comunizado", getApiErrorMessage(err, "Confira a IT e tente novamente.")),
      }
    );
  };

  const novo = () => {
    setArquivo(null);
    setUltimoGerado(null);
    methods.reset(valoresIniciais());
  };

  return (
    <PageShell>
      <PageHeader
        icon={Cable}
        title="Comunizado"
        description="Transforma a lista de corte (IT) na planilha de comunizado, organizada por cabo e pronta para imprimir"
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" noValidate>
          <Card>
            <CardContent className="space-y-6 p-5 sm:p-6">
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Lista de corte (IT)</h3>
                  <p className="text-xs text-muted-foreground">Arquivo Excel da instrução de trabalho, ex.: IT002_05 - KHN321.xlsx</p>
                </div>
                <FileDropzone
                  file={arquivo}
                  onChange={(f) => {
                    setArquivo(f);
                    setErroArquivo(undefined);
                    setUltimoGerado(null);
                  }}
                  accept={[".xlsx", ".xls"]}
                  hint=".xlsx ou .xls · até 10 MB"
                  disabled={gerar.isPending}
                  error={erroArquivo}
                />
              </section>

              <div className="border-t border-border" />

              <ComunizadoCampos disabled={gerar.isPending} />

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                {ultimoGerado ? (
                  <p className="flex items-center gap-2 text-sm text-success">
                    <FileCheck2 className="h-4 w-4 shrink-0" />
                    <span className="truncate">Baixado: {ultimoGerado}</span>
                  </p>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {podeGerar ? "A planilha é baixada assim que ficar pronta." : "Seu perfil não tem permissão para gerar o comunizado."}
                  </span>
                )}
                <div className="flex gap-2">
                  {ultimoGerado && (
                    <Button type="button" variant="outline" onClick={novo}>
                      Novo comunizado
                    </Button>
                  )}
                  <Button type="submit" variant="primary" isLoading={gerar.isPending} disabled={!podeGerar}>
                    {!gerar.isPending && <Download className="h-4 w-4" />}
                    {ultimoGerado ? "Gerar de novo" : "Gerar comunizado"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <aside className="lg:self-start">
            <ComunizadoGuia />
          </aside>
        </form>
      </FormProvider>
    </PageShell>
  );
}
