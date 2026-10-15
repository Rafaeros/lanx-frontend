import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes Tailwind de forma segura resolvendo conflitos.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor numérico para Moeda Brasileira (R$ 1.234,56).
 */
export function formatCurrency(value?: number | string | null): string {
  if (value === null || value === undefined || value === "") return "R$ 0,00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

/**
 * Formata datas ISO (YYYY-MM-DD ou ISO DateTime) para o formato brasileiro DD/MM/AAAA.
 */
export function formatDateBR(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const [year, month, day] = dateString.split("T")[0].split("-");
    if (!year || !month || !day) return dateString;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Formata quantidade / unidades numéricas.
 */
export function formatNumber(value?: number | string | null, decimals = 2): string {
  if (value === null || value === undefined || value === "") return "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

