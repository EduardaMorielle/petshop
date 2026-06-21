package com.petshop.api.service;

import com.petshop.api.dto.AgendamentoDTO;
import com.petshop.api.model.Agendamento;
import com.petshop.api.model.Pet;
import com.petshop.api.model.Servico;
import com.petshop.api.repository.AgendamentoRepository;
import com.petshop.api.repository.PetRepository;
import com.petshop.api.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final PetRepository petRepository;
    private final ServicoRepository servicoRepository;

    public Page<AgendamentoDTO.Response> listar(Pageable pageable) {
        return agendamentoRepository.findAll(pageable).map(this::toResponse);
    }

    public AgendamentoDTO.Response buscar(Long id) {
        return toResponse(agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado")));
    }

    public AgendamentoDTO.Response criar(AgendamentoDTO.Request dto) {
        Pet pet = petRepository.findById(dto.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        Servico servico = servicoRepository.findById(dto.getServicoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        Agendamento a = Agendamento.builder()
                .pet(pet)
                .servico(servico)
                .data(dto.getData())
                .hora(dto.getHora())
                .status(Agendamento.Status.AGENDADO)
                .observacoes(dto.getObservacoes())
                .build();
        return toResponse(agendamentoRepository.save(a));
    }

    public AgendamentoDTO.Response atualizar(Long id, AgendamentoDTO.Request dto) {
        Agendamento a = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        Pet pet = petRepository.findById(dto.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        Servico servico = servicoRepository.findById(dto.getServicoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        a.setPet(pet);
        a.setServico(servico);
        a.setData(dto.getData());
        a.setHora(dto.getHora());
        a.setObservacoes(dto.getObservacoes());
        return toResponse(agendamentoRepository.save(a));
    }

    public void deletar(Long id) {
        if (!agendamentoRepository.existsById(id)) throw new RuntimeException("Agendamento não encontrado");
        agendamentoRepository.deleteById(id);
    }

    private AgendamentoDTO.Response toResponse(Agendamento a) {
        return new AgendamentoDTO.Response(
                a.getId(), a.getPet().getNome(), a.getServico().getNome(),
                a.getServico().getPreco(), a.getData(), a.getHora(),
                a.getStatus().name(), a.getObservacoes());
    }
}
