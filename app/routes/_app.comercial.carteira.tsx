import { CarteiraPage } from "@/features/comercial/carteira";

export function meta() {
  return [
    { title: "Carteira de Pedidos - LANX" },
    { name: "description", content: "Pedidos pendentes com etapa da OP e materiais faltantes, consultados no ERP" },
  ];
}

export default function CarteiraRoute() {
  return <CarteiraPage />;
}
