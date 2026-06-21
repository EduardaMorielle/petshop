package com.petshop.api;

// ============================================================
// ARQUIVO: DataInitializer.java
// O QUE É: Classe que insere dados iniciais no banco de dados
//          assim que a aplicação sobe, se o banco estiver vazio.
//
// COMO FUNCIONA:
//   - Implementa CommandLineRunner, uma interface do Spring Boot
//     que executa o método run() logo após a aplicação iniciar.
//   - Verifica SE o dado já existe antes de inserir,
//     evitando duplicatas a cada reinicialização.
//
// POR QUE É NECESSÁRIO:
//   - Sem isso, ao subir o sistema pela primeira vez, não haveria
//     nenhum usuário para fazer login, nem serviços para agendar.
//   - Facilita testes e a apresentação do projeto.
//
// O QUE FAZER: Se quiser adicionar mais dados de teste (mais
// serviços, mais usuários), adicione aqui seguindo o mesmo padrão.
// ============================================================

import com.petshop.api.model.Servico;
import com.petshop.api.model.Usuario;
import com.petshop.api.repository.ServicoRepository;
import com.petshop.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// @Component: registra esta classe como um bean Spring gerenciado.
// @RequiredArgsConstructor: Lombok gera construtor com os campos final,
//   que é a forma recomendada de fazer injeção de dependência no Spring
//   (evita usar @Autowired no campo, que dificulta testes).
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    // Repositório para acessar a tabela de usuários
    private final UsuarioRepository usuarioRepository;

    // Repositório para acessar a tabela de serviços
    private final ServicoRepository servicoRepository;

    // PasswordEncoder é o BCrypt configurado no SecurityConfig.
    // NUNCA salve senhas em texto puro no banco — sempre use encode().
    private final PasswordEncoder passwordEncoder;

    // Este método é chamado automaticamente pelo Spring Boot
    // depois que todos os beans são inicializados.
    @Override
    public void run(String... args) {

        // --- CRIA USUÁRIO ADMINISTRADOR ---
        // existsByEmail() evita inserir duplicata se a app reiniciar
        if (!usuarioRepository.existsByEmail("admin@petshop.com")) {
            usuarioRepository.save(
                Usuario.builder()
                    .nome("Administrador")
                    .email("admin@petshop.com")
                    // encode() aplica hash BCrypt na senha antes de salvar
                    .senha(passwordEncoder.encode("admin123"))
                    .perfil(Usuario.Perfil.ADMIN)
                    .build()
            );
        }

        // --- CRIA USUÁRIO CLIENTE DE TESTE ---
        if (!usuarioRepository.existsByEmail("cliente@petshop.com")) {
            usuarioRepository.save(
                Usuario.builder()
                    .nome("Cliente Teste")
                    .email("cliente@petshop.com")
                    .senha(passwordEncoder.encode("cliente123"))
                    .perfil(Usuario.Perfil.CLIENTE)
                    .build()
            );
        }

        // --- CRIA SERVIÇOS INICIAIS ---
        // count() == 0 garante que só insere se a tabela estiver vazia
        if (servicoRepository.count() == 0) {
            servicoRepository.save(Servico.builder()
                .nome("Banho")
                .descricao("Banho completo com shampoo e condicionador")
                .preco(50.0)
                .duracaoMinutos(60)
                .build());

            servicoRepository.save(Servico.builder()
                .nome("Tosa")
                .descricao("Tosa higiênica ou completa")
                .preco(40.0)
                .duracaoMinutos(45)
                .build());

            servicoRepository.save(Servico.builder()
                .nome("Banho e Tosa")
                .descricao("Banho completo + tosa")
                .preco(80.0)
                .duracaoMinutos(90)
                .build());
        }
    }
}
