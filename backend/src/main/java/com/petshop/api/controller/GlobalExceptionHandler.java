package com.petshop.api.controller;

// ============================================================
// ARQUIVO: GlobalExceptionHandler.java
// CAMADA: Controller
// O QUE É: Classe que captura exceções lançadas em qualquer
//          parte da aplicação e as converte em respostas HTTP
//          com formato JSON padronizado.
//
// POR QUE É NECESSÁRIO:
//   Sem este handler, quando um Service lança RuntimeException,
//   o Spring retorna uma página HTML de erro 500 por padrão —
//   o que seria inútil para um front-end Angular que espera JSON.
//
//   Com este handler, todas as exceções são capturadas e
//   retornadas como: { "erro": "mensagem de erro" }
//
// @RestControllerAdvice:
//   Combina @ControllerAdvice (intercepta exceções globais)
//   com @ResponseBody (serializa respostas em JSON).
// ============================================================

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Captura qualquer RuntimeException lançada nos Services.
     * Exemplos: "Credenciais inválidas", "Pet não encontrado", etc.
     * Retorna HTTP 400 (Bad Request) com o mapa { "erro": "mensagem" }.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException e) {
        return ResponseEntity
                .badRequest() // HTTP 400
                .body(Map.of("erro", e.getMessage()));
    }

    /**
     * Captura erros de validação dos DTOs (anotações @NotBlank, @Email, etc.).
     * Quando o Angular envia dados inválidos, o Spring lança esta exceção
     * antes mesmo de chegar no Service.
     *
     * Extrai a primeira mensagem de erro e retorna HTTP 400.
     * Ex: { "erro": "email: must be a well-formed email address" }
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException e) {
        // Pega o primeiro erro de campo encontrado
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .findFirst()
                .orElse("Dados inválidos");
        return ResponseEntity.badRequest().body(Map.of("erro", msg));
    }
}
