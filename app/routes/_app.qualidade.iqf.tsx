import { IqfPage } from "@/features/qualidade/iqf";

export function meta() {
  return [
    { title: "IQF de Fornecedores - LANX" },
    { name: "description", content: "Índice de qualidade de fornecedores pelo cumprimento de prazos de entrega" },
  ];
}

export default function IqfRoute() {
  return <IqfPage />;
}
