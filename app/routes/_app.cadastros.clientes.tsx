import { ClientesListPage } from "@/features/cadastros/clientes";

export function meta() {
  return [
    { title: "Cadastro de Clientes - LANX" },
    { name: "description", content: "Clientes atendidos pelas ordens de produção" },
  ];
}

export default function ClientesRoute() {
  return <ClientesListPage />;
}
