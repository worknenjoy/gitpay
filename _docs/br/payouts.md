---
layout: doc
lang: br
role: contributor
title: Como funcionam os pagamentos (payouts)
subtitle: Como o Gitpay envia seus ganhos de recompensas e solicitações de pagamento para sua conta
tags: payout, pagamento, conta bancária, whop, stripe
---

#### O que você vai ver
{:.no_toc}
* TOC
{:toc}

Um payout é a última etapa de uma jornada mais longa que o seu dinheiro percorre no Gitpay — esta
página explica essa etapa. Se você ainda não leu [Claims](/docs/br/claims/), comece por lá: essa página
explica como o trabalho que você faz se transforma em dinheiro que você pode sacar.

## Onde isso se encaixa no fluxo de pagamento

```
reivindicado  →  financiado  →  transferência creditada  →  payout solicitado  →  dinheiro na sua conta
  (Claims)      (issue/PR       (aparece na sua                                          ↘
                pago)           página Claims)                                disputa ou reembolso
                                                                       (veja Disputas e reembolsos)
```

Um payout é o que transforma uma transferência já creditada — dinheiro que já está no seu saldo do
Gitpay porque uma recompensa ou solicitação de pagamento foi paga — em dinheiro que realmente chega à
sua conta bancária ou conta Whop. Nada em um payout muda *quanto* você tem a receber; é a etapa de
saque, não a etapa em que você ganha o dinheiro.

## Como você recebe o pagamento

Sempre que uma tarefa que você assumiu é concluída e sua recompensa é paga, ou uma solicitação de
pagamento que você emitiu é paga, o Gitpay credita uma transferência na sua conta. Você pode ver todas
elas na sua [página Claims](/docs/br/claims/). Nada disso exige qualquer ação da sua parte — acontece
automaticamente assim que a cobrança de quem pagou é confirmada.

## Solicitando um saque

Assim que você tiver saldo, acesse sua página **Payouts** e solicite um saque. O que acontece em
seguida depende de como sua conta está conectada:

- **Stripe** — seu payout segue o cronograma de pagamento configurado na sua conta Stripe conectada.
- **Whop** — os payouts podem ser solicitados a qualquer momento, assim que seu método de pagamento no
  Whop estiver configurado.

## Verificando seu saldo

Sua página de Payouts sempre mostra seu saldo disponível atual antes do saque, para que você saiba
exatamente quanto vai ser movimentado.

## Configurando para onde o dinheiro vai

Antes do seu primeiro payout, você precisa informar ao Gitpay para onde enviar o dinheiro:

- Se você recebe pelo Stripe, conecte uma conta bancária nas suas configurações de pagamento.
- Se você recebe pelo Whop, siga o guia
  [Como configurar uma conta de pagamento no Whop](/docs/br/whop-payout-setup/).

Veja [Como funciona nosso pagamento](/docs/br/payments/) para mais detalhes sobre taxas e conexão de
conta bancária.

## Quanto tempo leva

Pagamentos com cartão não ficam disponíveis para saque no mesmo instante em que são feitos — os
provedores retêm os valores por um curto período de liquidação (normalmente alguns dias) antes que
possam ser transferidos. Assim que uma transferência passa por esse período, ela fica pronta para
entrar no seu próximo payout.

## Resolvendo problemas com um payout que não chegou

Se um payout parecer travado:

1. Verifique se seu método de payout ainda está ativo nas configurações de pagamento (Stripe ou Whop) —
   um método expirado ou incompleto é a causa mais comum.
2. Aguarde alguns dias úteis — transferências bancárias, em especial, não são instantâneas mesmo depois
   que o Gitpay as inicia.
3. Ainda nada? Entre em contato com o suporte com a referência do seu payout para que possamos
   verificar.

## Para onde ir agora

- Não sabe de onde veio o saldo de um payout? Veja [Claims](/docs/br/claims/).
- Saldo menor do que o esperado? Uma disputa ou reembolso pode ter afetado ele — veja
  [Disputas e reembolsos](/docs/br/disputes-and-refunds/).
