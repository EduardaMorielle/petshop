package com.petshop.api.controller;

import com.petshop.api.model.Usuario;
import com.petshop.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Map<String, Object>> listar() {
        return usuarioRepository.findAll().stream()
                .map(u -> Map.of("id", u.getId(), "nome", u.getNome(),
                        "email", u.getEmail(), "perfil", u.getPerfil().name()))
                .collect(Collectors.toList());
    }
}
