import { CheckCircle2, FileInput, FileOutput, Palette } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

const PASSOS = [
  {
    icon: FileInput,
    titulo: "Lê a IT",
    texto:
      "Todas as abas de cabos (IT CABOS, IT CABOS (2)…), até as notas e a legenda do rodapé. Usa CIRC (ou CIR) ou a GRAVAÇÃO, quando a IT tiver.",
  },
  {
    icon: CheckCircle2,
    titulo: "Usa o cabeçalho",
    texto: 'O "Código" da IT vira o produto e a data da última revisão vira a doc. referência.',
  },
  {
    icon: Palette,
    titulo: "Organiza os cabos",
    texto:
      "Agrupa por modelo, bitola e cor, com o maior comprimento primeiro. O texto sai na cor do cabo; bicolores ganham gradiente no tipo.",
  },
  {
    icon: FileOutput,
    titulo: "Gera a planilha",
    texto:
      "Layout do comunizado (ORN105) em A4, 22 itens por página com o cabeçalho repetido.",
  },
];

/** Explica o que a geração faz (painel lateral). */
export function ComunizadoGuia() {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <h3 className="font-display text-sm font-semibold text-foreground">Como funciona</h3>
        <ol className="space-y-4">
          {PASSOS.map(({ icon: Icon, titulo, texto }, i) => (
            <li key={titulo} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--module-producao)]/10 text-[var(--module-producao)]">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {i + 1}. {titulo}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">{texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
