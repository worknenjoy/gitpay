---
layout: doc
lang: br
title: Como funcionam pagamentos e taxas
subtitle: Para onde vai o dinheiro em solicitações de pagamento e recompensas, e quanto o Gitpay cobra exatamente
tags: payments, fees, payment-requests, bounties
redirect_from:
  - /docs/br/pages/
  - /docs/br/posts/
---

#### Índice
{:.no_toc}
* TOC
{:toc}

## Solicitações de pagamento

### Cobrança direta (todas as novas solicitações)

Toda solicitação de pagamento criada agora é uma **cobrança direta** na sua própria conta Whop:

1. O cliente paga no checkout.
2. A Whop cobra o pagamento na sua conta e, na mesma cobrança, envia a taxa da plataforma ao Gitpay.
3. O restante cai no seu saldo Whop, menos a taxa de processamento da Whop.

Na cobrança direta, **sua conta Whop é a comerciante responsável** (merchant of record): reembolsos e disputas desse pagamento são tratados na sua conta. Veja [Reembolsos e disputas](/docs/br/disputes-and-refunds/).

**Taxa:** 5% do valor pago pelo cliente, mais a taxa de processamento da Whop.

| Exemplo: o cliente paga US$ 180 | |
|---|---|
| Valor pago pelo cliente | US$ 180,00 |
| Taxa de plataforma (5%) | −US$ 9,00 |
| Taxa de processamento (Whop) | depende do meio de pagamento e do país do cliente |
| **Montante líquido** | US$ 180,00 − US$ 9,00 − taxa de processamento |

A taxa de processamento exata de cada pagamento aparece em **Solicitações de pagamento → Pagamentos → Ver detalhes**. As taxas de processamento são definidas pela Whop e variam conforme o meio de pagamento (por exemplo, cartão ou transferência bancária) e o país.

### Solicitações antigas (Gitpay como comerciante responsável)

Solicitações criadas antes da cobrança direta continuam funcionando do jeito antigo:

1. O cliente paga na conta Whop do Gitpay.
2. A Whop desconta a taxa de processamento.
3. O Gitpay fica com 8% do que sobra e transfere o restante para a sua conta Whop.

**Taxa:** 8% do valor após a taxa de processamento da Whop. O Gitpay trata as disputas desses pagamentos e recupera os custos do seu saldo de solicitações de pagamento (veja [Reembolsos e disputas](/docs/br/disputes-and-refunds/)).

Se um pagamento com cartão ainda não foi liquidado, a transferência espera. O Gitpay tenta de novo toda noite até os fundos ficarem disponíveis, então a reivindicação pode aparecer como **pendente** por alguns dias.

### A taxa fica fixa em cada link

A taxa da plataforma é gravada em cada solicitação de pagamento quando você a cria. Se a taxa do Gitpay mudar, seus links existentes mantêm a taxa com que foram criados. Para passar um link para a taxa atual, crie um novo.

### Moeda

Solicitações de pagamento têm preço em dólares (USD). A moeda dos seus saques depende do país que você escolheu ao configurar os saques.

## Recompensas

### O que o patrocinador paga

| Plano | Taxa somada à recompensa |
|---|---|
| Código aberto | 8% |
| Código aberto, recompensa de US$ 5.000 ou mais | Sem taxa |
| Issue privada | 18% |

A taxa aparece como total com taxa antes de você pagar. Exemplo: uma recompensa de US$ 100 em código aberto custa US$ 108 ao patrocinador.

Os patrocinadores podem pagar com **cartão** (cobrado agora), **fatura** (para empresas, paga por transferência bancária até o vencimento) ou **carteira** (fundos já adicionados ao Gitpay). Ou podem **pagar mais tarde**: nada é cobrado agora, e eles pagam quando uma solução é aceita. Veja [Financie uma issue](/docs/br/sponsor/).

### Onde o dinheiro fica

Quando o patrocinador paga agora, o Gitpay guarda o dinheiro até uma solução ser mesclada. A issue mostra a recompensa como financiada (ou **Fatura pendente**, até a fatura ser paga). Compromissos de pagamento futuro aparecem como **A pagar mais tarde**.

### O que o contribuidor recebe

Quando a solução é aceita, o Gitpay transfere **92% da recompensa paga** para a conta de saque do contribuidor. Exemplo: em uma recompensa de US$ 100, o contribuidor recebe US$ 92.

Se vários patrocinadores financiaram a mesma issue, os valores pagos são somados.

## Carteiras

Uma carteira guarda fundos que você adiciona antecipadamente para pagar recompensas. Adicione fundos em **Pagamentos → Carteiras → Adicionar fundos**; o Gitpay envia uma fatura para você pagar. Depois de paga, escolha **Carteira** como forma de pagamento ao financiar uma issue. Recompensas pagas com a carteira são reembolsadas na carteira.

## Próximos passos

- [Configure seus saques](/docs/br/whop-payout-setup/)
- [Saques](/docs/br/payouts/)
- [Reembolsos e disputas](/docs/br/disputes-and-refunds/)
