// --- Notificações ---

/** Espelha o enum TipoNotificacao do backend. */
export type TipoNotificacao = "NAO_CONFORMIDADE_CRIADA";

/** NotificacaoResponse do backend: o mesmo formato vem da API REST e do stream SSE. */
export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  /** Rota do front para onde o clique leva. */
  link?: string | null;
  lida: boolean;
  createdAt: string;
}

export interface ContagemNaoLidas {
  naoLidas: number;
}
