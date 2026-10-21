import { LandingPage } from "@/features/landing";

export function meta() {
  return [
    { title: "LANX Cables - Sistema de gestão" },
    {
      name: "description",
      content: "Compras, qualidade de fornecedores e produção da LANX Cables em um só sistema.",
    },
    { property: "og:title", content: "LANX Cables - Sistema de gestão" },
    { property: "og:image", content: "/brand/icon-512.png" },
  ];
}

export default function Home() {
  return <LandingPage />;
}
