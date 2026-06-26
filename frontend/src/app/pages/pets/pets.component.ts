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
import { PetService } from '../../core/services/pet.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Pet, Usuario } from '../../core/models/models';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatCardModule, MatSnackBarModule, MatTooltipModule, MatSelectModule
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon style="vertical-align:middle;margin-right:8px">pets</mat-icon>Pets
          </mat-card-title>
          <span style="flex:1"></span>
          <button mat-raised-button color="primary" (click)="abrir()">
            <mat-icon>add</mat-icon> Novo Pet
          </button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="pets" style="width:100%;margin-top:16px">
            <ng-container matColumnDef="nome">
              <th mat-header-cell *matHeaderCellDef>Nome</th>
              <td mat-cell *matCellDef="let p">{{ p.nome }}</td>
            </ng-container>
            <ng-container matColumnDef="especie">
              <th mat-header-cell *matHeaderCellDef>Espécie</th>
              <td mat-cell *matCellDef="let p">{{ p.especie }}</td>
            </ng-container>
            <ng-container matColumnDef="raca">
              <th mat-header-cell *matHeaderCellDef>Raça</th>
              <td mat-cell *matCellDef="let p">{{ p.raca || '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="idade">
              <th mat-header-cell *matHeaderCellDef>Idade</th>
              <td mat-cell *matCellDef="let p">{{ p.idade != null ? (p.idade | number) + ' ano(s)' : '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="tutor">
              <th mat-header-cell *matHeaderCellDef>Tutor</th>
              <td mat-cell *matCellDef="let p">{{ p.tutorNome }}</td>
            </ng-container>
            <ng-container matColumnDef="acoes">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let p">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" matTooltip="Editar" (click)="abrir(p)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" matTooltip="Excluir" (click)="deletar(p)">
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
export class PetsComponent implements OnInit {
  colunas = ['nome', 'especie', 'raca', 'idade', 'tutor', 'acoes'];
  pets: Pet[] = [];
  total = 0;

  constructor(private svc: PetService, private dialog: MatDialog, private snack: MatSnackBar) {}

  ngOnInit() { this.carregar(); }

  carregar(page = 0) {
    this.svc.listar(page).subscribe(r => { this.pets = r.content; this.total = r.totalElements; });
  }

  paginar(e: PageEvent) { this.carregar(e.pageIndex); }

  abrir(pet?: Pet) {
    this.dialog.open(PetFormComponent, { width: '480px', data: pet ?? null })
      .afterClosed().subscribe(ok => { if (ok) { this.carregar(); this.snack.open('Salvo com sucesso!', '', { duration: 2500 }); } });
  }

  deletar(pet: Pet) {
    if (!confirm(`Excluir ${pet.nome}?`)) return;
    this.svc.deletar(pet.id!).subscribe({
      next: () => { this.carregar(); this.snack.open('Excluído!', '', { duration: 2500 }); },
      error: () => this.snack.open('Erro ao excluir', 'Fechar', { duration: 3000 })
    });
  }
}

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatDialogModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Novo' }} Pet</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex;flex-direction:column;gap:12px;padding-top:8px">
        <mat-form-field class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome">
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Espécie</mat-label>
          <mat-select formControlName="especie">
            <mat-option value="CÃO">Cão</mat-option>
            <mat-option value="GATO">Gato</mat-option>
            <mat-option value="AVE">Ave</mat-option>
            <mat-option value="ROEDOR">Roedor</mat-option>
            <mat-option value="OUTROS">Outros</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Raça</mat-label>
          <input matInput formControlName="raca">
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Idade (anos)</mat-label>
          <input matInput formControlName="idade" type="number">
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Tutor</mat-label>
          <mat-select formControlName="tutorId">
            <mat-option *ngFor="let u of usuarios" [value]="u.id">{{ u.nome }} ({{ u.email }})</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="salvar()">Salvar</button>
    </mat-dialog-actions>
  `
})
export class PetFormComponent implements OnInit {
  form = this.fb.group({
    nome: ['', Validators.required],
    especie: ['', Validators.required],
    raca: [''],
    idade: [null as number | null],
    tutorId: [null as number | null, Validators.required]
  });
  usuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder, private svc: PetService,
    private usuarioSvc: UsuarioService,
    private ref: MatDialogRef<PetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Pet | null
  ) {}

  ngOnInit() {
    this.usuarioSvc.listar().subscribe(u => this.usuarios = u);
    if (this.data) this.form.patchValue(this.data);
  }

  salvar() {
    if (this.form.invalid) return;
    const val = this.form.value as Pet;
    const req = this.data ? this.svc.atualizar(this.data.id!, val) : this.svc.criar(val);
    req.subscribe({ next: () => this.ref.close(true), error: () => this.ref.close(false) });
  }
}
