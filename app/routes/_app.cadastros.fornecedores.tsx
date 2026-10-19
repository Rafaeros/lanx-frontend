import { FornecedoresListPage } from "@/features/cadastros/fornecedores";

export function meta() {
  return [
    { title: "Cadastro de Fornecedores - LANX" },
    { name: "description", content: "Gerenciamento dos fornecedores usados nos pedidos de compra" },
  ];
}

export default function FornecedoresRoute() {
  return <FornecedoresListPage />;
}
