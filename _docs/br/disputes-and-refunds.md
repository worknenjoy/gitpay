---
layout: doc
lang: br
title: Reembolsos e disputas
subtitle: Como reembolsar um cliente, o que acontece quando um pagamento é contestado e como funcionam os reembolsos de recompensas
tags: payments, refunds, disputes, chargebacks, payment-requests, bounties
---

#### Índice
{:.no_toc}
* TOC
{:toc}

Um **reembolso** é o dinheiro que você (ou o Gitpay) devolve a quem pagou. Uma **disputa**, ou estorno (chargeback), é quando quem pagou pede ao banco para reverter um pagamento com cartão. Disputas custam mais que reembolsos, então, se um cliente está insatisfeito, reembolsar costuma ser melhor para os dois lados.

## Reembolse um pagamento de solicitação de pagamento

1. Vá em **Solicitações de pagamento → Pagamentos** e abra o pagamento.
2. Selecione **Reembolso** e confirme.

O cliente é reembolsado do **valor que pagou, sem as taxas**: a taxa de processamento e a taxa da plataforma Gitpay não são devolvidas, porque o processador de pagamentos também não as devolve. Na prática, o cliente recebe de volta o seu valor líquido desse pagamento.

O cliente recebe uma confirmação de reembolso por e-mail. O status do pagamento muda para **Reembolsado**.

### De onde sai o reembolso

- **Pagamentos com cobrança direta** (todas as novas solicitações): o reembolso sai do seu saldo Whop. Nada é registrado no seu saldo de solicitações de pagamento no Gitpay.
- **Solicitações antigas** (Gitpay como comerciante responsável): se você já recebeu por esse pagamento, o valor reembolsado é recuperado de você. Se ainda não recebeu, só é cobrada de você a taxa de processamento que não pode ser recuperada. Esses valores aparecem em **Solicitações de pagamento → Disputas / reembolsos**.

## Disputas em solicitações de pagamento

### Pagamentos com cobrança direta

Sua conta Whop é a comerciante responsável, então as disputas são abertas contra a sua conta e tratadas na Whop. A Whop pode cobrar taxas de disputa. O Gitpay avisa você quando a Whop informa uma disputa ou um alerta antecipado de disputa.

Para responder, envie suas evidências à Whop: o combinado por escrito com o cliente (preço e escopo), o trabalho entregue e a conversa com ele.

### Solicitações antigas

O Gitpay trata a disputa e cobra o custo do seu saldo de solicitações de pagamento:

```
valor contestado + taxa da plataforma (8%) + taxa de disputa (US$ 15 na Whop, ou a taxa da Stripe)
```

Se a disputa for ganha, o valor é creditado de volta. Um saldo negativo é recuperado dos seus próximos pagamentos.

### Como evitar disputas

- Combine por escrito preço, escopo e política de reembolso antes de enviar o link.
- Envie os links em privado para quem vai pagar.
- Guarde a prova de entrega.
- Reembolse rápido quando não puder entregar.

## Reembolsos de recompensas

| Situação | O que acontece |
|---|---|
| Uma solução foi mesclada, mas ninguém reivindicou a recompensa | O Gitpay envia um e-mail ao autor do pull request no dia 26 de cada mês. Depois de dois lembretes, a execução seguinte reembolsa os patrocinadores. |
| Você financiou a issue errada | Em **Pagamentos**, use a opção de transferir a recompensa para mover seu pagamento para outra issue. |
| Qualquer outro caso (issue abandonada, fechada sem solução) | Escreva para [contact@gitpay.me](mailto:contact@gitpay.me) com o link da issue. |

Os reembolsos voltam para o meio de pagamento original, ou para sua carteira se você pagou com a carteira. A taxa somada quando você financiou a recompensa não é reembolsada.

## Próximos passos

- [Como funcionam pagamentos e taxas](/docs/br/payments/)
- [Financie uma issue](/docs/br/sponsor/)
