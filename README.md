# 🐾 PetShop Care — Sistema de Gerenciamento

Projeto final da disciplina de Desenvolvimento de Sistemas Web — CESIT/UEA.

**Discente:** Eduarda Gabrielle Moraes dos Santos  
**Instituição:** UEA — CESIT

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Back-end | Spring Boot 3.2, Spring Security, JPA/Hibernate |
| Banco de dados | MySQL 8 |
| Autenticação | JWT (jjwt 0.12) — token expira em 24h |
| Front-end | Angular 17 Standalone, Angular Material |
| Implantação | Docker + Docker Compose |

---

## Como executar

### Cenário 1 — Sua máquina local (Docker)

Nenhuma alteração necessária. Basta rodar:

```bash
docker-compose up --build
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:24743 |
| API | http://localhost:28743/api |
| MySQL | localhost:3306 — banco: `petshopdb` |

---

### Cenário 2 — Servidor da UEA (172.25.1.60 via SSH)

O Angular precisa saber o IP do servidor para chamar a API. Edite **uma linha** no `docker-compose.yml`:

```yaml
# docker-compose.yml → serviço frontend → build → args
API_URL: http://172.25.1.60:28743/api    # ← troque por este valor
```

Depois suba normalmente:

```bash
# conectar no servidor
ssh <nomealuno>@172.25.1.60

# clonar / atualizar o projeto
cd ~/petshop
git pull

# subir os containers
docker-compose up --build -d
```

| Serviço | URL |
|---------|-----|
| Frontend | http://172.25.1.60:24743 |
| API | http://172.25.1.60:28743/api |

> **Por que isso é necessário?** O Angular é compilado em arquivos estáticos (HTML/CSS/JS). A URL da API fica gravada no JavaScript no momento do build — não dá para mudar em runtime. O Dockerfile usa `sed` para substituir a URL antes de compilar, com base no `API_URL` passado pelo `docker-compose.yml`.

---

### Cenário 3 — Local sem Docker (desenvolvimento)

**1. Backend:**
```bash
# Edite application.properties: troque "db" por "localhost" na URL
# spring.datasource.url=jdbc:mysql://localhost:3306/petshopdb?...

cd backend
mvn spring-boot:run
# API disponível em: http://localhost:8743/api
```

**2. Frontend:**
```bash
cd frontend
# Edite src/environments/environment.ts:
# apiUrl: 'http://localhost:8743/api'

npm install
npm start
# Frontend disponível em: http://localhost:4200
```

---

## Credenciais de teste

Criadas automaticamente pelo `DataInitializer` ao subir pela primeira vez:

| Perfil | Email | Senha | O que pode fazer |
|--------|-------|-------|-----------------|
| **ADMIN** | `admin@petshop.com` | `admin123` | Tudo: criar/editar/excluir serviços, pets, agendamentos |
| **CLIENTE** | `cliente@petshop.com` | `cliente123` | Pets e agendamentos (somente visualiza serviços) |

> Não existe ativação de conta — o cadastro já cria o usuário ativo imediatamente.

---

## Endpoints da API

### Públicos (sem autenticação)

| Método | Endpoint | Corpo da requisição |
|--------|----------|-------------------|
| POST | `/api/auth/login` | `{ "email": "...", "senha": "..." }` |
| POST | `/api/auth/registrar` | `{ "nome": "...", "email": "...", "senha": "...", "perfil": "CLIENTE" }` |

**Resposta do login:**
```json
{ "token": "eyJhbGci...", "nome": "Administrador", "perfil": "ADMIN" }
```

### Protegidos (header `Authorization: Bearer <token>`)

| Recurso | GET (listar/buscar) | POST (criar) | PUT (editar) | DELETE |
|---------|-------------------|-------------|-------------|--------|
| `/api/usuarios` | ✅ Autenticado | — | — | — |
| `/api/pets` | ✅ Autenticado | ✅ Autenticado | ✅ Autenticado | ✅ Autenticado |
| `/api/servicos` | ✅ Autenticado | 🔒 Só ADMIN | 🔒 Só ADMIN | 🔒 Só ADMIN |
| `/api/agendamentos` | ✅ Autenticado | ✅ Autenticado | ✅ Autenticado | ✅ Autenticado |

---

## Testes rápidos via cURL

Substitua `<HOST>` por `localhost` (local) ou `172.25.1.60` (servidor UEA).

**Login como admin:**
```bash
curl -X POST http://<HOST>:28743/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@petshop.com","senha":"admin123"}'
```

**Login como cliente:**
```bash
curl -X POST http://<HOST>:28743/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@petshop.com","senha":"cliente123"}'
```

**Listar serviços (com token):**
```bash
curl http://<HOST>:28743/api/servicos \
  -H "Authorization: Bearer <TOKEN>"
```

**Criar serviço (somente admin):**
```bash
curl -X POST http://<HOST>:28743/api/servicos \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Consulta","descricao":"Avaliação geral","preco":120.0,"duracaoMinutos":30}'
```

**Tentar criar serviço como cliente (deve retornar 403):**
```bash
curl -X POST http://<HOST>:28743/api/servicos \
  -H "Authorization: Bearer <TOKEN_CLIENTE>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","descricao":"...","preco":10.0,"duracaoMinutos":10}'
```

**Criar pet:**
```bash
curl -X POST http://<HOST>:28743/api/pets \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Rex","especie":"CÃO","raca":"Labrador","idade":3,"tutorId":1}'
```

**Criar agendamento:**
```bash
curl -X POST http://<HOST>:28743/api/agendamentos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"petId":1,"servicoId":1,"data":"2026-07-15","hora":"10:00","status":"AGENDADO"}'
```

---

## Comandos úteis Docker

```bash
# Subir (com rebuild)
docker-compose up --build

# Subir em background
docker-compose up --build -d

# Ver logs em tempo real
docker-compose logs -f

# Ver logs só da API
docker-compose logs -f api

# Ver status dos containers
docker-compose ps

# Parar tudo (mantém dados do banco)
docker-compose down

# Parar tudo e apagar dados do banco
docker-compose down -v

# Acessar MySQL diretamente
docker exec -it petshop-db mysql -u petshop -ppetshop123 petshopdb
```

---

## Estrutura do projeto

```
petshop/
├── backend/                        # Spring Boot 3.2 + Java 21
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/petshop/api/
│       ├── controller/             # Auth, Pet, Servico, Agendamento, Usuario
│       ├── dto/                    # AuthDTO, PetDTO, ServicoDTO, AgendamentoDTO
│       ├── model/                  # Usuario, Pet, Servico, Agendamento
│       ├── repository/             # Spring Data JPA
│       ├── security/               # JwtUtil, JwtFilter, SecurityConfig
│       ├── service/                # AuthService, lógica de negócio
│       └── DataInitializer.java    # Seed: admin + cliente + 3 serviços
├── frontend/                       # Angular 17 Standalone + Material
│   ├── Dockerfile                  # Build com ARG API_URL para trocar ambiente
│   ├── nginx.conf                  # SPA routing (try_files)
│   └── src/app/
│       ├── core/guards/            # authGuard
│       ├── core/interceptors/      # authInterceptor, errorInterceptor
│       ├── core/services/          # AuthService, PetService, etc.
│       ├── pages/                  # login, dashboard, pets, servicos, agendamentos
│       └── shared/components/      # LayoutComponent (sidenav + toolbar)
├── docker-compose.yml              # ← edite API_URL aqui para trocar ambiente
└── README.md
```

---

## Roteiro de apresentação

1. Problema e solução proposta
2. Arquitetura: Angular → API REST → MySQL, tudo em Docker
3. Login com ADMIN e CLIENTE — rotas protegidas pelo authGuard
4. CRUD de pets e agendamentos
5. Restrição de serviços: CLIENTE recebe 403 ao tentar criar/editar
6. Explicação do JWT: geração, interceptor, JwtFilter, expiração em 24h
7. Implantação no servidor da UEA via SSH + docker-compose
