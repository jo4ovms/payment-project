# API RESTful de Vendas com NestJS

Esta é uma API RESTful desenvolvida com NestJS, TypeScript, TypeORM e PostgreSQL para gerenciar clientes, produtos, condições de pagamento e preços.

## Funcionalidades

- CRUD completo para Clientes, Produtos, Condições de Pagamento e Preços
- Relacionamentos entre entidades
- Notificações assíncronas via RabbitMQ
- Relatórios de vendas por cliente
- Documentação Swagger

## Pré-requisitos

- Node.js (v16+)
- npm ou yarn
- Docker e Docker Compose

## Instalação e Execução

### Com Docker

1. Clone o repositório
2. Execute os containers com Docker Compose:

```bash
docker-compose up -d
```

A API estará disponível em: http://localhost:3000/api  
Swagger: http://localhost:3000/api/docs  
RabbitMQ Management: http://localhost:15672 (usuário: guest, senha: guest)

### Sem Docker

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Certifique-se de ter um servidor PostgreSQL e RabbitMQ em execução
4. Configure o arquivo `.env` com as credenciais corretas
5. Execute a aplicação:

```bash
npm run start:dev
```

## Tecnologias Utilizadas

- NestJS: Framework para construção de aplicações Node.js
- TypeScript: Superset tipado de JavaScript
- TypeORM: ORM para interação com o banco de dados
- PostgreSQL: Banco de dados relacional
- RabbitMQ: Sistema de mensageria para notificações assíncronas
- Swagger: Documentação da API
- Docker & Docker Compose: Containerização da aplicação
