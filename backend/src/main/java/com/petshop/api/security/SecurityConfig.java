package com.petshop.api.security;

// ============================================================
// ARQUIVO: SecurityConfig.java
// CAMADA: Security
// O QUE É: Classe de configuração central do Spring Security.
//          Define QUAIS endpoints são públicos, quais são
//          protegidos, e como a autenticação funciona.
//
// DECISÕES IMPORTANTES DESTA CLASSE:
//
//   1. STATELESS: A API não guarda sessão no servidor.
//      Cada requisição precisa enviar o token JWT.
//      Isso é o modelo correto para APIs REST.
//
//   2. CSRF DESABILITADO: CSRF (Cross-Site Request Forgery) é
//      uma proteção para formulários de sites tradicionais.
//      Em APIs REST com JWT, não é necessário pois o token
//      já serve como proteção. Manter habilitado causaria
//      erros 403 no Angular sem motivo aparente.
//
//   3. CORS CONFIGURADO: O Angular roda em uma porta diferente
//      da API (4743 vs 8743). O navegador bloqueia requisições
//      entre origens diferentes por padrão (política Same-Origin).
//      O CORS precisa ser habilitado na API para que o Angular
//      consiga se comunicar.
//      ⚠️ allowedOrigins("*") está OK para desenvolvimento/UEA,
//      mas em produção real seria melhor especificar a URL exata.
//
//   4. REGRAS DE ACESSO:
//      - /api/auth/**     → público (login e registro)
//      - GET /api/servicos → autenticado (qualquer perfil)
//      - outros /api/servicos → somente ADMIN
//      - qualquer outra rota → autenticado
// ============================================================

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// @Configuration: indica que esta classe define beans Spring
// @EnableWebSecurity: ativa o Spring Security na aplicação
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // O JwtFilter que criamos — será inserido na cadeia de filtros
    private final JwtFilter jwtFilter;

    /**
     * Define a cadeia de filtros de segurança — o "coração" do Spring Security.
     * @Bean faz com que o Spring gerencie este objeto.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Aplica a configuração CORS definida no método corsSource()
            .cors(c -> c.configurationSource(corsSource()))

            // Desabilita CSRF — necessário para APIs REST com JWT (veja explicação acima)
            .csrf(csrf -> csrf.disable())

            // Define sessão como STATELESS — nenhuma sessão HTTP é criada ou usada
            // O token JWT substitui completamente o controle de sessão
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Define as regras de autorização por endpoint
            .authorizeHttpRequests(auth -> auth
                // /api/auth/** é público — qualquer um pode acessar login e registro
                .requestMatchers("/api/auth/**").permitAll()

                // GET /api/servicos é liberado para qualquer usuário autenticado
                // (clientes precisam ver os serviços para criar agendamentos)
                .requestMatchers(HttpMethod.GET, "/api/servicos/**").authenticated()

                // POST/PUT/DELETE /api/servicos → somente ADMIN pode criar/editar/excluir
                // hasRole("ADMIN") verifica se o usuário tem a authority "ROLE_ADMIN"
                .requestMatchers("/api/servicos/**").hasRole("ADMIN")

                // Qualquer outra requisição precisa estar autenticada
                .anyRequest().authenticated()
            )

            // Insere o JwtFilter ANTES do filtro padrão de autenticação username/password.
            // Isso faz com que nossa verificação JWT seja executada primeiro.
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Define o algoritmo de hash para senhas.
     * BCrypt é o padrão da indústria — aplica hash com salt aleatório.
     * Mesmo que dois usuários tenham a mesma senha, os hashes serão diferentes.
     * @Bean expõe este encoder para ser injetado em outros lugares (AuthService, DataInitializer).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura o CORS (Cross-Origin Resource Sharing).
     * Necessário para que o Angular (porta 4743) possa chamar a API (porta 8743).
     * Sem isso, o navegador bloquearia todas as requisições com erro:
     *   "Access to XMLHttpRequest blocked by CORS policy"
     */
    @Bean
    public CorsConfigurationSource corsSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Aceita requisições de qualquer origem.
        // Em produção real, substitua por: List.of("http://172.25.1.60:4743")
        config.setAllowedOrigins(List.of("*"));

        // Métodos HTTP permitidos
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Headers permitidos — "*" aceita qualquer header, incluindo "Authorization"
        config.setAllowedHeaders(List.of("*"));

        // Aplica esta configuração para todos os endpoints da API
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
