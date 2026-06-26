// ============================================================
// ARQUIVO: environment.ts
// O QUE É: Configuração da URL base da API.
//
// ⚠️ NÃO MUDE A URL DIRETAMENTE AQUI PARA TROCAR DE AMBIENTE.
//
// Esta URL é substituída automaticamente pelo Dockerfile do frontend
// durante o build Docker, usando a variável API_URL do docker-compose.yml.
//
// Para trocar de ambiente, edite APENAS o docker-compose.yml:
//
//   Localmente (sua máquina):
//     API_URL: http://localhost:28743/api
//
//   Servidor da UEA (172.25.1.60):
//     API_URL: http://172.25.1.60:28743/api
//
// O Dockerfile faz:  sed -i "s|http://localhost:28743/api|${API_URL}|g" environment.ts
// ============================================================

export const environment = {
  production: true,
  apiUrl: 'http://localhost:28743/api'
};
