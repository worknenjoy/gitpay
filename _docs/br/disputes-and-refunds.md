---
layout: doc
lang: br
role: sponsor
title: Disputas e reembolsos
subtitle: O que acontece com seu saldo quando uma solicitação de pagamento sofre uma disputa ou reembolso
tags: disputas, chargeback, reembolsos, solicitações de pagamento, taxas
---

#### O que você vai ver
{:.no_toc}
* TOC
{:toc}

Uma disputa ou reembolso pode acontecer mesmo depois que um [claim](/docs/br/claims/) já foi creditado
para você, ou depois que você solicitou um [payout](/docs/br/payouts/). Esta página explica o que isso
significa para o seu saldo.

## Onde isso se encaixa no fluxo de pagamento

```
reivindicado  →  financiado  →  transferência creditada  →  payout solicitado  →  dinheiro na sua conta
                       (Claims)                                                          ↘
                                                                        disputa ou reembolso (esta página)
                                                                              debita seu saldo
```

Reivindicar, financiar e sacar via payout são a direção "para frente": dinheiro se movendo em sua
direção. Uma disputa ou reembolso funciona no sentido contrário — reverte parte dessa cadeia debitando
dinheiro de volta do seu saldo, mesmo que ele já tivesse sido creditado como um claim.

## O que é uma disputa?

Uma disputa (também chamada de chargeback) acontece quando a pessoa que te pagou contesta a cobrança
junto ao banco ou à bandeira do cartão — por exemplo, se ela acredita que a cobrança não foi autorizada.
Ela é aberta pelo banco de quem pagou, não pelo Gitpay nem diretamente por quem pagou através do Gitpay.

## O que é um reembolso?

Um reembolso é dinheiro devolvido para quem pagou, seja porque você ou o Gitpay o emitiu, seja porque
foi emitido diretamente no painel do provedor de pagamento. Reembolsos feitos pela própria interface do
Gitpay são sempre do valor integral — não existe opção de reembolso parcial no produto.

## Como as disputas afetam seu saldo

Quando uma disputa é aberta, o valor disputado é debitado do seu saldo de solicitações de pagamento,
junto com a taxa de 8% da plataforma Gitpay e uma taxa do provedor. Se a disputa for resolvida a seu
favor depois, o valor disputado e a taxa do provedor são creditados de volta — mas a taxa de 8% do
Gitpay não é reembolsada, então seu saldo não volta totalmente ao ponto inicial mesmo quando você
vence.

## Como os reembolsos afetam seu saldo

Um reembolso gera um desconto mais leve do que uma disputa: apenas a taxa de 8% do Gitpay é debitada do
seu saldo. O próprio provedor de pagamento absorve o valor reembolsado, já que esse dinheiro nunca
chegou a ser transferido para você como payout.

## Taxas extras no Whop (alertas de disputa)

Se você recebe pelo Whop, o Whop pode reembolsar automaticamente uma transação abaixo de um certo valor
assim que detecta uma disputa chegando, antes que ela vire um chargeback formal. Quando isso acontece,
o Whop cobra uma taxa de alerta separada (atualmente por volta de $29), independente do resultado, e o
Gitpay a debita do seu saldo imediatamente. Você recebe um e-mail assim que isso ocorre.

## Onde ver isso

Sua página de **Solicitações de pagamento** tem um painel de "Disputas e reembolsos" mostrando qualquer
valor atualmente devido por disputas ou taxas de reembolso nas suas solicitações de pagamento.

## O que fazer se você discordar de uma disputa

Disputas são abertas e resolvidas através do banco ou da bandeira do cartão de quem pagou, não dentro do
Gitpay, então não existe um fluxo de resposta a disputas dentro do produto. Se você acredita que uma
disputa está equivocada, entre em contato com o suporte com os detalhes do pagamento — podemos ajudar a
te orientar.
