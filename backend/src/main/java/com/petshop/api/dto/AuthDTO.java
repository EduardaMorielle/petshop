package com.petshop.api.dto;

// ============================================================
// ARQUIVO: AuthDTO.java
// CAMADA: DTO (Data Transfer Object)
// O QUE É: Classes que definem o formato dos dados trocados
//          entre o front-end e a API para autenticação.
//
// POR QUE USAR DTOs?
//   Porque não devemos expor as entidades (@Entity) diretamente
//   na API. Por exemplo: a entidade Usuario tem o campo "senha"
//   (com hash). Se retornássemos a entidade diretamente no login,
//   o hash da senha seria enviado para o cliente — um risco
//   de segurança desnecessário.
//
//   Com DTOs, controlamos exatamente o que entra e o que sai.
//
// ORGANIZAÇÃO:
//   Usamos classes estáticas internas para agrupar os DTOs
//   relacionados em um único arquivo (LoginRequest, RegisterRequest,
//   TokenResponse ficam todos em AuthDTO.java).
// ============================================================

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDTO {

    /**
     * LoginRequest: dados enviados pelo Angular no POST /api/auth/login
     * O Angular manda um JSON: { "email": "...", "senha": "..." }
     */
    @Data // Lombok: gera getters e setters
    public static class LoginRequest {

        // @NotBlank: campo não pode ser nulo, vazio ou só espaços
        // @Email: valida o formato do email (ex: teste@dominio.com)
        // Se a validação falhar, o GlobalExceptionHandler retorna 400
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String senha;
    }

    /**
     * RegisterRequest: dados enviados no POST /api/auth/registrar
     * O Angular manda: { "nome": "...", "email": "...", "senha": "...", "perfil": "CLIENTE" }
     */
    @Data
    public static class RegisterRequest {

        @NotBlank
        private String nome;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String senha;

        // Perfil é opcional no registro. Se não informado,
        // o AuthService.registrar() define como CLIENTE por padrão.
        // Se informado como "ADMIN", cria um administrador.
        private String perfil;
    }

    /**
     * TokenResponse: dados retornados pelo servidor após o login bem-sucedido.
     * O Angular recebe: { "token": "eyJ...", "nome": "...", "perfil": "ADMIN" }
     * e salva o token no localStorage para usar nas próximas requisições.
     */
    @Data
    @lombok.AllArgsConstructor
    public static class TokenResponse {
        // O token JWT que o Angular deve enviar no header Authorization
        private String token;

        // Nome do usuário para exibir na interface (ex: "Bem-vindo, Eduarda!")
        private String nome;

        // Perfil para o Angular decidir quais menus/botões mostrar
        private String perfil;
    }
}
