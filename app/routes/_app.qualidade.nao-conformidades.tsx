import { redirect } from "react-router";

/** Não conformidades passaram para o módulo Teste e Inspeção: o endereço antigo continua funcionando (favoritos, links). */
export function clientLoader() {
  return redirect("/teste-inspecao/nao-conformidades");
}

export default function NaoConformidadesAntigoRoute() {
  return null;
}
