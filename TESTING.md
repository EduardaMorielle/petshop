# 🧪 Roteiro de Testes — PetShop Care

> Em todos os exemplos abaixo, substitua `<HOST>` pelo endereço correto:
> - **Sua máquina local:** `localhost`
> - **Servidor da UEA:** `172.25.1.60`

---

## Parte 1 — Subindo o sistema

### Local (sua máquina)

Nenhuma alteração necessária. No diretório raiz do projeto:

```bash
docker-compose up --build
```

Aguarde aparecer nos logs: `Started PetshopApplication`

URLs:
- Frontend → http://localhost:24743
- API      → http://localhost:28743/api

---

### Servidor da UEA (172.25.1.60)

**Passo 1 — Editar o docker-compose.yml antes de enviar:**

```yaml
# docker-compose.yml, serviço frontend > build > args
API_URL: http://172.25.1.60:28743/api
```

**Passo 2 — Conectar ao servidor:**

```bash
ssh <nomealuno>@172.25.1.60
```

**Passo 3 — Clonar ou atualizar o repositório:**

```bash
# Primeira vez:
git clone <url-do-repositorio> petshop
cd petshop

# Nas próximas vezes:
cd petshop
git pull
```

**Passo 4 — Subir os containers:**

```bash
docker-compose up --build -d
```

URLs:
- Frontend → http://172.25.1.60:24743
- API      → http://172.25.1.60:28743/api

---

## Parte 2 — Credenciais

Criadas automaticamente ao subir pela primeira vez:

| Perfil | Email | Senha |
|--------|-------|-------|
| **ADMIN** | `admin@petshop.com` | `admin123` |
| **CLIENTE** | `cliente@petshop.com` | `cliente123` |

---

## Parte 3 — Testes pelo frontend

### Teste 1: Login como ADMIN

1. Acesse http://`<HOST>`:24743
2. Você é redirecionado para `/login` automaticamente
3. Preencha:
   - Email: `admin@petshop.com`
   - Senha: `admin123`
4. Clique **Entrar**
5. ✅ Esperado: vai para o Dashboard

---

### Teste 2: Login como CLIENTE

1. Faça logout (botão no menu lateral)
2. Preencha:
   - Email: `cliente@petshop.com`
   - Senha: `cliente123`
3. ✅ Esperado: vai para o Dashboard
4. Vá em **Serviços** — os botões de criar/editar/excluir não devem aparecer

---

### Teste 3: Credenciais erradas

1. Tente logar com `teste@teste.com` / `senhaerrada`
2. ✅ Esperado: snackbar "Email ou senha inválidos"
3. Botão reativado para nova tentativa

---

### Teste 4: Rota protegida sem login

1. Faça logout
2. Tente acessar diretamente: http://`<HOST>`:24743/dashboard
3. ✅ Esperado: redirecionado automaticamente para `/login`

---

### Teste 5: CRUD de Pets

1. Logue como admin ou cliente
2. Menu → **Pets**
3. Criar: clique "Novo Pet", preencha os dados, salve
4. Editar: ícone de lápis na linha do pet
5. Excluir: ícone de lixeira
6. ✅ Esperado: lista atualizada após cada operação

---

### Teste 6: CRUD de Serviços — restrição ADMIN

**Como ADMIN:**
1. Menu → **Serviços**
2. ✅ Botões de criar/editar/excluir visíveis
3. Crie um novo serviço

**Como CLIENTE:**
1. Logue como `cliente@petshop.com`
2. Menu → **Serviços**
3. ✅ Lista visível, mas sem botões de edição

---

### Teste 7: CRUD de Agendamentos

1. Certifique-se de ter ao menos 1 pet e 1 serviço criados
2. Menu → **Agendamentos**
3. Crie um agendamento: escolha pet, serviço, data, hora
4. Edite o status para `CONCLUIDO` ou `CANCELADO`
5. ✅ Esperado: status atualizado na lista

---

## Parte 4 — Testes pela API (cURL)

### 4.1 Login e obtenção do token

```bash
# ADMIN
curl -X POST http://<HOST>:28743/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@petshop.com","senha":"admin123"}'

# CLIENTE
curl -X POST http://<HOST>:28743/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@petshop.com","senha":"cliente123"}'
```

Resposta esperada (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "nome": "Administrador",
  "perfil": "ADMIN"
}
```

Copie o valor de `token` — você vai usar nos próximos passos.

---

### 4.2 Registrar novo usuário

```bash
curl -X POST http://<HOST>:28743/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria","email":"maria@teste.com","senha":"senha123","perfil":"CLIENTE"}'
```

Resposta esperada: `201 Created` (sem corpo)

---

### 4.3 Listar serviços (autenticado)

```bash
curl http://<HOST>:28743/api/servicos \
  -H "Authorization: Bearer <TOKEN>"
```

Resposta esperada: lista com Banho, Tosa e Banho e Tosa (criados pelo DataInitializer).

---

### 4.4 Criar serviço como ADMIN (deve funcionar)

```bash
curl -X POST http://<HOST>:28743/api/servicos \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Consulta Vet","descricao":"Avaliação geral","preco":120.0,"duracaoMinutos":30}'
```

Resposta esperada: `201 Created`

---

### 4.5 Criar serviço como CLIENTE (deve falhar com 403)

```bash
curl -X POST http://<HOST>:28743/api/servicos \
  -H "Authorization: Bearer <TOKEN_CLIENTE>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","descricao":"Teste","preco":10.0,"duracaoMinutos":10}'
```

Resposta esperada: `403 Forbidden`

---

### 4.6 CRUD de Pets

```bash
# Listar
curl http://<HOST>:28743/api/pets \
  -H "Authorization: Bearer <TOKEN>"

# Criar (tutorId=1 é o admin criado pelo DataInitializer)
curl -X POST http://<HOST>:28743/api/pets \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Rex","especie":"CÃO","raca":"Labrador","idade":3,"tutorId":1}'

# Editar (substitua /1 pelo ID real)
curl -X PUT http://<HOST>:28743/api/pets/1 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Rex Jr","especie":"CÃO","raca":"Golden","idade":4,"tutorId":1}'

# Excluir
curl -X DELETE http://<HOST>:28743/api/pets/1 \
  -H "Authorization: Bearer <TOKEN>"
```

---

### 4.7 Criar agendamento

```bash
curl -X POST http://<HOST>:28743/api/agendamentos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"petId":1,"servicoId":1,"data":"2026-07-15","hora":"10:00","status":"AGENDADO","observacoes":"Primeira consulta"}'
```

---

### 4.8 Token inválido (deve retornar 403)

```bash
curl http://<HOST>:28743/api/pets \
  -H "Authorization: Bearer token_invalido_aqui"
```

---

## Parte 5 — Inspecionar o banco (Docker)

```bash
# Entrar no MySQL dentro do container
docker exec -it petshop-db mysql -u petshop -ppetshop123 petshopdb

# Listar usuários
SELECT id, nome, email, perfil FROM usuarios;

# Listar serviços
SELECT * FROM servicos;

# Listar agendamentos com nomes
SELECT a.id, p.nome AS pet, s.nome AS servico, a.data, a.hora, a.status
FROM agendamentos a
JOIN pets p ON a.pet_id = p.id
JOIN servicos s ON a.servico_id = s.id;

# Sair
exit
```

---

## Parte 6 — Tabela de permissões

| Ação | ADMIN | CLIENTE | Sem login |
|------|:-----:|:-------:|:---------:|
| Login / Registro | ✅ | ✅ | ✅ |
| Ver Dashboard | ✅ | ✅ | ❌ → /login |
| CRUD de Pets | ✅ | ✅ | ❌ |
| Ver Serviços | ✅ | ✅ | ❌ |
| Criar/Editar/Excluir Serviços | ✅ | ❌ 403 | ❌ |
| CRUD de Agendamentos | ✅ | ✅ | ❌ |
| Listar Usuários | ✅ | ✅ | ❌ |

---

## Parte 7 — Problemas comuns

| Sintoma | Causa provável | Solução |
|---------|---------------|---------|
| Frontend abre mas não faz login (CORS / "não conectou") | `API_URL` errado no build | Edite `docker-compose.yml` com o IP correto e rode `docker-compose up --build` |
| Login retorna 400 "Credenciais inválidas" | Email ou senha errados | Use exatamente as credenciais da tabela acima |
| Login retorna "Não foi possível conectar à API" | API não está rodando | Verifique `docker-compose ps` e `docker-compose logs api` |
| 403 ao criar/editar/excluir serviço | Logado como CLIENTE | Faça login com `admin@petshop.com` |
| DataInitializer não criou os dados | API não conseguiu conectar ao banco | `docker-compose down -v` e `docker-compose up --build` |
| Mudei `API_URL` mas não funcionou | Docker usou cache do build antigo | `docker-compose up --build` (o `--build` refaz a imagem) |
| Backend não conecta ao MySQL local (sem Docker) | URL ainda com `db` | Edite `application.properties`: troque `db` por `localhost` |
