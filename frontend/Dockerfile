# ============================================================
# ARQUIVO: frontend/Dockerfile
# O QUE É: Instruções para criar a imagem Docker do front-end Angular.
#
# ESTRATÉGIA MULTI-STAGE BUILD:
#   ESTÁGIO 1 (build): Node.js instala dependências e compila o Angular.
#   ESTÁGIO 2 (runtime): Nginx serve os arquivos estáticos compilados.
#
# VARIÁVEL API_URL:
#   O Angular "bake" a URL da API no momento do build (não em runtime).
#   Por isso usamos um ARG do Docker para injetar o IP correto:
#     - localhost:28743  → para rodar na sua máquina local
#     - 172.25.1.60:28743 → para rodar no servidor da UEA
#
#   O docker-compose.yml passa o valor via args > API_URL.
#   Se não informado, o padrão é localhost:28743.
# ============================================================

# --------------------------------------------------------
# ESTÁGIO 1: Build Angular
# --------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# ARG: recebe o IP/host da API passado pelo docker-compose.
# Padrão: localhost (para rodar local). No servidor UEA: 172.25.1.60
ARG API_URL=http://localhost:28743/api

# Copia dependências e instala (camada de cache do Docker)
COPY package*.json ./
RUN npm install --include=dev

# Copia o código-fonte
COPY . .

# Sobrescreve o environment.ts com a URL correta ANTES do build.
# sed substitui o placeholder pela variável injetada pelo Docker.
RUN sed -i "s|http://localhost:28743/api|${API_URL}|g" src/environments/environment.ts

# Compila para produção
RUN npm run build

# --------------------------------------------------------
# ESTÁGIO 2: Servir com Nginx
# --------------------------------------------------------
FROM nginx:alpine

# Copia os arquivos compilados para o Nginx
COPY --from=build /app/dist/petshop-frontend/browser /usr/share/nginx/html

# Configuração do Nginx (SPA routing com try_files)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4743
