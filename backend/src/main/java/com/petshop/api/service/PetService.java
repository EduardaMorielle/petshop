package com.petshop.api.service;

import com.petshop.api.dto.PetDTO;
import com.petshop.api.model.Pet;
import com.petshop.api.model.Usuario;
import com.petshop.api.repository.PetRepository;
import com.petshop.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UsuarioRepository usuarioRepository;

    public Page<PetDTO.Response> listar(Pageable pageable) {
        return petRepository.findAll(pageable).map(this::toResponse);
    }

    public PetDTO.Response buscar(Long id) {
        return toResponse(petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado")));
    }

    public PetDTO.Response criar(PetDTO.Request dto) {
        Usuario tutor = usuarioRepository.findById(dto.getTutorId())
                .orElseThrow(() -> new RuntimeException("Tutor não encontrado"));
        Pet pet = Pet.builder()
                .nome(dto.getNome())
                .especie(dto.getEspecie())
                .raca(dto.getRaca())
                .idade(dto.getIdade())
                .tutor(tutor)
                .build();
        return toResponse(petRepository.save(pet));
    }

    public PetDTO.Response atualizar(Long id, PetDTO.Request dto) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        Usuario tutor = usuarioRepository.findById(dto.getTutorId())
                .orElseThrow(() -> new RuntimeException("Tutor não encontrado"));
        pet.setNome(dto.getNome());
        pet.setEspecie(dto.getEspecie());
        pet.setRaca(dto.getRaca());
        pet.setIdade(dto.getIdade());
        pet.setTutor(tutor);
        return toResponse(petRepository.save(pet));
    }

    public void deletar(Long id) {
        if (!petRepository.existsById(id)) throw new RuntimeException("Pet não encontrado");
        petRepository.deleteById(id);
    }

    private PetDTO.Response toResponse(Pet p) {
        return new PetDTO.Response(p.getId(), p.getNome(), p.getEspecie(),
                p.getRaca(), p.getIdade(), p.getTutor().getId(), p.getTutor().getNome());
    }
}
