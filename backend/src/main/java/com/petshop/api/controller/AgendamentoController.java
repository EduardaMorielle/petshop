package com.petshop.api.controller;

import com.petshop.api.dto.AgendamentoDTO;
import com.petshop.api.service.AgendamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    @GetMapping
    public Page<AgendamentoDTO.Response> listar(Pageable pageable) {
        return agendamentoService.listar(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoDTO.Response> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(agendamentoService.buscar(id));
    }

    @PostMapping
    public ResponseEntity<AgendamentoDTO.Response> criar(@Valid @RequestBody AgendamentoDTO.Request dto) {
        return ResponseEntity.status(201).body(agendamentoService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendamentoDTO.Response> atualizar(@PathVariable Long id,
                                                              @Valid @RequestBody AgendamentoDTO.Request dto) {
        return ResponseEntity.ok(agendamentoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        agendamentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
