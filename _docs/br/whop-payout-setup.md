---
layout: doc
lang: br
title: Configure seus saques
subtitle: Conecte uma conta de saque Whop para receber pagamentos e recompensas
tags: payouts, whop, account, verification
---

#### Índice
{:.no_toc}
* TOC
{:toc}

Para receber dinheiro no Gitpay, seja de solicitações de pagamento ou de recompensas, você precisa de uma conta de saque ativa. O Gitpay usa a Whop para isso. A Whop verifica sua identidade, cuida dos formulários fiscais e envia o dinheiro para sua conta bancária, cartão de débito ou carteira USDC. O Gitpay nunca guarda seus dados bancários.

## Configure sua conta de saque Whop

1. Abra **Configurações de pagamento** e escolha a aba da Whop.
2. **Escolha o país e continue.** O país define a moeda dos seus saques, e o Gitpay cria uma conta Whop para você dentro da plataforma Gitpay, com seu nome e e-mail.
   - Se já existir uma conta Whop para o seu e-mail verificado, o Gitpay pergunta se você quer vinculá-la.
3. Selecione **Configurar em Whop**. Você vai para a Whop para:
   - verificar sua identidade (nome legal e documentos);
   - adicionar um método de saque: transferência bancária, cartão de débito ou USDC.
4. Ao terminar, a Whop leva você de volta ao Gitpay com a confirmação de que a verificação foi enviada.

A Whop faz saques para mais de 100 países, em mais de 30 moedas.

## Status da conta

A página **Configurações de pagamento** mostra seu status:

| Status | Significado | O que fazer |
|---|---|---|
| **PAYOUTS ATIVOS** | Verificada e com método de saque cadastrado. Você pode criar solicitações de pagamento e receber recompensas. | Nada. |
| **VERIFICAÇÃO OBRIGATÓRIA** | A Whop ainda precisa de informações suas. | Selecione **Completar verificação** e conclua as etapas na Whop. |
| **PENDENTE** | Você enviou tudo e a Whop está analisando. | Aguarde, ou selecione **Verificar status no Whop**. |
| **REJEITADO** | A Whop encontrou um problema na conta. | Selecione **Resolver em Whop**. |

Sua conta só conta como ativa quando **as duas** condições são verdadeiras: a Whop aprovou a conta para saques e há pelo menos um método de saque cadastrado. Só a verificação não basta.

Se o seu link de verificação expirar, abra **Configurações de pagamento** de novo e continue. O que você já enviou fica salvo.

## O que você vê no Gitpay

- **Titular da conta**: sua empresa conectada na Whop, com ID, país, moeda e saldos:
  - **Disponível**: pode ser sacado agora;
  - **Pendente**: ainda em liquidação (pagamentos com cartão costumam levar de 1 a 4 dias);
  - **Reserva**: retido pela Whop.
- **Conta bancária**: um link para gerenciar seu método de saque na Whop. Dados bancários ficam só na Whop.
- **Disputas / reembolsos**: estornos e reembolsos que a Whop informa para a sua conta.

Para mudar o método de saque, o cronograma ou seus dados de identidade, use o botão que abre a Whop para gerenciar a conta.

## Desconectar

**Desconectar conta Whop** remove o vínculo entre o Gitpay e sua empresa na Whop. A Whop mantém seus dados bancários e de identidade. Você pode reconectar depois escolhendo um país de novo.

## Stripe e PayPal (contas antigas)

Antes da Whop, o Gitpay fazia saques por Stripe Connect e PayPal.

- **Stripe:** não é mais possível criar uma conta de saque Stripe. Contas Stripe existentes continuam recebendo no cronograma delas até serem migradas para a Whop; o suporte vai entrar em contato sobre a migração.
- **PayPal:** está sendo descontinuado e não pode mais ser adicionado. Use a Whop, que atende os mesmos países.

## Próximos passos

- [Saques](/docs/br/payouts/)
- [Como funcionam pagamentos e taxas](/docs/br/payments/)
