// ============================================================
// ARQUIVO: auth.interceptor.ts
// CAMADA: Core / Interceptors
// O QUE É: Interceptor HTTP do Angular que adiciona automaticamente
//          o token JWT em TODAS as requisições enviadas para a API.
//
// COMO FUNCIONA:
//   Sem este interceptor, você teria que manualmente adicionar
//   o header "Authorization: Bearer <token>" em cada chamada HTTP.
//   Com o interceptor, isso acontece automaticamente — o Angular
//   intercepta toda requisição antes de enviá-la e injeta o token.
//
// FLUXO:
//   1. Component chama petService.listar()
//   2. PetService chama this.http.get('/api/pets')
//   3. O Angular ativa o interceptor ANTES de enviar
//   4. Interceptor pega o token do localStorage
//   5. Clona a requisição adicionando o header Authorization
//   6. Envia a requisição modificada
//   7. O JwtFilter no back-end lê e valida o token
//
// FORMATO MODERNO (Angular 17+):
//   Usamos HttpInterceptorFn (função) em vez da classe antiga
//   (HttpInterceptor com implements). O formato de função é mais
//   simples e é o padrão recomendado no Angular 17+.
//   É registrado no app.config.ts com withInterceptors([]).
// ============================================================

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// HttpInterceptorFn: tipo da função interceptora do Angular 17+
// Recebe a requisição (req) e a função next (para passar adiante)
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // inject() é a forma de obter serviços dentro de funções no Angular 17+
  // (não podemos usar construtor aqui pois não é uma classe)
  const auth = inject(AuthService);

  // Pega o token salvo no localStorage
  const token = auth.getToken();

  if (token) {
    // Clona a requisição e adiciona o header Authorization
    // A requisição é imutável — não podemos modificá-la diretamente,
    // por isso usamos req.clone() para criar uma cópia modificada
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
        // Resultado: "Authorization: Bearer eyJhbGci..."
      }
    });
  }

  // Passa a requisição (original ou modificada) para o próximo handler
  return next(req);
};
