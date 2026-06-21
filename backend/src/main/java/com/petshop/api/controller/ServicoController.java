package com.petshop.api.controller;

import com.petshop.api.dto.ServicoDTO;
import com.petshop.api.service.ServicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/servicos")
@RequiredArgsConstructor
public class ServicoController {

    private final ServicoService servicoService;

    @GetMapping
    public Page<ServicoDTO.Response> listar(Pageable pageable) {
        return servicoService.listar(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicoDTO.Response> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(servicoService.buscar(id));
    }

    @PostMapping
    public ResponseEntity<ServicoDTO.Response> criar(@Valid @RequestBody ServicoDTO.Request dto) {
        return ResponseEntity.status(201).body(servicoService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServicoDTO.Response> atualizar(@PathVariable Long id,
                                                          @Valid @RequestBody ServicoDTO.Request dto) {
        return ResponseEntity.ok(servicoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        servicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
