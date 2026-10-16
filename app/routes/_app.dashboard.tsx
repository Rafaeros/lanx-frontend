import { AppHomePage } from "@/features/navigation";

export function meta() {
  return [{ title: "Início - LANX" }];
}

export default function AppHomeRoute() {
  return <AppHomePage />;
}
