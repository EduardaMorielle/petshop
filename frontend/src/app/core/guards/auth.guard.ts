// ============================================================
// ARQUIVO: auth.guard.ts
// CAMADA: Core / Guards
// O QUE É: Guard de rota que impede usuários não autenticados
//          de acessar páginas protegidas do sistema.
//
// COMO FUNCIONA:
//   - É executado ANTES de navegar para uma rota protegida
//   - Verifica se existe um token JWT válido no localStorage
//   - Se sim: permite a navegação (retorna true)
//   - Se não: redireciona para /login (retorna false)
//
// ONDE É APLICADO:
//   No app.routes.ts, a rota raiz tem canActivate: [authGuard].
//   Como as rotas filhas (dashboard, pets, etc.) estão dentro
//   desta rota pai, todas são automaticamente protegidas.
//
// FORMATO MODERNO (Angular 17+):
//   Usamos CanActivateFn (função) em vez da classe antiga
//   (CanActivate com implements). É o padrão recomendado.
// ============================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// CanActivateFn: tipo da função guard do Angular 17+
export const authGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  // Verifica se o usuário está logado (tem token no localStorage)
  if (auth.isLoggedIn()) {
    // Permite o acesso à rota
    return true;
  }

  // Redireciona para a tela de login
  // O usuário verá o login sem uma mensagem de erro —
  // simplesmente não conseguirá acessar a página protegida
  router.navigate(['/login']);
  return false;
};
