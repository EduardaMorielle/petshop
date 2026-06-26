import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetService } from './pet.service';
import { environment } from '../../../environments/environment';
import { Pet, PageResponse } from '../models/models';

describe('PetService', () => {
  let service: PetService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/pets`;

  const mockPet: Pet = { id: 1, nome: 'Rex', especie: 'CÃO', tutorId: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(PetService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('deve ser criado', () => expect(service).toBeTruthy());

  it('listar() faz GET com params de paginação', () => {
    const page: PageResponse<Pet> = { content: [mockPet], totalElements: 1, totalPages: 1, size: 10, number: 0 };
    service.listar(0, 10).subscribe(res => expect(res.content.length).toBe(1));
    const req = http.expectOne(r => r.url === url && r.params.get('page') === '0');
    expect(req.request.method).toBe('GET');
    req.flush(page);
  });

  it('buscar() faz GET por ID', () => {
    service.buscar(1).subscribe(p => expect(p.nome).toBe('Rex'));
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPet);
  });

  it('criar() faz POST com o pet', () => {
    const novo: Pet = { nome: 'Mimi', especie: 'GATO', tutorId: 2 };
    service.criar(novo).subscribe(p => expect(p.id).toBe(2));
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(novo);
    req.flush({ ...novo, id: 2 });
  });

  it('atualizar() faz PUT com os dados do pet', () => {
    service.atualizar(1, mockPet).subscribe(p => expect(p.nome).toBe('Rex'));
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockPet);
  });

  it('deletar() faz DELETE por ID', () => {
    service.deletar(1).subscribe();
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
