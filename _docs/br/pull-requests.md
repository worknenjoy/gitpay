---
layout: doc
lang: br
role: contributor
title: Envie uma solução
subtitle: As cinco verificações que um pull request precisa passar para a recompensa ser paga
tags: contributor, bounties, pull-requests, solutions
---

#### Índice
{:.no_toc}
* TOC
{:toc}

Quando seu pull request resolve uma issue financiada, você o envia ao Gitpay como **solução**. O Gitpay verifica o pull request no GitHub. Se todas as verificações passarem, a recompensa é transferida para você automaticamente.

## Envie uma solução

1. Abra a issue no Gitpay e selecione **Enviar solução**.
2. Cole a URL do pull request, ou escolha em **Meus pull requests** se estiver conectado ao GitHub.
3. O Gitpay faz as verificações e mostra o resultado de cada uma.
4. Selecione **Enviar Solução**.

Você pode enviar a solução antes de o pull request ser mesclado. Ela fica como **Aguardando fusão**, e você pode usar **Editar Solução** para refazer as verificações depois do merge.

## As verificações

| Verificação | Como passar |
|---|---|
| **Você está conectado ao GitHub** | Entre no Gitpay com o GitHub. |
| **Você é o autor deste pull request no GitHub** | Envie um pull request que você abriu, com a conta do GitHub com que entrou. |
| **O pull request foi mesclado** | O pull request precisa estar mesclado (não só fechado) no **mesmo repositório** da issue. |
| **A issue é citada no pull request** | Cite a issue na descrição do pull request, por exemplo `Fixes #123` ou a URL completa da issue. |
| **A issue está fechada no GitHub** | A issue precisa estar fechada. Usar `Fixes #123` na descrição fecha a issue automaticamente no merge. |

O Gitpay também mostra se **a recompensa está disponível**. Se ainda não há recompensa, você pode enviar a solução mesmo assim e pedir pagamento ao mantenedor.

## Status do pagamento

| Status | Significado |
|---|---|
| **Pronto para pagar** | Todas as verificações passaram. A recompensa é transferida. |
| **Aguardando fusão** | O pull request ainda não foi mesclado. O pagamento é liberado no merge. |
| **Não elegível** | Uma ou mais verificações falharam. |

Quando a recompensa é transferida, você recebe 92% da recompensa paga na sua conta de saque, e uma reivindicação aparece em **Receber pagamentos → Minhas Reivindicações**. Veja [Reivindicações](/docs/br/claims/).

## Se a transferência falhar

- **"Sua conta precisa ser atualizada para receber pagamentos"**: sua conta de saque não está ativa. Termine de [configurar seus saques](/docs/br/whop-payout-setup/), depois edite e reenvie a solução.
- Uma verificação que deveria passar falhou: compare o pull request com a tabela acima. As causas mais comuns são um pull request mesclado em um fork em vez do repositório original, e uma descrição que não cita a issue.

## Se você esquecer de enviar

Se o seu pull request foi mesclado e você nunca o enviou, o Gitpay manda um lembrete por e-mail no dia 26 de cada mês. Depois de dois lembretes, a recompensa é reembolsada aos patrocinadores. Envie assim que o pull request for mesclado.

## Próximos passos

- [Reivindicações](/docs/br/claims/)
- [Saques](/docs/br/payouts/)
- [Fluxo de trabalho com Git](/docs/br/git-workflow/)
