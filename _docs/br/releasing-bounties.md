---
layout: doc
lang: br
role: maintainer
title: Como as recompensas são pagas
subtitle: O que dispara o pagamento, quem recebe e o que acontece quando ninguém reivindica
tags: maintainer, sponsor, bounties, payouts
---

#### Índice
{:.no_toc}
* TOC
{:toc}

As recompensas são pagas automaticamente. Ninguém aperta um botão de "liberar": o pagamento é disparado quando o contribuidor envia uma solução que passa nas verificações do Gitpay.

## O que dispara o pagamento

Tudo isto precisa ser verdade:

1. O contribuidor entrou no Gitpay com o GitHub.
2. Ele é o autor do pull request.
3. O pull request foi mesclado no repositório da issue.
4. O pull request cita a issue.
5. A issue está fechada no GitHub.

O contribuidor envia a URL do pull request como solução. Se todas as verificações passarem, o Gitpay atribui a issue a ele (se ainda não estava atribuída) e transfere a recompensa para a conta de saque dele.

**Para mantenedores, mesclar é a aprovação.** Revise o pull request antes de mesclar.

## O que o contribuidor recebe

92% da recompensa paga. Só valores pagos são transferidos. Nos compromissos marcados como **A pagar mais tarde**, o patrocinador recebe um pedido de pagamento quando a solução é aceita.

Se a conta de saque do contribuidor não estiver ativa, a transferência falha e ele é orientado a terminar a configuração e enviar a solução de novo.

## Estados da issue

| Estado | Quando |
|---|---|
| **Created** (criada) | Importada, sem recompensa. |
| **Funded** (financiada) | Um patrocinador pagou uma recompensa. |
| **Claimed** (reivindicada) | Uma solução foi aceita e a transferência começou. |
| **Completed** (concluída) | A recompensa foi transferida. |
| **Closed** (fechada) | Fechada no Gitpay, por exemplo depois de um reembolso. |

## Quando uma solução é mesclada, mas não reivindicada

Se um pull request mesclado cita uma issue financiada, mas o autor nunca o envia:

1. No dia 26 de cada mês, o Gitpay envia um e-mail ao autor do pull request lembrando de reivindicar a recompensa.
2. Depois de dois lembretes, na execução seguinte o Gitpay reembolsa a recompensa aos patrocinadores.

## Quando ninguém resolve a issue

Escreva para [contact@gitpay.me](mailto:contact@gitpay.me) para pedir o reembolso da recompensa, ou use em **Pagamentos** a opção de transferir a recompensa para outra issue. Veja [Reembolsos e disputas](/docs/br/disputes-and-refunds/).

## Próximos passos

- [Reembolsos e disputas](/docs/br/disputes-and-refunds/)
- [Envie uma solução](/docs/br/pull-requests/)
