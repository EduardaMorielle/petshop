# ============================================================
# ARQUIVO: frontend/Dockerfile
# O QUE É: Instruções para criar a imagem Docker do front-end Angular.
#
# ESTRATÉGIA MULTI-STAGE BUILD (mesmo conceito do backend):
#
#   ESTÁGIO 1 (build): usa Node.js para instalar dependências
#   e compilar o Angular em arquivos estáticos (HTML, CSS, JS).
#
#   ESTÁGIO 2 (runtime): usa o Nginx (servidor web leve) para
#   servir os arquivos estáticos compilados. A imagem final
#   não tem Node.js nem node_modules (apenas ~50MB).
#
# POR QUE NGINX?
#   O Angular compilado é apenas HTML, CSS e JavaScript estáticos.
#   O Nginx é um servidor web extremamente eficiente para servir
#   arquivos estáticos. Além disso, precisamos de uma configuração
#   especial (try_files) para que o roteamento do Angular funcione
#   corretamente (definida no nginx.conf).
# ============================================================

# --------------------------------------------------------
# ESTÁGIO 1: Build Angular
# --------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Copia os arquivos de dependências primeiro (cache do Docker)
COPY package*.json ./
# npm install --include=dev: instala as dependências de desenvolvimento
# do Angular mesmo quando o lockfile não está versionado no Git.
RUN npm install --include=dev

# Copia o restante do código e compila para produção
COPY . .
# ng build com configuração de produção:
#   - minifica o código (menor tamanho)
#   - habilita tree-shaking (remove código não usado)
#   - gera hashes nos nomes dos arquivos (cache busting)
RUN npm run build

# --------------------------------------------------------
# ESTÁGIO 2: Servir com Nginx
# --------------------------------------------------------
FROM nginx:alpine

# Copia os arquivos compilados para a pasta padrão do Nginx.
# O Angular 17 gera os arquivos em dist/<nome-projeto>/browser/
COPY --from=build /app/dist/petshop-frontend/browser /usr/share/nginx/html

# Copia a configuração customizada do Nginx
# (necessária para o roteamento SPA funcionar)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Porta onde o Nginx vai escutar
EXPOSE 4743
