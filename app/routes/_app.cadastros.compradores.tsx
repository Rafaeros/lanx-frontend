import { CompradoresListPage } from "@/features/cadastros/compradores";

export function meta() {
  return [
    { title: "Cadastro de Compradores - LANX" },
    { name: "description", content: "Compradores do ERP e vínculo com os usuários do LANX" },
  ];
}

export default function CompradoresRoute() {
  return <CompradoresListPage />;
}
