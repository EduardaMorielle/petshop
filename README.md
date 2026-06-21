# 🐾 Petshop Manager

Sistema de gerenciamento de petshop desenvolvido como projeto final da disciplina de Desenvolvimento de Sistemas Web — CESIT/UEA.

**Discente:** Eduarda Gabrielle Moraes dos Santos  
**Docente:** Dr. João da Mata  

---

## Problema

Petshops sem sistemas digitalizados perdem até 30% dos agendamentos por conflitos de horário e falhas de comunicação. O Petshop Manager digitaliza o cadastro de pets, serviços e agendamentos, centralizando as operações em uma interface web moderna.

## Solução

Aplicação web full stack com:
- API REST em Spring Boot com autenticação JWT
- SPA em Angular com Angular Material
- Banco de dados MySQL
- Implantação em containers Docker

## Funcionalidades

- Login com JWT e controle de acesso (ADMIN / CLIENTE)
- CRUD de Pets
- CRUD de Serviços (somente ADMIN pode criar/editar/excluir)
- CRUD de Agendamentos
- Dashboard com totalizadores
- Paginação em todas as listagens

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Back-end | Spring Boot 3.2, Spring Security, JPA |
| Banco | MySQL 8 |
| Front-end | Angular 17, Angular Material |
| Auth | JWT (jjwt 0.12) |
| Deploy | Docker, Docker Compose |

---

## Execução com Docker

```bash
git clone https://github.com/<seu-usuario>/petshop.git
cd petshop
docker-compose up --build
```

- Frontend: http://172.25.1.60:4743  
- API: http://172.25.1.60:8743

---

## Credenciais de teste

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@petshop.com | admin123 |
| Cliente | cliente@petshop.com | cliente123 |

---

## Estrutura do repositório

```
petshop/
├── backend/          # API Spring Boot
│   ├── src/
│   │   └── main/java/com/petshop/api/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── model/
│   │       ├── dto/
│   │       └── security/
│   └── Dockerfile
├── frontend/         # SPA Angular
│   ├── src/app/
│   │   ├── core/        # services, guards, interceptors, models
│   │   ├── pages/       # login, dashboard, pets, servicos, agendamentos
│   │   └── shared/      # layout com menu lateral
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

---

## Execução local (desenvolvimento)

### Back-end
```bash
cd backend
./mvnw spring-boot:run
# API disponível em http://localhost:8743
```

### Front-end
```bash
cd frontend
npm install
npm start
# App disponível em http://localhost:4200
```
