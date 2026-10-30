import { NaoConformidadesPage } from "@/features/teste-inspecao/nao-conformidades";

export function meta() {
  return [
    { title: "Não Conformidades - LANX" },
    { name: "description", content: "Registro das não conformidades das ordens de produção, com anexos" },
  ];
}

export default function NaoConformidadesRoute() {
  return <NaoConformidadesPage />;
}
