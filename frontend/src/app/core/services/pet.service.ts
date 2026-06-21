// ============================================================
// ARQUIVO: pet.service.ts
// CAMADA: Core / Services
// O QUE É: Serviço Angular responsável por consumir os endpoints
//          de Pet da API REST.
//
// COMO FUNCIONA:
//   O Angular HttpClient faz as requisições HTTP para a API.
//   Cada método retorna um Observable — o componente que chamar
//   precisa fazer .subscribe() para que a requisição aconteça.
//
//   Todos os métodos são "enhancados" pelo authInterceptor:
//   o token JWT é adicionado automaticamente em cada chamada.
//
// ENDPOINTS CONSUMIDOS:
//   GET    /api/pets?page=0&size=10  → listar (paginado)
//   GET    /api/pets/{id}            → buscar por ID
//   POST   /api/pets                 → criar
//   PUT    /api/pets/{id}            → atualizar
//   DELETE /api/pets/{id}            → excluir
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Pet, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PetService {

  // URL base para os endpoints de pets
  // environment.apiUrl = "http://172.25.1.60:8743/api" (produção)
  private url = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  /**
   * Lista pets com paginação.
   * @param page número da página (começa em 0)
   * @param size itens por página
   * Retorna PageResponse<Pet> com content[] e totalElements para o MatPaginator
   */
  listar(page = 0, size = 10) {
    // HttpParams cria os query parameters: ?page=0&size=10
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Pet>>(this.url, { params });
  }

  /** Busca um pet específico pelo ID */
  buscar(id: number) {
    return this.http.get<Pet>(`${this.url}/${id}`);
  }

  /**
   * Cria um novo pet.
   * Envia o objeto Pet como JSON no corpo da requisição.
   * A API retorna o pet criado com o ID gerado.
   */
  criar(pet: Pet) {
    return this.http.post<Pet>(this.url, pet);
  }

  /**
   * Atualiza um pet existente.
   * @param id ID do pet a ser atualizado
   * @param pet dados novos
   */
  atualizar(id: number, pet: Pet) {
    return this.http.put<Pet>(`${this.url}/${id}`, pet);
  }

  /**
   * Exclui um pet pelo ID.
   * A API retorna HTTP 204 (No Content) em caso de sucesso.
   */
  deletar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
