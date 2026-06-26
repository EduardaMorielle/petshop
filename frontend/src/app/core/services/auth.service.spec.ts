import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn() retorna false quando não há token', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('login() salva token e dados do usuário no localStorage', () => {
    const mockResponse = { token: 'jwt-abc', nome: 'Admin', perfil: 'ADMIN' };

    service.login({ email: 'admin@petshop.com', senha: 'admin123' }).subscribe();

    const req = http.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.getToken()).toBe('jwt-abc');
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.getUser()).toEqual({ nome: 'Admin', perfil: 'ADMIN' });
  });

  it('isAdmin() retorna true para perfil ADMIN', () => {
    localStorage.setItem('petshop_token', 'tok');
    localStorage.setItem('petshop_user', JSON.stringify({ nome: 'Admin', perfil: 'ADMIN' }));
    expect(service.isAdmin()).toBeTrue();
  });

  it('isAdmin() retorna false para perfil CLIENTE', () => {
    localStorage.setItem('petshop_token', 'tok');
    localStorage.setItem('petshop_user', JSON.stringify({ nome: 'Cliente', perfil: 'CLIENTE' }));
    expect(service.isAdmin()).toBeFalse();
  });

  it('logout() limpa localStorage', () => {
    localStorage.setItem('petshop_token', 'tok');
    localStorage.setItem('petshop_user', JSON.stringify({ nome: 'X', perfil: 'ADMIN' }));
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getUser()).toBeNull();
  });
});
