---
layout: doc
lang: br
role: maintainer
title: Perguntas gerais
subtitle: Dúvidas comuns de maintainers
tags: maintainer, faq
---

#### Índice
{:.no_toc}
* TOC
{:toc}

## Como reduzir retrabalho no PR?
Use uma issue com critérios de aceitação claros, prints e passos de teste.

Além disso:
- Peça aos contribuidores que abram PRs em rascunho (draft) cedo.
- Mantenha uma única fonte de verdade para os requisitos (a issue).
- Separe feedbacks obrigatórios de sugestões opcionais.

## Preciso de CI?
É altamente recomendado. Mesmo um pipeline básico de lint/test acelera reviews e deixa critérios mais objetivos.

No mínimo, automatize verificações que protejam sua branch principal (lint, testes e build quando relevante).

## E se a entrega estiver boa, mas incompleta?
Deixe feedback acionável e, se possível, aponte checks falhando ou comportamentos faltantes.

Se a maior parte do escopo estiver concluída, confirme se o trabalho restante deve ser:
1. Concluído na mesma tarefa antes do pagamento, ou
2. Dividido em uma nova issue com financiamento separado.

## Devo fazer o merge primeiro ou liberar o pagamento primeiro?
Prefira seguir uma regra documentada no repositório (por exemplo, fazer merge primeiro e depois liberar) e aplicá-la de forma consistente.

## Como manter as decisões de pagamento justas?
Use o mesmo checklist de aceitação para todos os contribuidores, mantenha as notas de review públicas na PR/issue e baseie as decisões de liberação em critérios acordados, não em expectativas informais.
