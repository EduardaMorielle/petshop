package com.petshop.api.model;

// ============================================================
// ARQUIVO: Pet.java
// CAMADA: Model (Entidade)
// O QUE É: Representa um animal de estimação cadastrado no sistema.
//          Mapeado para a tabela "pets" no banco de dados.
//
// RELACIONAMENTO:
//   Cada pet pertence a exatamente um tutor (usuário).
//   Um tutor pode ter vários pets.
//   Isso é um relacionamento MUITOS-PARA-UM (N:1) com Usuario.
//
//   No banco, a tabela "pets" terá uma coluna "tutor_id" que
//   referencia o "id" da tabela "usuarios" (chave estrangeira).
// ============================================================

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nome do animal — campo obrigatório
    @Column(nullable = false)
    private String nome;

    // Espécie do animal (ex: CÃO, GATO, AVE, ROEDOR, OUTROS)
    // Guardamos como texto livre para maior flexibilidade.
    @Column(nullable = false)
    private String especie;

    // Raça é opcional — alguns clientes não sabem a raça do animal
    private String raca;

    // Idade em anos — opcional (animal pode ter idade desconhecida)
    private Integer idade;

    // --------------------------------------------------------
    // RELACIONAMENTO com Usuario (tutor/dono do pet)
    //
    // @ManyToOne: vários pets podem ter o mesmo tutor
    // @JoinColumn: define o nome da coluna de chave estrangeira
    //              na tabela "pets" que aponta para "usuarios.id"
    // nullable=false: todo pet DEVE ter um tutor
    // --------------------------------------------------------
    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private Usuario tutor;
}
