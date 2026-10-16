import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Landing Page pública
  index("routes/home.tsx"),

  // Tela de Login
  route("login", "routes/_auth.login.tsx"),

  // Módulo interno autenticado (Layout com Sidebar e Header)
  layout("routes/_app.tsx", [
    route("app", "routes/_app.dashboard.tsx"),
    route("cadastros/materiais", "routes/_app.cadastros.materiais.tsx"),
    route("cadastros/unidades-medida", "routes/_app.cadastros.unidades-medida.tsx"),
    route("compras/analise-pedidos", "routes/_app.compras.analise-pedidos.tsx"),
    route("administracao/usuarios", "routes/_app.administracao.usuarios.tsx"),
    route("administracao/perfis", "routes/_app.administracao.perfis.tsx"),
  ]),
] satisfies RouteConfig;
