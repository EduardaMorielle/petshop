import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServicoService } from './servico.service';
import { environment } from '../../../environments/environment';
import { Servico, PageResponse } from '../models/models';

describe('ServicoService', () => {
  let service: ServicoService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/servicos`;

  const mockServico: Servico = { id: 1, nome: 'Banho', preco: 50, duracaoMinutos: 60 };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ServicoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('deve ser criado', () => expect(service).toBeTruthy());

  it('listar() faz GET com params de paginação', () => {
    const page: PageResponse<Servico> = { content: [mockServico], totalElements: 1, totalPages: 1, size: 10, number: 0 };
    service.listar(0, 10).subscribe(res => expect(res.content[0].nome).toBe('Banho'));
    const req = http.expectOne(r => r.url === url && r.params.get('page') === '0');
    expect(req.request.method).toBe('GET');
    req.flush(page);
  });

  it('buscar() faz GET por ID', () => {
    service.buscar(1).subscribe(s => expect(s.preco).toBe(50));
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockServico);
  });

  it('criar() faz POST', () => {
    const novo: Servico = { nome: 'Tosa', preco: 80, duracaoMinutos: 90 };
    service.criar(novo).subscribe(s => expect(s.id).toBe(2));
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush({ ...novo, id: 2 });
  });

  it('atualizar() faz PUT', () => {
    service.atualizar(1, mockServico).subscribe(s => expect(s.nome).toBe('Banho'));
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockServico);
  });

  it('deletar() faz DELETE', () => {
    service.deletar(1).subscribe();
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
