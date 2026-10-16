import { ClipboardList, FileBarChart, FolderOpen, LockKeyhole, type LucideIcon } from "lucide-react";
import type { SectionKind } from "../types";

/** Ordem fixa das seções na sidebar: Cadastros sempre primeiro. */
export const SECTION_ORDER: SectionKind[] = ["cadastros", "acesso", "operacoes", "relatorios"];

export const SECTION_LABELS: Record<SectionKind, string> = {
  cadastros: "Cadastros",
  acesso: "Controle de acesso",
  operacoes: "Operações",
  relatorios: "Relatórios",
};

export const SECTION_ICONS: Record<SectionKind, LucideIcon> = {
  cadastros: FolderOpen,
  acesso: LockKeyhole,
  operacoes: ClipboardList,
  relatorios: FileBarChart,
};
