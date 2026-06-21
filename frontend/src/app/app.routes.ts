// ============================================================
// ARQUIVO: app.routes.ts
// O QUE É: Define todas as rotas da SPA (Single Page Application).
//          Diz ao Angular qual componente renderizar para cada URL.
//
// COMO FUNCIONA:
//   O Angular Router monitora a URL do navegador.
//   Quando a URL muda, ele encontra a rota correspondente
//   e renderiza o componente no <router-outlet>.
//
// LAZY LOADING (loadComponent):
//   Em vez de importar todos os componentes no início,
//   usamos loadComponent() para carregar cada página
//   somente quando o usuário navegar até ela.
//   Isso reduz o tempo de carregamento inicial da aplicação.
//
// PROTEÇÃO DE ROTAS:
//   canActivate: [authGuard] na rota pai protege automaticamente
//   todas as rotas filhas (dashboard, pets, serviços, agendamentos).
//   Se o usuário não estiver logado, será redirecionado para /login.
// ============================================================

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  // Rota pública: tela de login
  // Qualquer pessoa pode acessar /login sem estar autenticada
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  // Rota pai protegida pelo authGuard
  // O LayoutComponent define o "shell" da aplicação:
  // sidenav + toolbar + <router-outlet> para as páginas filhas
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard], // ← guard aplicado aqui protege todas as filhas
    children: [
      // Redireciona / para /dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard: visão geral com contadores
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },

      // Pets: CRUD de animais
      {
        path: 'pets',
        loadComponent: () =>
          import('./pages/pets/pets.component').then(m => m.PetsComponent)
      },

      // Serviços: CRUD de serviços (edição restrita ao ADMIN no back-end)
      {
        path: 'servicos',
        loadComponent: () =>
          import('./pages/servicos/servicos.component').then(m => m.ServicosComponent)
      },

      // Agendamentos: CRUD de agendamentos
      {
        path: 'agendamentos',
        loadComponent: () =>
          import('./pages/agendamentos/agendamentos.component').then(m => m.AgendamentosComponent)
      },
    ]
  },

  // Rota curinga: qualquer URL não reconhecida vai para a raiz
  // A raiz redireciona para /dashboard (ou /login se não autenticado)
  { path: '**', redirectTo: '' }
];
