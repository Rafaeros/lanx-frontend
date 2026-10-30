import { TiposNaoConformidadeListPage } from "@/features/cadastros/tipos-nao-conformidade";

export function meta() {
  return [
    { title: "Tipos de Não Conformidade - LANX" },
    { name: "description", content: "Cadastro dos tipos de defeito usados nas não conformidades" },
  ];
}

export default function TiposNaoConformidadeRoute() {
  return <TiposNaoConformidadeListPage />;
}
