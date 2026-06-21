// ============================================================
// ARQUIVO: models.ts
// CAMADA: Core / Models
// O QUE É: Interfaces TypeScript que definem o formato dos dados
//          trocados entre o front-end e a API.
//
// POR QUE USAR INTERFACES?
//   TypeScript é uma linguagem fortemente tipada.
//   Ao definir interfaces, o compilador garante que:
//     - Você não acesse campos que não existem
//     - Você não esqueça campos obrigatórios
//     - O autocomplete do editor funcione corretamente
//
// RELAÇÃO COM OS DTOs DO BACK-END:
//   Cada interface aqui espelha um DTO do back-end:
//     Pet (TS)          ←→  PetDTO.Response (Java)
//     Agendamento (TS)  ←→  AgendamentoDTO.Response (Java)
//   Se você alterar um DTO no back-end, precisa atualizar aqui também.
// ============================================================

/** Dados enviados para POST /api/auth/login */
export interface LoginRequest {
  email: string;
  senha: string;
}

/** Dados recebidos após login bem-sucedido */
export interface TokenResponse {
  token: string;   // token JWT para usar nas requisições
  nome: string;    // nome do usuário para exibir na interface
  perfil: string;  // "ADMIN" ou "CLIENTE"
}

/**
 * Representa um Pet.
 * id? (opcional): não existe ainda quando estamos criando um novo pet
 * tutorNome? (opcional): só vem na resposta (Response), não é enviado na criação
 */
export interface Pet {
  id?: number;
  nome: string;
  especie: string;  // ex: "CÃO", "GATO", "AVE", "ROEDOR", "OUTROS"
  raca?: string;
  idade?: number;
  tutorId: number;   // ID do usuário dono do pet
  tutorNome?: string; // nome do tutor (só vem na resposta da API)
}

/** Representa um Serviço do petshop */
export interface Servico {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  duracaoMinutos: number;
}

/**
 * Representa um Agendamento.
 * Tem campos tanto para envio (petId, servicoId) quanto
 * para exibição (petNome, servicoNome, preco).
 */
export interface Agendamento {
  id?: number;
  petId?: number;       // enviado na criação/edição
  servicoId?: number;   // enviado na criação/edição
  petNome?: string;     // recebido na listagem
  servicoNome?: string; // recebido na listagem
  preco?: number;       // recebido na listagem
  data: string;         // formato ISO: "2025-06-20"
  hora: string;         // formato: "14:30"
  status?: string;      // "AGENDADO", "CONCLUIDO" ou "CANCELADO"
  observacoes?: string;
}

/**
 * Estrutura da resposta paginada do Spring Data JPA.
 * Usada em todas as listagens com MatPaginator.
 *
 * T é um tipo genérico — pode ser Pet, Servico, Agendamento, etc.
 * Ex: PageResponse<Pet> representa uma página de pets.
 */
export interface PageResponse<T> {
  content: T[];        // lista de itens na página atual
  totalElements: number; // total de registros no banco (para o paginador)
  totalPages: number;  // total de páginas
  size: number;        // itens por página
  number: number;      // número da página atual (começa em 0)
}

/** Representa um Usuário (usado para listar tutores no formulário de pet) */
export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  perfil: string;
}
