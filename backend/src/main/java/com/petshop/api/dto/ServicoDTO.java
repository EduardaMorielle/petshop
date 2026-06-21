package com.petshop.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

public class ServicoDTO {

    @Data
    public static class Request {
        @NotBlank
        private String nome;
        private String descricao;
        @NotNull @Positive
        private Double preco;
        @NotNull @Positive
        private Integer duracaoMinutos;
    }

    @Data
    @lombok.AllArgsConstructor
    public static class Response {
        private Long id;
        private String nome;
        private String descricao;
        private Double preco;
        private Integer duracaoMinutos;
    }
}
