package com.petshop.api.security;

// ============================================================
// ARQUIVO: JwtFilter.java
// CAMADA: Security
// O QUE É: Filtro HTTP que intercepta TODAS as requisições que
//          chegam na API e verifica se o token JWT é válido.
//
// COMO FUNCIONA (passo a passo):
//   1. Toda requisição HTTP passa por este filtro ANTES de chegar
//      ao Controller.
//   2. O filtro lê o header "Authorization" da requisição.
//   3. Se o header existir e começar com "Bearer ", extrai o token.
//   4. Valida o token com JwtUtil.validar().
//   5. Se válido, busca o usuário no banco pelo email do token.
//   6. Cria um objeto de autenticação e registra no SecurityContext.
//   7. O Spring Security então reconhece o usuário como autenticado
//      e libera o acesso ao endpoint.
//   8. Se o token não existir ou for inválido, a requisição continua
//      sem autenticação — o Spring Security vai bloquear se o
//      endpoint for protegido.
//
// HERANÇA:
//   Estende OncePerRequestFilter para garantir que o filtro
//   seja executado APENAS UMA VEZ por requisição (o Spring pode
//   chamar filtros múltiplas vezes em alguns cenários sem isso).
// ============================================================

import com.petshop.api.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    // JwtUtil para validar o token e extrair o email
    private final JwtUtil jwtUtil;

    // UsuarioRepository para buscar o usuário no banco pelo email
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        // Lê o header "Authorization" da requisição HTTP
        String header = request.getHeader("Authorization");

        // Verifica se o header existe E começa com "Bearer "
        // (padrão OAuth2/JWT: "Authorization: Bearer <token>")
        if (header != null && header.startsWith("Bearer ")) {

            // Remove o prefixo "Bearer " (7 caracteres) para obter só o token
            String token = header.substring(7);

            // Valida o token (verifica assinatura, expiração, etc.)
            if (jwtUtil.validar(token)) {

                // Extrai o email do payload do token
                String email = jwtUtil.getEmail(token);

                // Busca o usuário no banco pelo email
                // ifPresent() só executa o bloco se o usuário existir
                usuarioRepository.findByEmail(email).ifPresent(u -> {

                    // Cria o objeto de autenticação do Spring Security.
                    // UsernamePasswordAuthenticationToken(principal, credentials, authorities)
                    // - principal: identificador do usuário (email)
                    // - credentials: null (não precisamos da senha aqui)
                    // - authorities: lista de permissões ("ROLE_ADMIN" ou "ROLE_CLIENTE")
                    //
                    // ⚠️ IMPORTANTE: O Spring Security exige o prefixo "ROLE_"
                    // nas authorities. Por isso adicionamos "ROLE_" antes do perfil.
                    // No SecurityConfig, hasRole("ADMIN") verifica automaticamente
                    // por "ROLE_ADMIN".
                    var auth = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + u.getPerfil().name()))
                    );

                    // Registra a autenticação no SecurityContext.
                    // A partir daqui, o Spring Security reconhece esta requisição
                    // como autenticada pelo usuário com este email e perfil.
                    SecurityContextHolder.getContext().setAuthentication(auth);
                });
            }
        }

        // Passa a requisição para o próximo filtro (ou para o Controller)
        // Isso DEVE sempre ser chamado, senão a requisição trava aqui.
        chain.doFilter(request, response);
    }
}
