import { redirect } from "react-router";

/** O IQF passou para o módulo Qualidade: o endereço antigo continua funcionando (favoritos, links). */
export function clientLoader() {
  return redirect("/qualidade/iqf");
}

export default function IqfAntigoRoute() {
  return null;
}
