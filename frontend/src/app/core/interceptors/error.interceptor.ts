// ============================================================
// ARQUIVO: error.interceptor.ts
// CAMADA: Core / Interceptors
// O QUE É: Interceptor que captura erros HTTP globais.
// - Ao receber 401 (Unauthorized) força logout e redireciona para /login
// - Mostra uma mensagem ao usuário via MatSnackBar
// ============================================================

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const snack = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: any) => {
      // Se receber 401 — token inválido ou expirado — faz logout
      if (err?.status === 401) {
        try {
          auth.logout();
          snack.open('Sessão expirada. Faça login novamente.', 'Fechar', { duration: 3500 });
        } catch (e) { /* não bloquear */ }
      }
      return throwError(() => err);
    })
  );
};
