package com.petshop.api.service;

import com.petshop.api.dto.ServicoDTO;
import com.petshop.api.model.Servico;
import com.petshop.api.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ServicoService {

    private final ServicoRepository servicoRepository;

    public Page<ServicoDTO.Response> listar(Pageable pageable) {
        return servicoRepository.findAll(pageable).map(this::toResponse);
    }

    public ServicoDTO.Response buscar(Long id) {
        return toResponse(servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado")));
    }

    public ServicoDTO.Response criar(ServicoDTO.Request dto) {
        if (servicoRepository.existsByNome(dto.getNome()))
            throw new RuntimeException("Serviço já cadastrado com esse nome");
        Servico s = Servico.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .preco(dto.getPreco())
                .duracaoMinutos(dto.getDuracaoMinutos())
                .build();
        return toResponse(servicoRepository.save(s));
    }

    public ServicoDTO.Response atualizar(Long id, ServicoDTO.Request dto) {
        Servico s = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        s.setNome(dto.getNome());
        s.setDescricao(dto.getDescricao());
        s.setPreco(dto.getPreco());
        s.setDuracaoMinutos(dto.getDuracaoMinutos());
        return toResponse(servicoRepository.save(s));
    }

    public void deletar(Long id) {
        if (!servicoRepository.existsById(id)) throw new RuntimeException("Serviço não encontrado");
        servicoRepository.deleteById(id);
    }

    private ServicoDTO.Response toResponse(Servico s) {
        return new ServicoDTO.Response(s.getId(), s.getNome(), s.getDescricao(),
                s.getPreco(), s.getDuracaoMinutos());
    }
}
