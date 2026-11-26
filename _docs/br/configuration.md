---
layout: doc
lang: br
title: Contribua com o Gitpay
subtitle: Rode a plataforma Gitpay localmente e entenda a organização do código
author: Alexandre Magno
tags: development, open-source, setup
redirect_from:
  - /docs/br/installation/
  - /docs/br/assets/
  - /docs/br/structure/
---

#### Índice
{:.no_toc}
* TOC
{:toc}

O Gitpay é código aberto: [github.com/worknenjoy/gitpay](https://github.com/worknenjoy/gitpay). Esta página é para desenvolvedores que querem rodar o projeto localmente e contribuir. Se algo aqui divergir, o `README.md` e o `CONTRIBUTING.md` do repositório são a referência.

## Requisitos

- Node.js 24 (veja `.nvmrc`) e npm
- PostgreSQL, com os bancos `gitpay_dev` e `gitpay_test` do usuário `postgres`
- Ou Docker e Docker Compose

## Rode localmente

```bash
git clone https://github.com/worknenjoy/gitpay.git
cd gitpay
npm install
cd frontend && npm install && cd ..
cp .env.example .env    # depois preencha as credenciais necessárias

npm run migrate:dev     # cria as tabelas
npm run seed:dev        # opcional: dados de exemplo

npm run start:dev       # backend em http://localhost:3000
cd frontend && npm run dev   # frontend em http://localhost:8082
```

### Com Docker

```bash
docker-compose up                                  # app em http://localhost:8082
docker-compose -f docker-compose.test.yml up       # testes
```

## Testes e verificações

```bash
npm run test               # backend (Mocha)
cd frontend && npm run test   # frontend (Jest)
npm run test:e2e           # ponta a ponta (Playwright)
npm run lint && npm run typecheck
```

## Provedores de pagamento

Os pagamentos passam por uma camada de provedores em `src/providers/`. Defina `PAYMENT_PROVIDER=stripe` ou `PAYMENT_PROVIDER=whop` no `.env`. Webhooks, configuração do sandbox da Whop e o fluxo completo do dinheiro estão em [`docs/payments-providers.md`](https://github.com/worknenjoy/gitpay/blob/master/docs/payments-providers.md), no repositório.

## Onde fica cada coisa

| Caminho | Conteúdo |
|---|---|
| `src/app/routes`, `src/app/controllers` | API HTTP |
| `src/modules`, `src/services` | Regras de negócio por funcionalidade |
| `src/models` | Modelos Sequelize |
| `src/queries`, `src/mutations` | Leitura e escrita no banco |
| `src/providers` | Conectores Stripe e Whop |
| `src/crons`, `src/inngest` | Tarefas agendadas |
| `frontend/src/components/design-library` | Componentes de interface ([Storybook](https://docs.gitpay.me/storybook)) |
| `frontend/src/translations` | Textos da interface (inglês e português) |

## Como contribuir

1. Escolha uma issue no [GitHub](https://github.com/worknenjoy/gitpay/issues) ou no Gitpay; algumas têm recompensa.
2. Faça um fork, crie uma branch e abra um pull request que cite a issue.
3. Siga o padrão de código (`npm run lint-fix`). Para textos da interface, use React Intl e rode `npm run translate` em `frontend` em vez de editar os arquivos de tradução.

Recompensas nas issues do próprio Gitpay são pagas como qualquer outra: veja [Envie uma solução](/docs/br/pull-requests/).
