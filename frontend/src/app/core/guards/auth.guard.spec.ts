import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authService }]
    });

    router = TestBed.inject(Router);
  });

  it('permite acesso quando usuário está logado', () => {
    authService.isLoggedIn.and.returnValue(true);
    expect(runGuard()).toBeTrue();
  });

  it('redireciona para /login quando usuário não está logado', () => {
    authService.isLoggedIn.and.returnValue(false);
    const spy = spyOn(router, 'navigate');
    expect(runGuard()).toBeFalse();
    expect(spy).toHaveBeenCalledWith(['/login']);
  });
});
