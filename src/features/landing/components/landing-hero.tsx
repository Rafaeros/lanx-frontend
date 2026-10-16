import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { ProductPreview } from "./product-preview";

export function LandingHero({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
      <div>
        <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
          Um sistema para a operação inteira, começando por compras.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Acompanhe pedidos de compra, prazos de entrega e saldos pendentes. Materiais e unidades
          de medida são cadastrados uma vez e usados por todos os módulos.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link to={isAuthenticated ? "/app" : "/login"}>
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              {isAuthenticated ? "Abrir o sistema" : "Entrar com minha conta"}
            </Button>
          </Link>
          <a href="#modulos">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Ver módulos
            </Button>
          </a>
        </div>
      </div>

      <ProductPreview />
    </section>
  );
}
