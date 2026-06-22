// ============================================================
// ARQUIVO: environment.ts
// O QUE É: Arquivo de configuração de ambiente.
//          Define variáveis que mudam dependendo do ambiente
//          (desenvolvimento local vs produção no servidor UEA).
//
// COMO FUNCIONA:
//   Os services importam environment.apiUrl para montar a URL
//   das requisições. Assim, se a URL mudar, só precisa alterar aqui.
//
// ⚠️ IMPORTANTE PARA DESENVOLVIMENTO LOCAL:
//   Se quiser testar no computador sem Docker, mude apiUrl para:
//   apiUrl: 'http://localhost:8743/api'
//
//   Para o servidor da UEA, mantenha com o IP 172.25.1.60.
// ============================================================

export const environment = {
  production: true,

  // URL base da API REST quando o backend está rodando localmente via Docker
  // A porta 28743 é a porta publicada pelo docker-compose para a API
  apiUrl: 'http://localhost:28743/api'
};
