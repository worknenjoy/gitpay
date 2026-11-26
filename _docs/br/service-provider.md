---
layout: doc
lang: br
role: service-provider
title: Solicite pagamento a um cliente
subtitle: Todos os campos e opções de uma solicitação de pagamento, o que o cliente vê e como gerenciar seus links
tags: service-provider, payment-requests
---

#### Índice
{:.no_toc}
* TOC
{:toc}

Uma solicitação de pagamento é um link de pagamento reutilizável. Você cria no Gitpay, envia ao cliente e ele paga com cartão. Antes, sua conta de saque precisa estar ativa; veja [Comece como prestador de serviço](/docs/br/getting-started-service-provider/).

## Crie uma solicitação de pagamento

Vá em **Solicitações de pagamento → Links de pagamento → Criar solicitação de pagamento**.

### Informação básica

| Campo | O que faz |
|---|---|
| **Título** | Aparece para o cliente no checkout. Dê o nome do serviço, por exemplo "Ilustração de personagem – corpo inteiro". |
| **Descrição** | Aparece para o cliente. Descreva o que ele está pagando. |
| **Quantidade** | O preço em dólares (USD). Não é usado quando **Quantidade personalizada** está ativada. |

### Configurações

| Opção | Padrão | O que faz |
|---|---|---|
| **Quantidade personalizada** | Desligada | O cliente digita o valor que vai pagar. Use quando o preço muda por cliente, para gorjetas ou sinais (adiantamentos). |
| **Desativar após pagamento** | Desligada | O link deixa de aceitar pagamentos após o primeiro. Use para trabalhos avulsos. |
| **Enviar notificação por e-mail com as instruções de pagamento** | Desligada | Depois de pagar, o cliente recebe um e-mail com as instruções que você escrever (próximos passos, detalhes da entrega, como falar com você). |
| **Listar no perfil** | Desligada | Mostra o link no seu perfil público do Gitpay, para que qualquer visitante possa pagar. |
| **Cobrança direta para a sua conta conectada** | Ligada (fixa) | O pagamento é cobrado na sua própria conta Whop e a taxa do Gitpay é separada na mesma cobrança. Veja [Como funcionam pagamentos e taxas](/docs/br/payments/). |
| **Ativo** | Ligada | Quando desligada, o link não pode ser pago. |

**Anexar arquivos** (entregar arquivos automaticamente após o pagamento) aparece como *Em breve*.

### O que acontece ao salvar

O Gitpay cria o produto e o checkout na Whop e gera o seu link de pagamento. A taxa da plataforma em vigor nesse momento (hoje, 5%) fica gravada no link e vale para todos os pagamentos que ele receber, mesmo que a taxa do Gitpay mude depois.

## O que o cliente vê

- **Valor fixo:** o link abre um checkout seguro da Whop com seu título, descrição e preço. O cliente paga com cartão.
- **Valor personalizado:** o link abre uma página do Gitpay onde o cliente digita o valor e paga em um checkout embutido na mesma página.

O cliente não precisa de conta no Gitpay.

Depois de pagar, o cliente recebe o seu e-mail de instruções, se você ativou essa opção.

## Depois de um pagamento

Você recebe um e-mail com o valor e o nome e e-mail do cliente. Em **Solicitações de pagamento → Pagamentos** você pode abrir cada pagamento para ver:

- **valor pago pelo cliente**: o valor bruto;
- **Taxa de processamento**: a taxa da Whop para processar o pagamento;
- **Taxa de plataforma (5%)**: a taxa do Gitpay;
- **Montante líquido**: o que você recebe. Aparece como **Pendente** até a Whop informar o valor final.

A mesma tela mostra o status do pagamento (concluído, falhou ou reembolsado) e o histórico.

## Gerencie seus links

Em **Links de pagamento**, use **Ações** em qualquer link para:

- editar o **título** e a **descrição**;
- ligar ou desligar **Ativo**, por exemplo se o link foi enviado à pessoa errada;
- mudar as outras opções, como **Listar no perfil** ou o e-mail de instruções.

Não é possível mudar o valor nem trocar entre valor fixo e personalizado em um link existente. Crie um link novo e desative o antigo.

## Solicite pagamento por um pull request

Se o trabalho é um pull request no GitHub, você pode importá-lo em vez de preencher o formulário, e publicar o link de pagamento como comentário no pull request. Veja [Solicitações de pagamento para pull requests](/docs/br/delivering-work/).

## Boas práticas

- Envie o link em privado para quem vai pagar. Um link público pode ser pago por qualquer pessoa.
- Combine por escrito preço, escopo e política de reembolso antes de enviar o link.
- Guarde a prova de entrega (a conversa, os arquivos entregues) até o pagamento não poder mais ser contestado.
- Use **Desativar após pagamento** em trabalhos avulsos, para o link não ser pago duas vezes por engano.

## Próximos passos

- [Como funcionam pagamentos e taxas](/docs/br/payments/)
- [Reembolsos e disputas](/docs/br/disputes-and-refunds/)
- [Saques](/docs/br/payouts/)
