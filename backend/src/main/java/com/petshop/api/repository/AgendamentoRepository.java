package com.petshop.api.repository;

// ============================================================
// ARQUIVO: AgendamentoRepository.java
// CAMADA: Repository (Acesso a dados)
// O QUE É: Interface de acesso ao banco para a entidade Agendamento.
// ============================================================

import com.petshop.api.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // Listagem paginada — todos os agendamentos (visão do ADMIN)
    Page<Agendamento> findAll(Pageable pageable);

    // Busca agendamentos filtrando pelo ID do tutor do pet.
    // Nota: "PetTutorId" navega pelo relacionamento:
    //   Agendamento → Pet → Usuario (tutor) → id
    // Spring traduz para um JOIN:
    //   SELECT a.* FROM agendamentos a
    //   JOIN pets p ON a.pet_id = p.id
    //   WHERE p.tutor_id = ?
    // Usado para que um cliente veja apenas seus próprios agendamentos.
    Page<Agendamento> findByPetTutorId(Long tutorId, Pageable pageable);
}
