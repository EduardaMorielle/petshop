// ============================================================
// ARQUIVO: layout.component.ts
// CAMADA: Shared / Components
// O QUE É: Componente que define o "esqueleto" visual da aplicação
//          para todas as páginas autenticadas.
//          Contém o menu lateral (sidenav) e a barra superior (toolbar).
//
// ESTRUTURA VISUAL:
//   ┌─────────────────────────────────────────────┐
//   │  TOOLBAR (barra superior azul)               │
//   ├──────────────┬──────────────────────────────┤
//   │  SIDENAV     │  <router-outlet>              │
//   │  (menu)      │  (conteúdo da página atual)   │
//   │  Dashboard   │                               │
//   │  Pets        │                               │
//   │  Serviços    │                               │
//   │  Agendamentos│                               │
//   └──────────────┴──────────────────────────────┘
//
// COMO FUNCIONA:
//   O LayoutComponent é o componente pai das rotas protegidas
//   (definido em app.routes.ts como component da rota raiz).
//   O <router-outlet> dentro dele renderiza a página filha ativa.
//   Quando o usuário clica em "Pets", o router-outlet troca para
//   o PetsComponent sem recarregar o menu ou a toolbar.
// ============================================================

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true, // Componente standalone — não precisa de NgModule
  imports: [
    CommonModule,
    RouterOutlet,       // <router-outlet> para renderizar páginas filhas
    RouterLink,         // routerLink nas âncoras do menu
    RouterLinkActive,   // aplica classe CSS quando a rota está ativa
    MatSidenavModule,   // mat-sidenav-container, mat-sidenav, mat-sidenav-content
    MatToolbarModule,   // mat-toolbar
    MatListModule,      // mat-nav-list, mat-list-item
    MatIconModule,      // mat-icon (ícones Material)
    MatButtonModule     // mat-icon-button
  ],
  template: `
    <!--
      mat-sidenav-container: wrapper que organiza sidenav + conteúdo principal
      height:100vh: ocupa toda a altura da tela
    -->
    <mat-sidenav-container style="height:100vh">

      <!--
        mat-sidenav: o menu lateral
        mode="side": fica sempre visível (não sobrepõe o conteúdo)
        opened: começa aberto por padrão
        Alternativa: mode="over" deixa o menu sobrepor (estilo mobile)
      -->
      <mat-sidenav mode="side" opened style="width:220px">

        <!-- Cabeçalho do menu com logo e nome do sistema -->
        <div style="padding:16px;text-align:center">
          <!--
            Logo do petshop. O arquivo deve estar em:
            frontend/src/assets/images/logo.png
            onerror: se a imagem não existir, esconde o elemento
            para não quebrar o layout
          -->
          <img src="assets/images/logo.png" alt="Logo"
               style="width:80px;border-radius:50%"
               onerror="this.style.display='none'">
          <h3 style="margin-top:8px;color:#3f51b5">Petshop</h3>
        </div>

        <!--
          mat-nav-list: lista de navegação do Angular Material
          Cada item é um link para uma rota da aplicação
        -->
        <mat-nav-list>
          <!--
            routerLink: define para qual rota o link leva
            routerLinkActive="active-link": adiciona a classe CSS
            "active-link" quando esta rota está ativa, realçando
            o item do menu correspondente à página atual
          -->
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/pets" routerLinkActive="active-link">
            <mat-icon matListItemIcon>pets</mat-icon>
            <span matListItemTitle>Pets</span>
          </a>
          <a mat-list-item routerLink="/servicos" routerLinkActive="active-link">
            <mat-icon matListItemIcon>content_cut</mat-icon>
            <span matListItemTitle>Serviços</span>
          </a>
          <a mat-list-item routerLink="/agendamentos" routerLinkActive="active-link">
            <mat-icon matListItemIcon>event</mat-icon>
            <span matListItemTitle>Agendamentos</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- Conteúdo principal (toolbar + páginas) -->
      <mat-sidenav-content>

        <!-- Barra superior com nome do sistema, usuário logado e botão de logout -->
        <mat-toolbar color="primary">
          <span>Petshop Manager</span>
          <span style="flex:1"></span> <!-- empurra os itens seguintes para a direita -->
          <!-- user?.nome: optional chaining — não quebra se user for null -->
          <span style="margin-right:16px">{{ user?.nome }}</span>
          <button mat-icon-button (click)="logout()" title="Sair">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>

        <!--
          router-outlet: aqui é renderizada a página filha ativa.
          Quando o usuário navega para /pets, o PetsComponent aparece aqui.
          O menu e a toolbar permanecem intactos (SPA behavior).
        -->
        <router-outlet />

      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    // Estilo aplicado ao item do menu quando a rota está ativa
    `.active-link { background: rgba(63,81,181,.12); font-weight: 500; }`
  ]
})
export class LayoutComponent {
  // Pega os dados do usuário logado para exibir na toolbar
  user = this.auth.getUser();

  constructor(private auth: AuthService) {}

  // Chamado pelo botão de logout na toolbar
  logout() {
    this.auth.logout(); // Remove token e redireciona para /login
  }
}
