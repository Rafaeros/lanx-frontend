import { DepartamentosListPage } from "@/features/cadastros/departamentos";

export function meta() {
  return [
    { title: "Cadastro de Departamentos - LANX" },
    { name: "description", content: "Gerenciamento dos departamentos aos quais os operadores pertencem" },
  ];
}

export default function DepartamentosRoute() {
  return <DepartamentosListPage />;
}
