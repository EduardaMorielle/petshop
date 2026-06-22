# 🐾 PetShop Care — Sistema de Gerenciamento

Projeto final da disciplina de Desenvolvimento de Sistemas Web — CESIT/UEA.

**Discente:** Eduarda Gabrielle Moraes dos Santos  
**Instituição:** UEA — CESIT

---

## Problema

Petshops sem sistemas digitalizados perdem agendamentos por conflitos de horário, falhas de comunicação e controle manual ineficiente.

## Solução

O PetShop Care é uma aplicação web full stack com API REST em Spring Boot e SPA em Angular para centralizar o gerenciamento de pets, serviços e agendamentos, com autenticação JWT, rotas protegidas e implantação em Docker.

## Público-alvo

- Administradores do sistema
- Atendentes do petshop
- Clientes que desejam acompanhar seus pets e agendamentos

## Funcionalidades

- Login com JWT
- Controle de acesso por perfil
- CRUD de Pets
- CRUD de Serviços
- CRUD de Agendamentos
- Dashboard com indicadores
- Menu lateral de navegação
- Interface responsiva com Angular Material

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Back-end | Spring Boot 3.2, Spring Security, JPA |
| Banco de dados | MySQL 8 |
| Autenticação | JWT (jjwt 0.12) |
| Front-end | Angular 17, Angular Material |
| Implantação | Docker + Docker Compose |

## Como executar

### Com Docker

```bash
docker-compose up --build
```

### Localmente

```bash
cd backend
mvn spring-boot:run

cd frontend
npm install
npm start
```

## Acesso

- Front-end local: http://localhost:4200
- API local: http://localhost:8743

## Credenciais de teste

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@petshop.com | admin123 |
| Cliente | cliente@petshop.com | cliente123 |

## Estrutura do projeto

```
petshop/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

## Roteiro de apresentação

1. Problema escolhido e relevância.
2. Solução proposta e arquitetura.
3. Demonstração do login e das rotas protegidas.
4. CRUDs e integração com a API.
5. Explicação do JWT, interceptor e guard.
6. Implantação com Docker.
