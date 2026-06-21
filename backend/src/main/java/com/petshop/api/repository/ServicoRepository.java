package com.petshop.api.repository;

// ============================================================
// ARQUIVO: ServicoRepository.java
// CAMADA: Repository (Acesso a dados)
// O QUE É: Interface de acesso ao banco para a entidade Servico.
// ============================================================

import com.petshop.api.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ServicoRepository extends JpaRepository<Servico, Long> {

    // Listagem paginada de serviços
    Page<Servico> findAll(Pageable pageable);

    // Verifica se já existe um serviço com o mesmo nome.
    // Usado no ServicoService para evitar nomes duplicados.
    // Spring traduz para: SELECT EXISTS(... WHERE nome = ?)
    boolean existsByNome(String nome);
}
