package com.petshop.api.model;

// ============================================================
// ARQUIVO: Agendamento.java
// CAMADA: Model (Entidade)
// O QUE É: Representa um agendamento de serviço para um pet.
//          É a entidade central do sistema — conecta Pet e Servico.
//          Mapeado para a tabela "agendamentos" no banco.
//
// RELACIONAMENTOS:
//   - Agendamento → Pet     (N:1) — um pet pode ter vários agendamentos
//   - Agendamento → Servico (N:1) — um serviço pode estar em vários agendamentos
//
// CICLO DE VIDA DO STATUS:
//   AGENDADO → (cliente chegou) → AGUARDANDO → (em atendimento) →
//   CONCLUIDO  ou  CANCELADO
//   O status pode ser alterado pelo front-end via PUT /api/agendamentos/{id}
// ============================================================

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "agendamentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --------------------------------------------------------
    // Relacionamento com Pet
    // @ManyToOne: vários agendamentos podem ser do mesmo pet
    // --------------------------------------------------------
    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    // --------------------------------------------------------
    // Relacionamento com Servico
    // @ManyToOne: vários agendamentos podem ser do mesmo serviço
    // --------------------------------------------------------
    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    // Data do agendamento — apenas a data (sem hora)
    // LocalDate é o tipo Java para datas sem fuso (ex: 2025-06-20)
    @Column(nullable = false)
    private LocalDate data;

    // Hora do agendamento — apenas o horário (sem data)
    // LocalTime é o tipo Java para horários (ex: 14:30)
    @Column(nullable = false)
    private LocalTime hora;

    // Status atual do agendamento.
    // @Enumerated(STRING): salva como texto ("AGENDADO") em vez de número
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    // Campo livre para observações adicionais — opcional
    private String observacoes;

    // Enum com os estados possíveis de um agendamento
    public enum Status {
        AGENDADO,   // acabou de ser criado
        CONCLUIDO,  // serviço foi realizado
        CANCELADO   // cancelado pelo cliente ou pelo petshop
    }
}
