import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Servico, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ServicoService {
  private url = `${environment.apiUrl}/servicos`;

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Servico>>(this.url, { params });
  }

  buscar(id: number) {
    return this.http.get<Servico>(`${this.url}/${id}`);
  }

  criar(s: Servico) {
    return this.http.post<Servico>(this.url, s);
  }

  atualizar(id: number, s: Servico) {
    return this.http.put<Servico>(`${this.url}/${id}`, s);
  }

  deletar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
