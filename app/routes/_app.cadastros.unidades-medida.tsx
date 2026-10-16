import { UnidadesMedidaListPage } from "@/features/cadastros/unidade-medida";

export function meta() {
  return [
    { title: "Unidades de Medida - LANX" },
    { name: "description", content: "Cadastro de unidades de medida usadas nos materiais" },
  ];
}

export default function UnidadesMedidaRoute() {
  return <UnidadesMedidaListPage />;
}
