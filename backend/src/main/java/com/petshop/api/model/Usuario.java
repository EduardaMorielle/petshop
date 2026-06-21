package com.petshop.api.model;

// ============================================================
// ARQUIVO: Usuario.java
// CAMADA: Model (Entidade)
// O QUE É: Representa um usuário do sistema na camada de domínio.
//          Esta classe é mapeada diretamente para a tabela "usuarios"
//          no banco de dados MySQL.
//
// COMO FUNCIONA:
//   O JPA (Hibernate) lê as anotações desta classe e cria/atualiza
//   automaticamente a tabela no banco quando a aplicação sobe
//   (por causa do ddl-auto=update no application.properties).
//
// DECISÃO DE PROJETO:
//   Optamos por ter apenas 2 perfis (ADMIN e CLIENTE) em vez dos
//   3 originais (ADMIN, ATENDENTE, CLIENTE) para simplificar o
//   projeto e garantir que tudo funcione corretamente dentro do
//   prazo. Um sistema simples e funcional vale mais que um grande
//   e incompleto (conforme orientação do professor).
// ============================================================

import jakarta.persistence.*;
import lombok.*;

// @Entity: informa ao JPA que esta classe representa uma tabela no banco
// @Table(name="usuarios"): define o nome da tabela no banco
// @Data: Lombok — gera getters, setters, equals, hashCode e toString
// @NoArgsConstructor: Lombok — gera construtor vazio (obrigatório para o JPA)
// @AllArgsConstructor: Lombok — gera construtor com todos os campos
// @Builder: Lombok — habilita o padrão Builder (ex: Usuario.builder().nome("X").build())
@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    // @Id: marca este campo como chave primária da tabela
    // @GeneratedValue: o banco gera o ID automaticamente (auto incremento)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // nullable=false: campo obrigatório no banco (NOT NULL)
    @Column(nullable = false)
    private String nome;

    // unique=true: não pode haver dois usuários com o mesmo email
    // nullable=false: campo obrigatório
    @Column(nullable = false, unique = true)
    private String email;

    // A senha é SEMPRE armazenada criptografada com BCrypt.
    // Nunca salve senhas em texto puro.
    @Column(nullable = false)
    private String senha;

    // @Enumerated(STRING): salva o nome do enum como texto no banco
    // (ex: "ADMIN" ou "CLIENTE"), em vez de número (0, 1).
    // Isso torna o banco legível e evita bugs se a ordem do enum mudar.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil;

    // Enum interno que define os perfis possíveis do usuário.
    // ADMIN: acesso total, pode criar/editar/excluir serviços
    // CLIENTE: acesso restrito, gerencia seus próprios pets e agendamentos
    public enum Perfil {
        ADMIN, CLIENTE
    }
}
