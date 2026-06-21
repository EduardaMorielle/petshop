import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { AgendamentoService } from '../../core/services/agendamento.service';
import { PetService } from '../../core/services/pet.service';
import { ServicoService } from '../../core/services/servico.service';
import { Agendamento, Pet, Servico } from '../../core/models/models';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatCardModule, MatSnackBarModule,
    MatTooltipModule, MatChipsModule
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon style="vertical-align:middle;margin-right:8px">event</mat-icon>Agendamentos
          </mat-card-title>
          <span style="flex:1"></span>
          <button mat-raised-button color="primary" (click)="abrir()">
            <mat-icon>add</mat-icon> Novo Agendamento
          </button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="agendamentos" style="width:100%;margin-top:16px">
            <ng-container matColumnDef="pet">
              <th mat-header-cell *matHeaderCellDef>Pet</th>
              <td mat-cell *matCellDef="let a">{{ a.petNome }}</td>
            </ng-container>
            <ng-container matColumnDef="servico">
              <th mat-header-cell *matHeaderCellDef>Serviço</th>
              <td mat-cell *matCellDef="let a">{{ a.servicoNome }}</td>
            </ng-container>
            <ng-container matColumnDef="data">
              <th mat-header-cell *matHeaderCellDef>Data</th>
              <td mat-cell *matCellDef="let a">{{ a.data | date:'dd/MM/yyyy':'UTC' }}</td>
            </ng-container>
            <ng-container matColumnDef="hora">
              <th mat-header-cell *matHeaderCellDef>Hora</th>
              <td mat-cell *matCellDef="let a">{{ a.hora }}</td>
            </ng-container>
            <ng-container matColumnDef="preco">
              <th mat-header-cell *matHeaderCellDef>Valor</th>
              <td mat-cell *matCellDef="let a">{{ a.preco | currency:'BRL' }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let a">
                <span [style.color]="corStatus(a.status)">{{ a.status }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="acoes">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let a">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" matTooltip="Editar" (click)="abrir(a)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" matTooltip="Excluir" (click)="deletar(a)">
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
export class AgendamentosComponent implements OnInit {
  colunas = ['pet', 'servico', 'data', 'hora', 'preco', 'status', 'acoes'];
  agendamentos: Agendamento[] = [];
  total = 0;

  constructor(private svc: AgendamentoService, private dialog: MatDialog, private snack: MatSnackBar) {}

  ngOnInit() { this.carregar(); }

  carregar(page = 0) {
    this.svc.listar(page).subscribe(r => { this.agendamentos = r.content; this.total = r.totalElements; });
  }

  paginar(e: PageEvent) { this.carregar(e.pageIndex); }

  abrir(a?: Agendamento) {
    this.dialog.open(AgendamentoFormComponent, { width: '480px', data: a ?? null })
      .afterClosed().subscribe(ok => { if (ok) { this.carregar(); this.snack.open('Salvo!', '', { duration: 2500 }); } });
  }

  deletar(a: Agendamento) {
    if (!confirm('Excluir agendamento?')) return;
    this.svc.deletar(a.id!).subscribe({
      next: () => { this.carregar(); this.snack.open('Excluído!', '', { duration: 2500 }); },
      error: () => this.snack.open('Erro ao excluir', 'Fechar', { duration: 3000 })
    });
  }

  corStatus(status: string): string {
    const cores: Record<string, string> = { AGENDADO: '#1976d2', CONCLUIDO: '#388e3c', CANCELADO: '#d32f2f' };
    return cores[status] ?? '#666';
  }
}

@Component({
  selector: 'app-agendamento-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatDialogModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Novo' }} Agendamento</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex;flex-direction:column;gap:12px;padding-top:8px">
        <mat-form-field class="full-width">
          <mat-label>Pet</mat-label>
          <mat-select formControlName="petId">
            <mat-option *ngFor="let p of pets" [value]="p.id">{{ p.nome }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Serviço</mat-label>
          <mat-select formControlName="servicoId">
            <mat-option *ngFor="let s of servicos" [value]="s.id">{{ s.nome }} — {{ s.preco | currency:'BRL' }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Data</mat-label>
          <input matInput formControlName="data" type="date">
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Hora</mat-label>
          <input matInput formControlName="hora" type="time">
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Observações</mat-label>
          <textarea matInput formControlName="observacoes" rows="2"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="salvar()">Salvar</button>
    </mat-dialog-actions>
  `
})
export class AgendamentoFormComponent implements OnInit {
  form = this.fb.group({
    petId: [null as number | null, Validators.required],
    servicoId: [null as number | null, Validators.required],
    data: ['', Validators.required],
    hora: ['', Validators.required],
    observacoes: ['']
  });
  pets: Pet[] = [];
  servicos: Servico[] = [];

  constructor(
    private fb: FormBuilder,
    private svc: AgendamentoService,
    private petSvc: PetService,
    private servicoSvc: ServicoService,
    private ref: MatDialogRef<AgendamentoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Agendamento | null
  ) {}

  ngOnInit() {
    this.petSvc.listar(0, 100).subscribe(r => this.pets = r.content);
    this.servicoSvc.listar(0, 100).subscribe(r => this.servicos = r.content);
    if (this.data) this.form.patchValue(this.data);
  }

  salvar() {
    if (this.form.invalid) return;
    const val = this.form.value as Agendamento;
    const req = this.data ? this.svc.atualizar(this.data.id!, val) : this.svc.criar(val);
    req.subscribe({ next: () => this.ref.close(true), error: () => this.ref.close(false) });
  }
}
