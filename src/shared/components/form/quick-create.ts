import type * as React from "react";
import type { SearchSelectOption } from "../ui/search-select";

/** O que o modal de cadastro rápido recebe de quem o abriu. */
export interface QuickCreateRenderProps {
  /** Texto que o usuário buscou no select: entra como valor inicial do campo principal. */
  termo: string;
  onClose: () => void;
  /** Chamado com o registro criado: o select já o seleciona, antes mesmo da lista recarregar. */
  onCreated: (option: SearchSelectOption) => void;
}

/**
 * Cadastro rápido a partir de um select: o rodapé da lista ganha "Cadastrar …" e abre um modal por
 * cima do atual, sem sair da tela. Cada cadastro exporta um hook `useXQuickCreate()` que devolve isto
 * (ou undefined quando o perfil não pode cadastrar).
 */
export interface QuickCreate {
  /** Rótulo do botão quando não há busca, ex.: "Novo departamento". */
  label: string;
  render: (props: QuickCreateRenderProps) => React.ReactNode;
}

export const QUICK_CREATE_DESCRIPTION = "Cadastro rápido: ao salvar, ele já fica selecionado no formulário.";
