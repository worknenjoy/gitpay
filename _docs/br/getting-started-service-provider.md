---
layout: doc
lang: br
role: service-provider
title: Comece como prestador de serviço
subtitle: Da conta nova ao primeiro pagamento recebido por uma solicitação de pagamento
tags: service-provider, payment-requests, getting-started
---

#### Índice
{:.no_toc}
* TOC
{:toc}

Esta página leva você do cadastro ao primeiro pagamento recebido. Leva cerca de 15 minutos, a maior parte na verificação de identidade com a Whop.

## 1. Crie sua conta

Cadastre-se em [gitpay.me](https://gitpay.me) com e-mail e senha, ou com GitHub ou Bitbucket. Se usar e-mail, abra o link de verificação que o Gitpay envia antes de continuar.

Você não precisa de GitHub para usar solicitações de pagamento. Ele só é necessário para [importar um pull request](/docs/br/delivering-work/) como solicitação de pagamento.

## 2. Escolha o papel Provider

Vá em **Conta → Perfil** (seção "Que tipo de usuário é você?"), selecione **Provider** ("You provide a service and need to request payments") e salve. Seu painel passa a mostrar seus links de pagamento, receita e reivindicações.

## 3. Configure seus saques

Você só consegue criar uma solicitação de pagamento quando sua conta de saque está ativa, porque o Gitpay cria o checkout dentro da sua própria conta de saque.

1. Abra **Configurações de pagamento** e escolha a aba da Whop.
2. Escolha seu país. Ele define a moeda dos seus saques.
3. Selecione **Configurar em Whop** e conclua a verificação de identidade e um método de saque (transferência bancária, cartão de débito ou USDC) na Whop.
4. Volte ao Gitpay. O status mostra **PAYOUTS ATIVOS** quando a Whop aprova a conta e há um método de saque cadastrado.

Detalhes e solução de problemas: [Configure seus saques](/docs/br/whop-payout-setup/).

## 4. Crie sua primeira solicitação de pagamento

1. No menu lateral, vá em **Solicitações de pagamento → Links de pagamento** e selecione **Criar solicitação de pagamento**.
2. Informe título, descrição e valor em dólares (USD), ou ative **Quantidade personalizada** para o cliente escolher o valor.
3. Confirme. O Gitpay gera um link de pagamento.

Todos os campos e opções estão explicados em [Solicite pagamento a um cliente](/docs/br/service-provider/).

## 5. Envie o link e receba

Copie o link de pagamento e envie ao cliente pelo canal que vocês já usam. Quando ele pagar:

- você recebe um e-mail com o valor e os dados do cliente;
- o pagamento aparece em **Solicitações de pagamento → Pagamentos**, com as taxas e o seu valor líquido;
- o dinheiro cai no seu saldo Whop. Pagamentos com cartão normalmente ficam **pendentes** por 1 a 4 dias antes de ficarem **disponíveis**.

Depois, solicite o saque: [Saques](/docs/br/payouts/).

## Antes de começar: combine com o cliente

O Gitpay processa o pagamento; ele não sabe o que você combinou de entregar. Combine por escrito o preço, a entrega e sua política de reembolso antes de enviar o link. Se um cliente contestar a cobrança, esse combinado e a prova de entrega são suas evidências. Veja [Reembolsos e disputas](/docs/br/disputes-and-refunds/).

## Próximos passos

- [Solicite pagamento a um cliente](/docs/br/service-provider/)
- [Como funcionam pagamentos e taxas](/docs/br/payments/)
- [Saques](/docs/br/payouts/)
