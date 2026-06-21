package com.petshop.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class PetDTO {

    @Data
    public static class Request {
        @NotBlank
        private String nome;
        @NotBlank
        private String especie;
        private String raca;
        private Integer idade;
        @NotNull
        private Long tutorId;
    }

    @Data
    @lombok.AllArgsConstructor
    public static class Response {
        private Long id;
        private String nome;
        private String especie;
        private String raca;
        private Integer idade;
        private Long tutorId;
        private String tutorNome;
    }
}
