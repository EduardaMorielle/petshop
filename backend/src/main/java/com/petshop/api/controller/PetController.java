package com.petshop.api.controller;

import com.petshop.api.dto.PetDTO;
import com.petshop.api.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping
    public Page<PetDTO.Response> listar(Pageable pageable) {
        return petService.listar(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetDTO.Response> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(petService.buscar(id));
    }

    @PostMapping
    public ResponseEntity<PetDTO.Response> criar(@Valid @RequestBody PetDTO.Request dto) {
        return ResponseEntity.status(201).body(petService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetDTO.Response> atualizar(@PathVariable Long id,
                                                      @Valid @RequestBody PetDTO.Request dto) {
        return ResponseEntity.ok(petService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        petService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
