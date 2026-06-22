// ============================================================
// ARQUIVO: app.config.ts
// O QUE É: Configuração global da aplicação Angular.
//          Define os providers (serviços globais) disponíveis
//          em toda a aplicação.
//
// FORMATO MODERNO (Angular 17+):
//   No Angular 17+, não existe mais o AppModule.
//   A configuração é feita aqui com ApplicationConfig e
//   a aplicação é iniciada no main.ts com bootstrapApplication().
//   Este padrão é chamado de "Standalone Application".
// ============================================================

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideRouter: configura o sistema de rotas com as rotas definidas
    // em app.routes.ts. Habilita a navegação entre páginas.
    provideRouter(routes),

    // provideHttpClient: habilita o HttpClient para fazer requisições HTTP.
    // withInterceptors([authInterceptor]): registra nosso interceptor JWT.
    // Todo HttpClient.get/post/put/delete vai passar pelo authInterceptor.
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),

    // provideAnimations: habilita as animações do Angular Material.
    // Sem isso, componentes como MatDialog, MatSnackBar e MatMenu
    // não teriam as animações de abertura/fechamento.
    provideAnimations()
  ]
};
