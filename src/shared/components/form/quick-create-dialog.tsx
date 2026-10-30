import type * as React from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { Dialog, type DialogProps } from "../ui/dialog";
import { useToast } from "../ui/toast";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import type { SearchSelectOption } from "../ui/search-select";
import { QUICK_CREATE_DESCRIPTION } from "./quick-create";

export interface QuickCreateDialogProps {
  title: string;
  onClose: () => void;
  maxWidth?: DialogProps["maxWidth"];
  children: React.ReactNode;
}

/** Modal do cadastro rápido: abre por cima do formulário atual com o formulário do cadastro. */
export function QuickCreateDialog({ title, onClose, maxWidth = "md", children }: QuickCreateDialogProps) {
  return (
    <Dialog open onClose={onClose} title={title} description={QUICK_CREATE_DESCRIPTION} maxWidth={maxWidth}>
      {children}
    </Dialog>
  );
}

export interface QuickCreateSaveOptions<TRequest, TResult> {
  /** Toast de sucesso, ex.: "Departamento cadastrado". */
  sucesso: string;
  /** Toast de erro, ex.: "Não foi possível cadastrar o departamento". */
  erro: string;
  /** Opção do select a partir do registro criado (e do que foi enviado, se a API devolve pouco). */
  toOption: (result: TResult, request: TRequest) => SearchSelectOption;
  onCreated: (option: SearchSelectOption) => void;
}

/** Salvar do cadastro rápido: chama a mutation de criação, avisa e devolve a opção criada ao select. */
export function useQuickCreateSave<TRequest, TResult>(
  mutation: UseMutationResult<TResult, unknown, TRequest>,
  { sucesso, erro, toOption, onCreated }: QuickCreateSaveOptions<TRequest, TResult>
) {
  const toast = useToast();
  return (request: TRequest) =>
    mutation.mutate(request, {
      onSuccess: (result) => {
        const option = toOption(result, request);
        toast.success(sucesso, option.label);
        onCreated(option);
      },
      onError: (err) => toast.error(erro, getApiErrorMessage(err, "Tente novamente.")),
    });
}
