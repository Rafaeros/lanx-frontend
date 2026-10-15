import { redirect } from "react-router";

export function clientLoader() {
  return redirect("/cadastros/materiais");
}

export default function DashboardIndex() {
  return null;
}

