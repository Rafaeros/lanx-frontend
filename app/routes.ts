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
  // Troca da senha provisória (pública: ainda não há token)
  route("primeiro-acesso", "routes/_auth.primeiro-acesso.tsx"),

  // Módulo interno autenticado (Layout com Sidebar e Header)
  layout("routes/_app.tsx", [
    route("app", "routes/_app.dashboard.tsx"),
    route("cadastros/materiais", "routes/_app.cadastros.materiais.tsx"),
    route("cadastros/unidades-medida", "routes/_app.cadastros.unidades-medida.tsx"),
    route("cadastros/fornecedores", "routes/_app.cadastros.fornecedores.tsx"),
    route("cadastros/departamentos", "routes/_app.cadastros.departamentos.tsx"),
    route("cadastros/operadores", "routes/_app.cadastros.operadores.tsx"),
    route("cadastros/compradores", "routes/_app.cadastros.compradores.tsx"),
    route("cadastros/rateios", "routes/_app.cadastros.rateios.tsx"),
    route("cadastros/clientes", "routes/_app.cadastros.clientes.tsx"),
    route("compras/analise-pedidos", "routes/_app.compras.analise-pedidos.tsx"),
    // endereço antigo do IQF: redireciona para /qualidade/iqf
    route("compras/iqf", "routes/_app.compras.iqf.tsx"),
    route("producao/comunizado", "routes/_app.producao.comunizado.tsx"),
    route("producao/ordens-de-producao", "routes/_app.producao.ordens-de-producao.tsx"),
    route("comercial/carteira", "routes/_app.comercial.carteira.tsx"),
    route("qualidade/iqf", "routes/_app.qualidade.iqf.tsx"),
    route("administracao/usuarios", "routes/_app.administracao.usuarios.tsx"),
    route("administracao/perfis", "routes/_app.administracao.perfis.tsx"),
    route("administracao/perfis/novo", "routes/_app.administracao.perfis.novo.tsx"),
    route("administracao/perfis/:id/editar", "routes/_app.administracao.perfis.editar.tsx"),
  ]),
] satisfies RouteConfig;
