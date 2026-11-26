---
layout: doc
lang: br
title: O que é o Gitpay?
subtitle: As duas formas de o dinheiro circular no Gitpay, quem usa cada uma e quanto custa
tags: getting-started, payments, payment-requests, bounties
redirect_from:
  - /docs/br/collections/
---

#### Índice
{:.no_toc}
* TOC
{:toc}

O Gitpay é uma plataforma de pagamentos para trabalho. Ele tem dois produtos:

| | Solicitações de pagamento | Recompensas (bounties) |
|---|---|---|
| O que é | Um link de pagamento que você envia a um cliente | Dinheiro vinculado a uma issue do GitHub (ou Bitbucket) |
| Quem recebe | Quem criou o link | O contribuidor cujo pull request resolve a issue |
| Quando recebe | Quando o cliente paga | Quando a solução é mesclada (merge) e a issue é fechada |
| Quem paga a taxa | O vendedor (descontada do pagamento) | O patrocinador (somada ao valor) e o contribuidor (descontada do repasse) |
| Comece aqui | [Comece como prestador de serviço](/docs/br/getting-started-service-provider/) | [Comece como contribuidor](/docs/br/getting-started-contributor/) ou [como patrocinador](/docs/br/getting-started-sponsor/) |

## Solicitações de pagamento

Uma solicitação de pagamento é um link com título, descrição e valor (fixo ou escolhido pelo cliente). Você envia o link ao cliente por mensagem, e-mail ou DM. O cliente paga com cartão em um checkout seguro, e o dinheiro vai para a sua conta de saque, menos a taxa de processamento e a taxa da plataforma Gitpay.

Você não precisa de site, loja nem repositório no GitHub. Solicitações de pagamento servem para qualquer serviço digital: design, ilustração e comissões, desenvolvimento, consultoria, redação, edição, coaching.

Leia [Solicite pagamento a um cliente](/docs/br/service-provider/).

## Recompensas

Uma recompensa é o dinheiro que um patrocinador coloca em uma issue. Qualquer pessoa pode ver a issue no Gitpay, trabalhar nela e enviar um pull request. Quando o pull request é mesclado e a issue é fechada, o contribuidor envia a URL do pull request ao Gitpay como solução e recebe a recompensa.

Os patrocinadores podem pagar agora (o Gitpay guarda o dinheiro até uma solução ser mesclada) ou se comprometer a pagar depois (nada é cobrado até uma solução ser aceita).

Leia [Financie uma issue](/docs/br/sponsor/) e [Trabalhe em uma issue financiada](/docs/br/contributor/).

## Papéis

Sua conta pode ter um ou mais papéis. Eles mudam o que aparece no seu painel; não limitam o que você pode fazer.

| Papel | No app | Para |
|---|---|---|
| Prestador de serviço | Provider | Enviar solicitações de pagamento a clientes |
| Contribuidor | Contributor | Resolver issues financiadas |
| Patrocinador | Funding | Financiar issues |
| Mantenedor | Maintainer | Importar issues dos seus projetos e revisar trabalhos |

Altere seus papéis em **Conta → Perfil** (seção "Que tipo de usuário é você?").

## Como o dinheiro circula

O Gitpay usa a [Whop](https://whop.com) para checkout, verificação de identidade e saques. Contas criadas antes da Whop ainda podem usar Stripe Connect ou PayPal; veja [Configure seus saques](/docs/br/whop-payout-setup/).

**Solicitação de pagamento:** o cliente paga → o pagamento cai no seu saldo Whop (a taxa do Gitpay é separada na mesma cobrança) → você solicita o saque para sua conta bancária, cartão de débito ou carteira USDC.

**Recompensa:** o patrocinador paga → o Gitpay guarda o dinheiro → a solução é mesclada e a issue é fechada → o Gitpay transfere a recompensa para a conta de saque do contribuidor → o contribuidor solicita o saque.

## Taxas em resumo

| | Taxa |
|---|---|
| Solicitação de pagamento (criada com cobrança direta na Whop) | 5% do valor cobrado, mais a taxa de processamento da Whop |
| Solicitação de pagamento (links antigos, Gitpay como comerciante responsável) | 8% do valor após as taxas de processamento |
| Recompensa, issue de código aberto | 8% somados para o patrocinador; sem taxa para recompensas de US$ 5.000 ou mais |
| Recompensa, issue privada | 18% somados para o patrocinador |
| Repasse da recompensa ao contribuidor | O contribuidor recebe 92% da recompensa |

Detalhes completos: [Como funcionam pagamentos e taxas](/docs/br/payments/).

## Próximos passos

- [Comece como prestador de serviço](/docs/br/getting-started-service-provider/)
- [Comece como contribuidor](/docs/br/getting-started-contributor/)
- [Comece como patrocinador](/docs/br/getting-started-sponsor/)
- [Perguntas frequentes](/docs/br/faq/)
