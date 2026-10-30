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
import { ThemeProvider, THEME_STORAGE_KEY } from "@/shared/hooks/use-theme";
import type { Route } from "./+types/root";
import { ToastProvider } from "@/shared/components/ui/toast";
import { TopProgressBar } from "@/shared/components/ui/top-progress-bar";
import "./app.css";

const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})();`;

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
  { rel: "icon", type: "image/png", href: "/brand/icon-192.png", sizes: "192x192" },
  { rel: "apple-touch-icon", href: "/brand/apple-touch-icon.png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&family=Space+Grotesk:wght@500;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7609e8" />
        <Meta />
        <Links />
        {/* Aplica o tema salvo antes da primeira pintura (evita flash claro → escuro) */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
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
        <ToastProvider>
          <TopProgressBar />
          <Outlet />
        </ToastProvider>
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
      <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
        <h1 className="font-display text-3xl font-bold text-foreground">{message}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{details}</p>
        {stack && (
          <pre className="mt-4 w-full p-4 overflow-x-auto text-left text-xs bg-muted rounded-lg text-danger font-mono">
            <code>{stack}</code>
          </pre>
        )}
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-gradient text-primary-foreground text-sm font-medium hover:bg-brand-gradient-hover"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </main>
  );
}
