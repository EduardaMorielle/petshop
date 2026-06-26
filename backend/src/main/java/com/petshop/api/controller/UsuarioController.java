package com.petshop.api.controller;

import com.petshop.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Map<String, Object>> listar() {
        List<Map<String, Object>> lista = new ArrayList<>();
        for (var u : usuarioRepository.findAll()) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("nome", u.getNome());
            m.put("email", u.getEmail());
            m.put("perfil", u.getPerfil().name());
            lista.add(m);
        }
        return lista;
    }
}
