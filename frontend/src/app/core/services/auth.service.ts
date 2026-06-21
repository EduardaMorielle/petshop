// ============================================================
// ARQUIVO: auth.service.ts
// CAMADA: Core / Services
// O QUE É: Serviço responsável por toda a lógica de autenticação
//          no front-end. Gerencia o token JWT no localStorage
//          e fornece métodos usados pelo guard e pelo layout.
//
// RESPONSABILIDADES:
//   - login(): chama a API e salva o token no localStorage
//   - logout(): remove o token e redireciona para /login
//   - getToken(): retorna o token salvo (usado pelo interceptor)
//   - isLoggedIn(): verifica se existe token (usado pelo guard)
//   - getUser(): retorna nome e perfil do usuário logado
//   - isAdmin(): verifica se o usuário é ADMIN (para mostrar/esconder menus)
//
// POR QUE localStorage?
//   O localStorage persiste os dados mesmo após fechar/reabrir
//   o navegador. O usuário não precisa fazer login toda vez.
//   Alternativa seria sessionStorage (apaga ao fechar a aba).
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, TokenResponse } from '../models/models';

// @Injectable({ providedIn: 'root' }): registra o serviço como singleton
// disponível em toda a aplicação (uma única instância compartilhada)
@Injectable({ providedIn: 'root' })
export class AuthService {

  // Chaves usadas para salvar os dados no localStorage.
  // Usar constantes evita typos (erros de digitação) espalhados pelo código.
  private readonly TOKEN_KEY = 'petshop_token';
  private readonly USER_KEY = 'petshop_user';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Faz login na API e salva o token no localStorage.
   * Retorna um Observable — o componente precisa chamar .subscribe()
   * para a requisição ser disparada (RxJS é lazy por padrão).
   *
   * pipe(tap()) executa um efeito colateral (salvar no localStorage)
   * sem modificar o valor do Observable.
   */
  login(dto: LoginRequest) {
    return this.http.post<TokenResponse>(`${environment.apiUrl}/auth/login`, dto).pipe(
      tap(res => {
        // Salva o token JWT — será enviado pelo interceptor em toda requisição
        localStorage.setItem(this.TOKEN_KEY, res.token);

        // Salva nome e perfil para usar na interface (sem precisar decodificar o token)
        localStorage.setItem(this.USER_KEY, JSON.stringify({
          nome: res.nome,
          perfil: res.perfil
        }));
      })
    );
  }

  /**
   * Faz logout: remove dados do localStorage e redireciona para /login.
   * Chamado pelo botão de logout no LayoutComponent.
   */
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  /**
   * Retorna o token JWT salvo no localStorage.
   * Usado pelo authInterceptor para adicionar no header Authorization.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica se o usuário está logado.
   * Simples: verifica se existe um token no localStorage.
   * ⚠️ Não valida se o token expirou — isso é feito pelo back-end.
   * Se o token expirou, a API retorna 401 e o usuário precisa
   * fazer login novamente (idealmente tratado com um error interceptor).
   */
  isLoggedIn(): boolean {
    return !!this.getToken(); // !! converte para boolean
  }

  /**
   * Retorna os dados do usuário logado (nome e perfil).
   * Salvo no localStorage durante o login para evitar decodificar o JWT.
   */
  getUser(): { nome: string; perfil: string } | null {
    const u = localStorage.getItem(this.USER_KEY);
    return u ? JSON.parse(u) : null;
  }

  /**
   * Verifica se o usuário logado é ADMIN.
   * Usado para mostrar/esconder botões de criar/editar/excluir serviços.
   */
  isAdmin(): boolean {
    return this.getUser()?.perfil === 'ADMIN';
  }
}
