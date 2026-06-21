package com.petshop.api.model;

// ============================================================
// ARQUIVO: Servico.java
// CAMADA: Model (Entidade)
// O QUE É: Representa um serviço oferecido pelo petshop,
//          como banho, tosa, consulta, etc.
//          Mapeado para a tabela "servicos" no banco.
//
// QUEM PODE GERENCIAR:
//   Apenas usuários com perfil ADMIN podem criar, editar
//   e excluir serviços. Essa regra é aplicada no SecurityConfig.java.
//   Qualquer usuário autenticado pode listar/visualizar serviços.
// ============================================================

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "servicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // unique=true: dois serviços não podem ter o mesmo nome
    // (ex: não pode ter dois "Banho" no catálogo)
    @Column(nullable = false, unique = true)
    private String nome;

    // Descrição detalhada do serviço — opcional
    private String descricao;

    // Preço em reais — obrigatório e deve ser positivo
    // (validado no ServicoDTO.Request com @Positive)
    @Column(nullable = false)
    private Double preco;

    // Duração estimada em minutos — obrigatório e deve ser > 0
    // Útil para o petshop planejar a agenda do dia
    @Column(nullable = false)
    private Integer duracaoMinutos;
}
