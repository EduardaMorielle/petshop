// ============================================================
// ARQUIVO: login.component.ts
// CAMADA: Pages
// O QUE É: Página de login da aplicação.
//          É a primeira tela que o usuário vê ao acessar o sistema
//          sem estar autenticado.
//
// FUNCIONALIDADES:
//   - Formulário reativo com validação em tempo real
//   - Campo de senha com toggle de visibilidade
//   - Feedback visual de erro via MatSnackBar
//   - Redirecionamento automático para o dashboard após login
//
// FORMULÁRIOS REATIVOS (ReactiveFormsModule):
//   Usamos FormBuilder para criar o formulário programaticamente.
//   Vantagens em relação ao Template-Driven:
//     - Validações definidas no código TypeScript (mais fácil de testar)
//     - Acesso direto ao estado do formulário (válido, inválido, sujo, etc.)
//     - Melhor para formulários complexos
// ============================================================

import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,    // Habilita formGroup, formControlName no template
    MatCardModule,          // mat-card (cartão com sombra)
    MatFormFieldModule,     // mat-form-field (campo com label flutuante)
    MatInputModule,         // matInput (estiliza o input)
    MatButtonModule,        // mat-raised-button
    MatIconModule,          // mat-icon
    MatSnackBarModule       // MatSnackBar (notificação toast)
  ],
  template: `
    <!-- Centraliza o card na tela com flexbox -->
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f5f5">
      <mat-card style="width:360px;padding:32px">

        <!-- Cabeçalho com logo e título -->
        <div style="text-align:center;margin-bottom:24px">
          <img src="assets/images/logo.png" alt="Logo" style="width:80px"
               onerror="this.style.display='none'">
          <h2 style="color:#3f51b5;margin-top:8px">Petshop Manager</h2>
          <p style="color:#666">Faça login para continuar</p>
        </div>

        <!--
          [formGroup]="form": conecta o template ao FormGroup criado no TypeScript
          (ngSubmit): evento disparado quando o formulário é submetido
        -->
        <form [formGroup]="form" (ngSubmit)="submit()">

          <!-- Campo de email -->
          <mat-form-field class="full-width">
            <mat-label>Email</mat-label>
            <!--
              formControlName="email": conecta este input ao FormControl "email"
              type="email": teclado numérico no mobile e validação nativa do browser
            -->
            <input matInput formControlName="email" type="email">
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <!-- Campo de senha com toggle de visibilidade -->
          <mat-form-field class="full-width" style="margin-top:8px">
            <mat-label>Senha</mat-label>
            <!--
              [type]: alterna entre 'password' (esconde) e 'text' (mostra)
              controlado pela variável "hide"
            -->
            <input matInput formControlName="senha" [type]="hide ? 'password' : 'text'">
            <!-- Botão para alternar visibilidade da senha -->
            <button mat-icon-button matSuffix type="button" (click)="hide = !hide">
              <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <!--
            [disabled]: desabilita o botão se o formulário for inválido OU
            se já está carregando (evita cliques duplos)
          -->
          <button mat-raised-button color="primary" class="full-width"
                  style="margin-top:16px"
                  [disabled]="form.invalid || loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </mat-card>
    </div>
  `
})
export class LoginComponent {

  // FormBuilder cria o FormGroup com os controles e suas validações
  form = this.fb.group({
    // Validators.required: campo obrigatório
    // Validators.email: valida formato de email
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required]
  });

  // Controla a visibilidade da senha (true = oculta, false = visível)
  hide = true;

  // Previne múltiplos cliques enquanto a requisição está em andamento
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  submit() {
    // Segurança extra: não processa se o formulário ainda for inválido
    if (this.form.invalid) return;

    this.loading = true;

    // Chama o AuthService.login() — retorna um Observable
    // form.value pode ter undefined nos campos, "as any" contorna isso
    this.auth.login(this.form.value as any).subscribe({
      // next: login bem-sucedido — navega para o dashboard
      next: () => this.router.navigate(['/']),

      // error: login falhou (credenciais erradas, API fora, etc.)
      // Exibe mensagem no snackbar e reabilita o botão
      error: () => {
        this.snack.open('Email ou senha inválidos', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
