package com.petshop.api;

// ============================================================
// ARQUIVO: PetshopApplication.java
// O QUE É: Ponto de entrada da aplicação Spring Boot.
//          É a primeira classe executada quando você roda o projeto.
//
// COMO FUNCIONA:
//   1. O método main() chama SpringApplication.run()
//   2. O Spring inicializa o contexto (IoC Container)
//   3. Todas as classes anotadas com @Component, @Service,
//      @Repository, @RestController são detectadas e instanciadas
//   4. O servidor Tomcat embutido sobe na porta 8743
//   5. O DataInitializer.java é executado (cria dados iniciais)
//
// O QUE FAZER: Não mexa nesta classe. Ela não precisa de
// alterações para o projeto funcionar.
// ============================================================

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication é uma anotação composta que equivale a:
//   @Configuration       → esta classe é uma fonte de beans Spring
//   @EnableAutoConfiguration → ativa configurações automáticas
//   @ComponentScan       → escaneia todos os pacotes abaixo de com.petshop.api
@SpringBootApplication
public class PetshopApplication {

    public static void main(String[] args) {
        // Inicia toda a aplicação Spring Boot
        SpringApplication.run(PetshopApplication.class, args);
    }
}
