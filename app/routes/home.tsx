import { LandingPage } from "@/features/landing";

export function meta() {
  return [
    { title: "LANX - Gestão industrial" },
    {
      name: "description",
      content: "Pedidos de compra, prazos de entrega e cadastros de materiais em um só sistema.",
    },
  ];
}

export default function Home() {
  return <LandingPage />;
}
