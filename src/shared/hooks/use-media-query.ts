import * as React from "react";

/** Se a media query casa agora (atualiza ao redimensionar). No servidor, assume `fallback`. */
export function useMediaQuery(query: string, fallback = true) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => fallback
  );
}
