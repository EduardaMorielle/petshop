package com.petshop.api.repository;

// ============================================================
// ARQUIVO: PetRepository.java
// CAMADA: Repository (Acesso a dados)
// O QUE É: Interface de acesso ao banco para a entidade Pet.
//
// PAGINAÇÃO:
//   Os métodos que recebem Pageable retornam Page<T>, que contém:
//     - content: lista de itens da página atual
//     - totalElements: total de registros no banco
//     - totalPages: total de páginas
//     - number: número da página atual (começa em 0)
//   Esses dados são usados pelo MatPaginator no Angular.
// ============================================================

import com.petshop.api.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {

    // Listagem paginada — todos os pets
    // O Spring Data JPA já fornece findAll(Pageable) no JpaRepository,
    // mas declaramos explicitamente para deixar o código mais claro.
    Page<Pet> findAll(Pageable pageable);

    // Busca todos os pets de um determinado tutor (por ID do tutor)
    // Spring traduz para: SELECT * FROM pets WHERE tutor_id = ?
    // Usado quando um cliente logado quer ver apenas seus pets.
    List<Pet> findByTutorId(Long tutorId);
}
