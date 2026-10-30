import * as React from "react";

/**
 * URL temporária (blob:) para mostrar um arquivo em memória em <img>, <iframe> ou <a href>. Arquivos
 * protegidos por token não podem ir direto no src (o navegador não manda o Authorization): baixa-se o
 * blob com o apiClient e exibe-se por esta URL. Ela é revogada quando o blob muda ou o componente sai,
 * para não segurar memória.
 */
export function useObjectUrl(blob: Blob | null | undefined): string | null {
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!blob) {
      setUrl(null);
      return;
    }
    const criada = URL.createObjectURL(blob);
    setUrl(criada);
    return () => URL.revokeObjectURL(criada);
  }, [blob]);

  return url;
}
