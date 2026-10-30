import { env } from "@/config/env";
import { tokenStorage } from "./client";

/** Um evento recebido do servidor (formato text/event-stream). */
export interface ServerSentEvent {
  event: string;
  data: string;
  id?: string;
}

export interface EventStreamHandlers {
  onEvent: (event: ServerSentEvent) => void;
  /** Conexão aberta (ou reaberta): bom momento para ressincronizar o que pode ter sido perdido. */
  onOpen?: () => void;
}

class EventStreamHttpError extends Error {
  constructor(readonly status: number) {
    super(`Event stream respondeu HTTP ${status}`);
  }
}

const RECONEXAO_MAX_MS = 30_000;

/**
 * Assina um endpoint SSE da API e reconecta sozinho (espera crescente até 30s).
 * Usa fetch em vez de EventSource porque o EventSource não envia o header Authorization.
 * Desiste em 4xx (sem login, sem permissão, endpoint inexistente): insistir não resolve.
 * Retorna a função que encerra a assinatura.
 */
export function subscribeEventStream(path: string, handlers: EventStreamHandlers): () => void {
  const controller = new AbortController();
  const { signal } = controller;

  void (async () => {
    let tentativa = 0;
    while (!signal.aborted) {
      try {
        await readEventStream(path, signal, {
          ...handlers,
          onOpen: () => {
            tentativa = 0;
            handlers.onOpen?.();
          },
        });
      } catch (error) {
        if (signal.aborted) return;
        if (error instanceof EventStreamHttpError && error.status >= 400 && error.status < 500 && error.status !== 429) {
          return;
        }
      }
      tentativa += 1;
      await esperar(Math.min(RECONEXAO_MAX_MS, 1000 * 2 ** Math.min(tentativa, 5)), signal);
    }
  })();

  return () => controller.abort();
}

/** Uma conexão: termina quando o servidor fecha (ex.: timeout do SseEmitter). */
async function readEventStream(path: string, signal: AbortSignal, handlers: EventStreamHandlers): Promise<void> {
  const token = tokenStorage.get();
  const response = await fetch(`${env.VITE_API_BASE_URL}${path}`, {
    headers: { Accept: "text/event-stream", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    cache: "no-store",
    signal,
  });
  if (!response.ok || !response.body) throw new EventStreamHttpError(response.status);
  handlers.onOpen?.();

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    buffer += value;
    // eventos são separados por uma linha em branco; o último pedaço pode estar incompleto
    const blocos = buffer.split(/\r?\n\r?\n/);
    buffer = blocos.pop() ?? "";
    for (const bloco of blocos) {
      const evento = parseBloco(bloco);
      if (evento) handlers.onEvent(evento);
    }
  }
}

/** "event:x\ndata:{...}" → { event, data }. Linhas ":..." são comentários (heartbeat) e são ignoradas. */
function parseBloco(bloco: string): ServerSentEvent | null {
  let event = "message";
  let id: string | undefined;
  const data: string[] = [];
  for (const linha of bloco.split(/\r?\n/)) {
    if (!linha || linha.startsWith(":")) continue;
    const separador = linha.indexOf(":");
    const campo = separador < 0 ? linha : linha.slice(0, separador);
    let valor = separador < 0 ? "" : linha.slice(separador + 1);
    if (valor.startsWith(" ")) valor = valor.slice(1);
    if (campo === "event") event = valor;
    else if (campo === "data") data.push(valor);
    else if (campo === "id") id = valor;
  }
  return data.length > 0 ? { event, data: data.join("\n"), id } : null;
}

function esperar(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true }
    );
  });
}
