import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { findItemByPath, findModuleByPath, isCadastroPath } from "../lib/resolve";

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const item = findItemByPath(pathname);
  const parent = isCadastroPath(pathname) ? "Cadastros" : findModuleByPath(pathname)?.label;

  return (
    <nav aria-label="Você está em" className="flex min-w-0 items-center gap-1.5 text-sm">
      <Link to="/app" className="text-muted-foreground transition-colors hover:text-foreground">
        Início
      </Link>
      {parent && (
        <>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">{parent}</span>
        </>
      )}
      {item && (
        <>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate font-medium text-foreground" aria-current="page">
            {item.label}
          </span>
        </>
      )}
    </nav>
  );
}
