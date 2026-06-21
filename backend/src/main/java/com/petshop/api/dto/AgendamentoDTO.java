package com.petshop.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

public class AgendamentoDTO {

    @Data
    public static class Request {
        @NotNull
        private Long petId;
        @NotNull
        private Long servicoId;
        @NotNull
        private LocalDate data;
        @NotNull
        private LocalTime hora;
        private String observacoes;
    }

    @Data
    @lombok.AllArgsConstructor
    public static class Response {
        private Long id;
        private String petNome;
        private String servicoNome;
        private Double preco;
        private LocalDate data;
        private LocalTime hora;
        private String status;
        private String observacoes;
    }
}
