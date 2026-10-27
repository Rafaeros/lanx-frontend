import { OrdensProducaoListPage } from "@/features/producao/ordens-producao";

export function meta() {
  return [
    { title: "Ordens de Produção - LANX" },
    { name: "description", content: "Ordens de produção: produto, cliente, quantidade e previsão de entrega" },
  ];
}

export default function OrdensProducaoRoute() {
  return <OrdensProducaoListPage />;
}
