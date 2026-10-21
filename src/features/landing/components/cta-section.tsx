import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { CableLines } from "./cable-lines";
import { Reveal } from "./reveal";

export function CtaSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <Reveal from="scale" className="mx-auto max-w-6xl">
        <div className="relative isolate overflow-hidden rounded-3xl bg-brand-gradient px-6 py-16 text-center text-white sm:px-12">
          <CableLines id="cta-cable" className="-z-10 opacity-40 mix-blend-overlay" />
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Tudo pronto para o próximo pedido.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Entre com o usuário fornecido pelo administrador. No primeiro acesso, você define a sua senha.
          </p>
          <Link
            to={isAuthenticated ? "/app" : "/login"}
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[var(--brand-from)] shadow-lg transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-white"
          >
            {isAuthenticated ? "Abrir o sistema" : "Entrar no LANX"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
