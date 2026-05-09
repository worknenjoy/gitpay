---
layout: doc
lang: br
role: maintainer
title: Liberando recompensas
subtitle: Quando e como liberar pagamento após a aceitação
tags: maintainer, pagamentos
---

#### Índice
{:.no_toc}
* TOC
{:toc}

## Quando liberar
Libere a recompensa após a entrega ser aceita conforme seu fluxo (normalmente após merge, ou após aprovação explícita).

Use uma regra clara por repositório (por exemplo: "liberar após merge na branch padrão") para que os contribuidores saibam exatamente quando o pagamento é acionado.

## O que conferir antes
- O PR atende ao escopo combinado
- Validações passaram (CI + checagens manuais)
- A entrega funciona no ambiente alvo
- Qualquer feedback bloqueante foi resolvido e confirmado
- Documentação ou notas de migração necessárias estão presentes

## Fluxo sugerido de liberação
1. Poste um comentário de aceitação resumindo o que foi validado.
2. Confirme o valor do pagamento e o destinatário.
3. Acione a liberação usando o fluxo acordado no projeto.
4. Compartilhe a confirmação da liberação na thread da issue/PR.

## Se o escopo mudou durante a entrega
- Compare a entrega final com o escopo aprovado mais recente.
- Se trabalho extra foi adicionado, confirme se está incluído na recompensa atual.
- Se parte do escopo ficou de fora, esclareça o que resta para uma tarefa de acompanhamento.

## Comunicação
Se não puder aceitar a entrega, descreva o que está faltando e o que seria necessário para aceitá-la.

Mantenha as mensagens específicas e acionáveis para que os contribuidores possam resolver os problemas sem precisar adivinhar.
