import { ComunizadoPage } from "@/features/producao/comunizado";

export function meta() {
  return [
    { title: "Comunizado - LANX" },
    { name: "description", content: "Gera o comunizado de corte a partir da IT (lista de corte)" },
  ];
}

export default function ComunizadoRoute() {
  return <ComunizadoPage />;
}
