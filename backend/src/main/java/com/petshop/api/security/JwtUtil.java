package com.petshop.api.security;

// ============================================================
// ARQUIVO: JwtUtil.java
// CAMADA: Security
// O QUE É: Utilitário responsável por GERAR e VALIDAR tokens JWT.
//
// O QUE É JWT (JSON Web Token):
//   Um token JWT é uma string dividida em 3 partes separadas por ".":
//     HEADER.PAYLOAD.SIGNATURE
//
//   - HEADER: algoritmo usado (HS256)
//   - PAYLOAD: dados do usuário (email, perfil, validade)
//   - SIGNATURE: assinatura digital que garante que ninguém
//                alterou o token
//
//   Exemplo real de token:
//   eyJhbGci...  .  eyJzdWIi...  .  SflKxwRJ...
//      header         payload       signature
//
// COMO FUNCIONA O FLUXO:
//   1. Cliente faz POST /api/auth/login com email + senha
//   2. AuthService valida as credenciais
//   3. JwtUtil.gerar() cria e assina o token com a chave secreta
//   4. Token é retornado ao cliente (Angular)
//   5. Angular salva o token no localStorage
//   6. Em toda requisição futura, Angular envia o token no header:
//        Authorization: Bearer eyJhbGci...
//   7. JwtFilter intercepta a requisição e chama JwtUtil.validar()
//   8. Se válido, libera o acesso ao endpoint
//
// ⚠️ NOTA DE VERSÃO:
//   A biblioteca jjwt mudou a API na versão 0.12.x.
//   Tutoriais antigos (pré-0.12) usam métodos depreciados:
//     ANTIGO (não use): Jwts.parser().setSigningKey(key).parseClaimsJws(token)
//     ATUAL (correto):  Jwts.parser().verifyWith(key).build().parseSignedClaims(token)
//   Se você copiar código antigo da internet, vai dar erro de compilação.
// ============================================================

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

// @Component: registra esta classe como bean Spring para poder
// ser injetada com @Autowired ou @RequiredArgsConstructor em outros lugares
@Component
public class JwtUtil {

    // Injeta o valor de jwt.secret do application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Injeta o valor de jwt.expiration do application.properties (86400000 ms = 24h)
    @Value("${jwt.expiration}")
    private long expiration;

    // Converte a string da chave secreta em um objeto SecretKey criptográfico.
    // Keys.hmacShaKeyFor() cria uma chave HMAC-SHA adequada para JWT.
    // É chamado como método privado para não repetir código.
    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Gera um novo token JWT para o usuário autenticado.
     *
     * @param email  Email do usuário (vai no "subject" do token)
     * @param perfil Perfil do usuário (ADMIN ou CLIENTE — vai como "claim")
     * @return String com o token JWT assinado
     */
    public String gerar(String email, String perfil) {
        return Jwts.builder()
                // subject: identificador principal do token (quem é o usuário)
                .subject(email)
                // claim customizado: guarda o perfil do usuário no token
                // Isso evita consulta ao banco a cada requisição para verificar o perfil
                .claim("perfil", perfil)
                // issuedAt: data/hora em que o token foi emitido
                .issuedAt(new Date())
                // expiration: data/hora em que o token vai expirar
                .expiration(new Date(System.currentTimeMillis() + expiration))
                // signWith: assina o token com a chave secreta (HMAC-SHA256)
                // Qualquer alteração no token invalida a assinatura
                .signWith(getKey())
                // compact: serializa tudo em uma string no formato JWT
                .compact();
    }

    /**
     * Extrai o email (subject) de um token JWT.
     * Usado no JwtFilter para identificar quem está fazendo a requisição.
     *
     * @param token O token JWT enviado no header Authorization
     * @return Email do usuário contido no token
     */
    public String getEmail(String token) {
        return Jwts.parser()
                .verifyWith(getKey())   // define a chave para verificar a assinatura
                .build()
                .parseSignedClaims(token)  // valida e desempacota o token
                .getPayload()
                .getSubject();              // retorna o "subject" (email)
    }

    /**
     * Verifica se um token JWT é válido.
     * Um token é inválido se: expirou, foi alterado, ou a assinatura não confere.
     *
     * @param token O token JWT a ser validado
     * @return true se o token for válido, false caso contrário
     */
    public boolean validar(String token) {
        try {
            // Se parseSignedClaims não lançar exceção, o token é válido
            Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            // JwtException cobre: token expirado, assinatura inválida,
            // token malformado, etc.
            return false;
        }
    }
}
