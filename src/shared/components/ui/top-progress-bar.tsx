import * as React from "react";
import { useNavigation } from "react-router";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

/** Abaixo disso a carga é rápida demais para valer a barra (evita piscar a cada clique). */
const ATRASO_MS = 150;
const INTERVALO_MS = 200;
/** A barra se aproxima daqui sem nunca chegar: só o fim real da carga a leva a 100%. */
const TETO = 90;

/**
 * Barra de carregamento no topo da página, no estilo NProgress, com o gradiente da marca.
 * Aparece enquanto a rota carrega, enquanto uma consulta busca dados pela primeira vez (página nova,
 * filtro novo) ou enquanto algo é salvo/baixado. Atualizações em segundo plano de dados já exibidos
 * não acendem a barra: os botões "Atualizar" já mostram o próprio carregamento.
 */
export function TopProgressBar() {
  const navigation = useNavigation();
  const buscando = useIsFetching({ predicate: (query) => query.state.status === "pending" });
  const salvando = useIsMutating();
  const ativo = navigation.state !== "idle" || buscando > 0 || salvando > 0;

  const [progresso, setProgresso] = React.useState(0);
  const [visivel, setVisivel] = React.useState(false);

  React.useEffect(() => {
    if (ativo) {
      const inicio = setTimeout(() => {
        setVisivel(true);
        setProgresso((p) => (p > 0 && p < 100 ? p : 15));
      }, ATRASO_MS);
      // avança cada vez menos conforme chega perto do teto
      const avanco = setInterval(() => setProgresso((p) => (p === 0 ? p : p + (TETO - p) * 0.1)), INTERVALO_MS);
      return () => {
        clearTimeout(inicio);
        clearInterval(avanco);
      };
    }

    // terminou: completa a barra, deixa ver os 100% e some
    setProgresso((p) => (p > 0 ? 100 : 0));
    const sumir = setTimeout(() => setVisivel(false), 250);
    const zerar = setTimeout(() => setProgresso(0), 600);
    return () => {
      clearTimeout(sumir);
      clearTimeout(zerar);
    };
  }, [ativo]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] transition-opacity duration-300"
      style={{ opacity: visivel ? 1 : 0 }}
    >
      <div
        className="relative h-full transition-[width] duration-200 ease-out motion-reduce:transition-none"
        style={{
          width: `${progresso}%`,
          // gradiente ancorado na largura da tela: a cor de cada ponto não muda enquanto a barra cresce
          backgroundImage: "var(--brand-gradient)",
          backgroundSize: "100vw 100%",
        }}
      >
        {/* brilho na ponta, como o "peg" do NProgress */}
        <div
          className="absolute right-0 top-0 h-full w-24 opacity-90"
          style={{ boxShadow: "0 0 10px var(--brand-to), 0 0 5px var(--brand-to)" }}
        />
      </div>
    </div>
  );
}
