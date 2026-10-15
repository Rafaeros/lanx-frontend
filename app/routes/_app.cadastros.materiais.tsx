import { MateriaisListPage } from "@/features/cadastros/materiais";

export function meta() {
  return [
    { title: "Cadastro de Materiais - LANX" },
    { name: "description", content: "Gerenciamento e catálogo de materiais e insumos" },
  ];
}

export default function MateriaisRoute() {
  return <MateriaisListPage />;
}

