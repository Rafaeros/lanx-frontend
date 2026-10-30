import type { SearchSelectOption } from "@/shared/components/ui/search-select";

/**
 * Garante o valor atual de um registro em edição entre as opções do select, mesmo que a lista não o
 * traga (ex.: OP antiga fora das 200 carregadas, produto que deixou de ser produto acabado).
 */
export function withCurrentOption(
  options: SearchSelectOption[],
  current?: SearchSelectOption | null
): SearchSelectOption[] {
  if (!current || options.some((o) => o.value === current.value)) return options;
  return [current, ...options];
}
