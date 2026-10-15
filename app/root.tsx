import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/query-client";
import { ThemeProvider } from "@/shared/hooks/use-theme";
import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <Outlet />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Ops!";
  let details = "Ocorreu um erro inesperado.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Página Não Encontrada" : "Erro no Sistema";
    details =
      error.status === 404
        ? "A página solicitada não foi localizada."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-24 p-6 max-w-xl mx-auto text-center">
      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">{message}</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{details}</p>
        {stack && (
          <pre className="mt-4 w-full p-4 overflow-x-auto text-left text-xs bg-[var(--muted)] rounded-lg text-red-500 font-mono">
            <code>{stack}</code>
          </pre>
        )}
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-[#7609e8] text-white text-sm font-medium hover:opacity-90"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </main>
  );
}
