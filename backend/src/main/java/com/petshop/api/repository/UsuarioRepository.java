package com.petshop.api.repository;

// ============================================================
// ARQUIVO: UsuarioRepository.java
// CAMADA: Repository (Acesso a dados)
// O QUE É: Interface que fornece acesso ao banco de dados
//          para a entidade Usuario.
//
// COMO FUNCIONA:
//   Ao estender JpaRepository<Usuario, Long>, o Spring Data JPA
//   gera automaticamente a implementação desta interface em tempo
//   de execução. Você NÃO precisa escrever SQL nem implementar
//   nenhum método — o Spring faz isso por você.
//
//   JpaRepository<T, ID> já fornece pronto:
//     - save(entity)         → INSERT ou UPDATE
//     - findById(id)         → SELECT by PK
//     - findAll()            → SELECT *
//     - findAll(pageable)    → SELECT com paginação
//     - deleteById(id)       → DELETE by PK
//     - count()              → SELECT COUNT(*)
//     - existsById(id)       → SELECT EXISTS
//
//   Os métodos adicionais abaixo são gerados pelo Spring
//   baseando-se no NOME do método (Query by Method Name).
//   O Spring analisa o nome e monta o SQL automaticamente.
// ============================================================

import com.petshop.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Spring traduz para: SELECT * FROM usuarios WHERE email = ?
    // Retorna Optional<Usuario> — pode ser vazio se não encontrar.
    // Usado no login (AuthService) e no filtro JWT (JwtFilter).
    Optional<Usuario> findByEmail(String email);

    // Spring traduz para: SELECT EXISTS(SELECT 1 FROM usuarios WHERE email = ?)
    // Usado no registro para evitar emails duplicados.
    boolean existsByEmail(String email);
}
