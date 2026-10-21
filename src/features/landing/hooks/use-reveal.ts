import * as React from "react";

/** true quando o elemento entra na viewport (uma vez só). Sem IntersectionObserver, já começa visível. */
export function useReveal<T extends Element>(options: IntersectionObserverInit = { rootMargin: "0px 0px -12% 0px" }) {
  const ref = React.useRef<T>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, visible };
}
