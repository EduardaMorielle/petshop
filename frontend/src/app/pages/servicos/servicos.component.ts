import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizePipe } from '../../core/pipes/capitalize.pipe';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServicoService } from '../../core/services/servico.service';
import { Servico } from '../../core/models/models';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatCardModule, MatSnackBarModule, MatTooltipModule,
    CapitalizePipe
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon style="vertical-align:middle;margin-right:8px">content_cut</mat-icon>Serviços
          </mat-card-title>
          <span style="flex:1"></span>
          <button mat-raised-button color="primary" (click)="abrir()">
            <mat-icon>add</mat-icon> Novo Serviço
          </button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="servicos" style="width:100%;margin-top:16px">
            <ng-container matColumnDef="nome">
              <th mat-header-cell *matHeaderCellDef>Nome</th>
              <td mat-cell *matCellDef="let s">{{ s.nome | capitalize }}</td>
            </ng-container>
            <ng-container matColumnDef="descricao">
              <th mat-header-cell *matHeaderCellDef>Descrição</th>
              <td mat-cell *matCellDef="let s">{{ s.descricao || '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="preco">
              <th mat-header-cell *matHeaderCellDef>Preço</th>
              <td mat-cell *matCellDef="let s">{{ s.preco | currency:'BRL' }}</td>
            </ng-container>
            <ng-container matColumnDef="duracao">
              <th mat-header-cell *matHeaderCellDef>Duração</th>
              <td mat-cell *matCellDef="let s">{{ s.duracaoMinutos }} min</td>
            </ng-container>
            <ng-container matColumnDef="acoes">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let s">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" matTooltip="Editar" (click)="abrir(s)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" matTooltip="Excluir" (click)="deletar(s)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="colunas"></tr>
            <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
          </table>
          <mat-paginator [length]="total" [pageSize]="10" (page)="paginar($event)" />
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ServicosComponent implements OnInit {
  colunas = ['nome', 'descricao', 'preco', 'duracao', 'acoes'];
  servicos: Servico[] = [];
  total = 0;

  constructor(private svc: ServicoService, private dialog: MatDialog, private snack: MatSnackBar) {}

  ngOnInit() { this.carregar(); }

  carregar(page = 0) {
    this.svc.listar(page).subscribe(r => { this.servicos = r.content; this.total = r.totalElements; });
  }

  paginar(e: PageEvent) { this.carregar(e.pageIndex); }

  abrir(servico?: Servico) {
    this.dialog.open(ServicoFormComponent, { width: '480px', data: servico ?? null })
      .afterClosed().subscribe(ok => { if (ok) { this.carregar(); this.snack.open('Salvo!', '', { duration: 2500 }); } });
  }

  deletar(s: Servico) {
    if (!confirm(`Excluir "${s.nome}"?`)) return;
    this.svc.deletar(s.id!).subscribe({
      next: () => { this.carregar(); this.snack.open('Excluído!', '', { duration: 2500 }); },
      error: () => this.snack.open('Erro ao excluir', 'Fechar', { duration: 3000 })
    });
  }
}

@Component({
  selector: 'app-servico-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatDialogModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Novo' }} Serviço</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex;flex-direction:column;gap:12px;padding-top:8px">
        <mat-form-field class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome">
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput formControlName="descricao" rows="2"></textarea>
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Preço (R$)</mat-label>
          <input matInput formControlName="preco" type="number" step="0.01">
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Duração (minutos)</mat-label>
          <input matInput formControlName="duracaoMinutos" type="number">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="salvar()">Salvar</button>
    </mat-dialog-actions>
  `
})
export class ServicoFormComponent implements OnInit {
  form = this.fb.group({
    nome: ['', Validators.required],
    descricao: [''],
    preco: [null as number | null, [Validators.required, Validators.min(0.01)]],
    duracaoMinutos: [null as number | null, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private fb: FormBuilder, private svc: ServicoService,
    private ref: MatDialogRef<ServicoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Servico | null
  ) {}

  ngOnInit() { if (this.data) this.form.patchValue(this.data); }

  salvar() {
    if (this.form.invalid) return;
    const val = this.form.value as Servico;
    const req = this.data ? this.svc.atualizar(this.data.id!, val) : this.svc.criar(val);
    req.subscribe({ next: () => this.ref.close(true), error: () => this.ref.close(false) });
  }
}
