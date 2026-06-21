package com.petshop.api.service;

// ============================================================
// ARQUIVO: AuthService.java
// CAMADA: Service (Lógica de negócio)
// O QUE É: Contém a lógica de autenticação e registro de usuários.
//          É chamado pelo AuthController.
//
// RESPONSABILIDADES:
//   - login(): valida email/senha e retorna um token JWT
//   - registrar(): cria um novo usuário com senha criptografada
//
// FLUXO DO LOGIN:
//   1. Busca o usuário pelo email no banco
//   2. Compara a senha fornecida com o hash salvo (BCrypt)
//   3. Se correto, gera um token JWT com email e perfil
//   4. Retorna o token + dados básicos do usuário
// ============================================================

import com.petshop.api.dto.AuthDTO;
import com.petshop.api.model.Usuario;
import com.petshop.api.repository.UsuarioRepository;
import com.petshop.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// @Service: registra esta classe como um bean de serviço no Spring.
// Semanticamente indica que contém lógica de negócio.
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Autentica o usuário e retorna um token JWT.
     *
     * ⚠️ SEGURANÇA: A mensagem de erro é genérica ("Credenciais inválidas")
     * tanto para email não encontrado quanto para senha errada.
     * Isso é intencional — mensagens específicas como "Email não cadastrado"
     * ajudariam atacantes a descobrir quais emails existem no sistema.
     */
    public AuthDTO.TokenResponse login(AuthDTO.LoginRequest dto) {

        // Busca o usuário pelo email. orElseThrow lança exceção se não encontrar.
        // A exceção é capturada pelo GlobalExceptionHandler e retorna HTTP 400.
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        // passwordEncoder.matches() compara a senha fornecida (texto puro)
        // com o hash BCrypt salvo no banco. NÃO é comparação direta de strings.
        if (!passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        // Gera o token JWT com email e perfil do usuário
        String token = jwtUtil.gerar(usuario.getEmail(), usuario.getPerfil().name());

        // Retorna token + dados para o Angular
        return new AuthDTO.TokenResponse(token, usuario.getNome(), usuario.getPerfil().name());
    }

    /**
     * Registra um novo usuário no sistema.
     * Valida se o email já está cadastrado antes de criar.
     */
    public void registrar(AuthDTO.RegisterRequest dto) {

        // Verificação de email duplicado
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        // Define o perfil: ADMIN somente se explicitamente informado,
        // caso contrário sempre CLIENTE (mais seguro por padrão)
        Usuario.Perfil perfil = dto.getPerfil() != null && dto.getPerfil().equals("ADMIN")
                ? Usuario.Perfil.ADMIN
                : Usuario.Perfil.CLIENTE;

        // Cria o usuário com a senha criptografada
        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                // encode() aplica o hash BCrypt — NUNCA salve senha em texto puro
                .senha(passwordEncoder.encode(dto.getSenha()))
                .perfil(perfil)
                .build();

        usuarioRepository.save(usuario);
    }
}
