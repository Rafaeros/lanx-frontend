import * as React from "react";

const STORAGE_KEY = "lanx-sidebar-collapsed";
const DESKTOP_QUERY = "(min-width: 1024px)";

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function store(collapsed: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    // Sem armazenamento: a escolha vale só até recarregar a página
  }
}

function subscribeDesktop(onChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function isDesktop() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

/**
 * Sidebar recolhida (só ícones). Vale apenas no desktop: no celular a sidebar é um drawer
 * e abre sempre completa. A escolha fica salva no navegador.
 */
export function useSidebarCollapsed() {
  const [preferred, setPreferred] = React.useState(readStored);
  const desktop = React.useSyncExternalStore(subscribeDesktop, isDesktop, () => true);

  const toggle = React.useCallback(() => {
    setPreferred((prev) => {
      store(!prev);
      return !prev;
    });
  }, []);

  return { collapsed: preferred && desktop, toggle };
}
