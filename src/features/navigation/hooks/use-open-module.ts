import * as React from "react";
import { useNavigate } from "react-router";
import type { ModuleDefinition, NavSection } from "../types";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { filterSection } from "../lib/access";

function firstReachableRoute(sections: NavSection[], navigation: Parameters<typeof filterSection>[1]) {
  for (const section of sections) {
    const item = filterSection(section, navigation).items.find((i) => i.status !== "soon");
    if (item) return item.to;
  }
  return null;
}

/**
 * Ação de "abrir um módulo": ativa o módulo na sidebar e, se ele já tiver telas liberadas,
 * navega para a primeira. Módulos "em breve" só trocam o contexto da sidebar.
 */
export function useOpenModule(selectModule: (id: ModuleDefinition["id"]) => void) {
  const navigate = useNavigate();
  const { navigation } = useCurrentUser();

  return React.useCallback(
    (module: ModuleDefinition) => {
      selectModule(module.id);
      const target = firstReachableRoute(module.sections, navigation);
      if (target) navigate(target);
    },
    [navigate, navigation, selectModule]
  );
}
