import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AgendamentoService } from './agendamento.service';
import { environment } from '../../../environments/environment';
import { Agendamento, PageResponse } from '../models/models';

describe('AgendamentoService', () => {
  let service: AgendamentoService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/agendamentos`;

  const mockAgendamento: Agendamento = {
    id: 1, petId: 1, servicoId: 1,
    petNome: 'Rex', servicoNome: 'Banho',
    data: '2025-06-20', hora: '14:00', status: 'AGENDADO'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(AgendamentoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('deve ser criado', () => expect(service).toBeTruthy());

  it('listar() faz GET com paginação', () => {
    const page: PageResponse<Agendamento> = { content: [mockAgendamento], totalElements: 1, totalPages: 1, size: 10, number: 0 };
    service.listar(0, 10).subscribe(res => expect(res.content[0].status).toBe('AGENDADO'));
    const req = http.expectOne(r => r.url === url && r.params.get('page') === '0');
    expect(req.request.method).toBe('GET');
    req.flush(page);
  });

  it('buscar() faz GET por ID', () => {
    service.buscar(1).subscribe(a => expect(a.data).toBe('2025-06-20'));
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAgendamento);
  });

  it('criar() faz POST com dados do agendamento', () => {
    const novo: Agendamento = { petId: 2, servicoId: 1, data: '2025-07-01', hora: '10:00' };
    service.criar(novo).subscribe(a => expect(a.id).toBe(5));
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(novo);
    req.flush({ ...novo, id: 5, status: 'AGENDADO' });
  });

  it('atualizar() faz PUT', () => {
    const atualizado = { ...mockAgendamento, status: 'CONCLUIDO' };
    service.atualizar(1, atualizado).subscribe(a => expect(a.status).toBe('CONCLUIDO'));
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(atualizado);
  });

  it('deletar() faz DELETE', () => {
    service.deletar(1).subscribe();
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
