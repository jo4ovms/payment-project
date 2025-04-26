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
- Docker e Docker Compose (opcional, para execução em containers)

## Instalação e Execução

### Com Docker (recomendado)

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

## Estrutura do Projeto

```
src/
├── app.module.ts                  # Módulo principal da aplicação
├── main.ts                        # Ponto de entrada da aplicação
├── config/                        # Configurações da aplicação
├── common/                        # Componentes comuns e compartilhados
├── modules/                       # Módulos da aplicação
│   ├── clientes/                  # Módulo de Clientes
│   ├── produtos/                  # Módulo de Produtos
│   ├── condpagto/                 # Módulo de Condições de Pagamento
│   ├── precos/                    # Módulo de Preços
│   └── relatorios/                # Módulo de Relatórios
└── messaging/                     # Configuração e serviços do RabbitMQ
```

## Endpoints da API

### Clientes

- `POST /api/clientes`: Criar cliente
- `GET /api/clientes`: Listar clientes
- `GET /api/clientes/:id`: Obter cliente por ID
- `PUT /api/clientes/:id`: Atualizar cliente
- `DELETE /api/clientes/:id`: Remover cliente

### Produtos

- `POST /api/produtos`: Criar produto
- `GET /api/produtos`: Listar produtos
- `GET /api/produtos/:id`: Obter produto por ID
- `PUT /api/produtos/:id`: Atualizar produto
- `DELETE /api/produtos/:id`: Remover produto

### Condições de Pagamento

- `POST /api/condpagto`: Criar condição de pagamento
- `GET /api/condpagto`: Listar condições de pagamento
- `GET /api/condpagto/:id`: Obter condição de pagamento por ID
- `PUT /api/condpagto/:id`: Atualizar condição de pagamento
- `DELETE /api/condpagto/:id`: Remover condição de pagamento
- `PATCH /api/condpagto/:condPagtoId/vincular-cliente/:clienteId`: Vincular cliente
- `PATCH /api/condpagto/:condPagtoId/desvincular-cliente/:clienteId`: Desvincular cliente

### Preços

- `POST /api/precos`: Criar preço
- `GET /api/precos`: Listar preços
- `GET /api/precos/:id`: Obter preço por ID
- `GET /api/precos/:clienteId/:produtoId`: Obter preço por cliente e produto
- `PUT /api/precos/:id`: Atualizar preço
- `DELETE /api/precos/:id`: Remover preço

### Relatórios

- `GET /api/relatorio/vendas/:cnpjOuRazaoSocial`: Gerar relatório de vendas por cliente

## Tecnologias Utilizadas

- NestJS: Framework para construção de aplicações Node.js
- TypeScript: Superset tipado de JavaScript
- TypeORM: ORM para interação com o banco de dados
- PostgreSQL: Banco de dados relacional
- RabbitMQ: Sistema de mensageria para notificações assíncronas
- Swagger: Documentação da API
- Docker & Docker Compose: Containerização da aplicação
