import { OperadoresListPage } from "@/features/cadastros/operadores";

export function meta() {
  return [
    { title: "Cadastro de Operadores - LANX" },
    { name: "description", content: "Gerenciamento dos operadores da produção" },
  ];
}

export default function OperadoresRoute() {
  return <OperadoresListPage />;
}
