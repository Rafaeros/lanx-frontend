import { RateiosListPage } from "@/features/cadastros/rateios";

export function meta() {
  return [
    { title: "Cadastro de Rateios - LANX" },
    { name: "description", content: "Centros de rateio dos pedidos de compra" },
  ];
}

export default function RateiosRoute() {
  return <RateiosListPage />;
}
