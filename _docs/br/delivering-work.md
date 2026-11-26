---
layout: doc
lang: br
role: service-provider
title: Solicitações de pagamento para pull requests
subtitle: Transforme um pull request mesclado em um link de pagamento e publique no GitHub
tags: service-provider, payment-requests, pull-requests, github
---

#### Índice
{:.no_toc}
* TOC
{:toc}

Se você contribuiu com um projeto e quer pedir pagamento, ou deixar que as pessoas apoiem o trabalho, pode importar o pull request para o Gitpay. O Gitpay cria uma solicitação de pagamento vinculada a ele e pode publicar o link de pagamento como comentário no pull request, escrito em seu nome.

Funciona com qualquer pull request mesclado que você abriu no GitHub, com ou sem recompensa na issue. Se a issue tem recompensa, envie uma solução em vez disso; veja [Envie uma solução](/docs/br/pull-requests/).

## Requisitos

- Sua conta no Gitpay está conectada ao GitHub.
- Você abriu o pull request com essa conta do GitHub.
- O pull request foi **mesclado**. Pull requests abertos, ou fechados sem merge, não podem ser importados.
- Sua conta de saque está ativa ([Configure seus saques](/docs/br/whop-payout-setup/)).

## Importe um pull request

1. Selecione **Importação → Importar solicitação pull** na barra superior.
2. Cole a URL do pull request, ou escolha em **Meus pull requests** se o GitHub estiver conectado.
3. Escolha o valor:
   - **Quantia fixa**: você define o preço e quem paga paga esse valor.
   - **Montante personalizado**: quem paga escolhe quanto pagar, em dólares (USD).
4. Revise a solicitação. Você vê uma prévia do comentário antes de qualquer publicação.
5. Escolha **Criar e postar** para criar o link e publicar o comentário, ou apenas criar o link.

A solicitação aparece em **Solicitações de pagamento → Links de pagamento** como qualquer outra, com o pull request vinculado. Taxas e saques são os mesmos de qualquer solicitação de pagamento.

## O comentário no pull request

O comentário é publicado pela sua própria conta do GitHub, não por um bot do Gitpay. Ele diz que o pagamento é opcional e inclui o preço (ou "qualquer valor é bem-vindo", no valor personalizado) e um link **Pay here** (Pague aqui).

Para publicar, o Gitpay precisa de permissão para comentar em seu nome em repositórios públicos. Se você ainda não deu essa permissão, o Gitpay leva você ao GitHub para aprovar primeiro.

Se você só criou o link, pode publicar o comentário depois na mesma janela, com **Postar no pull request**.

## Erros

| Mensagem | O que fazer |
|---|---|
| Conecte sua conta do GitHub antes de importar um pull request | Entre com o GitHub ou conecte o GitHub à sua conta. |
| Este pull request não foi aberto pela sua conta do GitHub conectada | Você só pode importar seus próprios pull requests. |
| Somente pull requests com merge podem ser importados | Espere o pull request ser mesclado. |
| Não conseguimos encontrar essa pull request | Confira a URL. Ela deve ser como `https://github.com/dono/repo/pull/123`. |

## Próximos passos

- [Solicite pagamento a um cliente](/docs/br/service-provider/)
- [Como funcionam pagamentos e taxas](/docs/br/payments/)
