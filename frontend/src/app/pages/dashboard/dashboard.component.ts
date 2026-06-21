import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PetService } from '../../core/services/pet.service';
import { ServicoService } from '../../core/services/servico.service';
import { AgendamentoService } from '../../core/services/agendamento.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterLink],
  template: `
    <div class="page-container">
      <h2>Bem-vinda, {{ user?.nome }}!</h2>
      <p style="color:#666;margin-bottom:24px">Resumo do sistema</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px">
        <mat-card routerLink="/pets" style="cursor:pointer;text-align:center;padding:24px">
          <mat-icon style="font-size:48px;width:48px;height:48px;color:#3f51b5">pets</mat-icon>
          <h1 style="color:#3f51b5">{{ totalPets }}</h1>
          <p>Pets cadastrados</p>
        </mat-card>
        <mat-card routerLink="/servicos" style="cursor:pointer;text-align:center;padding:24px">
          <mat-icon style="font-size:48px;width:48px;height:48px;color:#e91e63">content_cut</mat-icon>
          <h1 style="color:#e91e63">{{ totalServicos }}</h1>
          <p>Serviços disponíveis</p>
        </mat-card>
        <mat-card routerLink="/agendamentos" style="cursor:pointer;text-align:center;padding:24px">
          <mat-icon style="font-size:48px;width:48px;height:48px;color:#4caf50">event</mat-icon>
          <h1 style="color:#4caf50">{{ totalAgendamentos }}</h1>
          <p>Agendamentos</p>
        </mat-card>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user = this.auth.getUser();
  totalPets = 0;
  totalServicos = 0;
  totalAgendamentos = 0;

  constructor(
    private auth: AuthService,
    private petService: PetService,
    private servicoService: ServicoService,
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit() {
    this.petService.listar(0, 1).subscribe(r => this.totalPets = r.totalElements);
    this.servicoService.listar(0, 1).subscribe(r => this.totalServicos = r.totalElements);
    this.agendamentoService.listar(0, 1).subscribe(r => this.totalAgendamentos = r.totalElements);
  }
}
