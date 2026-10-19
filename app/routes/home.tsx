import { LandingPage } from "@/features/landing";

export function meta() {
  return [
    { title: "LANX - Gestão industrial" },
    {
      name: "description",
      content: "Pedidos de compra, prazos de entrega e cadastros de materiais em um só sistema.",
    },
    { property: "og:title", content: "LANX - Gestão industrial" },
    { property: "og:image", content: "/brand/icon-512.png" },
  ];
}

export default function Home() {
  return <LandingPage />;
}
