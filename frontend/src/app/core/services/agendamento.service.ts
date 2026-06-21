import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Agendamento, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private url = `${environment.apiUrl}/agendamentos`;

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Agendamento>>(this.url, { params });
  }

  buscar(id: number) {
    return this.http.get<Agendamento>(`${this.url}/${id}`);
  }

  criar(a: Agendamento) {
    return this.http.post<Agendamento>(this.url, a);
  }

  atualizar(id: number, a: Agendamento) {
    return this.http.put<Agendamento>(`${this.url}/${id}`, a);
  }

  deletar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
