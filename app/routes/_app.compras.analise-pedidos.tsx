import { AnalisePedidosPage } from "@/features/compras/analise-pedidos";

export function meta() {
  return [
    { title: "Análise de Pedidos de Compras - LANX" },
    { name: "description", content: "Acompanhamento analítico de requisições e pedidos de compras" },
  ];
}

export default function AnalisePedidosRoute() {
  return <AnalisePedidosPage />;
}

