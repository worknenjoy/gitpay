---
layout: doc
lang: br
role: maintainer
title: Validando entregas
subtitle: Como revisar, testar e aceitar entregas de forma consistente
tags: maintainer, validacao
---

#### Índice
{:.no_toc}
* TOC
{:toc}

## Defina "concluído" desde o início
Na descrição da issue, inclua:
- Comportamento esperado e casos de borda
- Como testar (manual e/ou automatizado)
- Requisitos de UX (prints, textos, responsividade)
- Restrições não funcionais (performance, segurança, acessibilidade) quando aplicável
- Notas de rollout ou migração quando as mudanças afetam usuários existentes

## Checklist de revisão
- Escopo: atende ao combinado
- Qualidade: código legível e consistente
- Segurança: sem problemas óbvios de dados/permissões
- Testes: adicionados/atualizados quando necessário
- Docs: atualizadas se houver mudança de comportamento

## Valide evidências, não suposições
- Reproduza os fluxos principais localmente ou no ambiente alvo.
- Confirme que screenshots/vídeos representam o código atual, não revisões desatualizadas.
- Verifique se as instruções de teste no PR podem ser executadas por outro revisor.
- Valide se as issues vinculadas e as descrições do PR estão alinhadas com o comportamento entregue.

## Gerencie rodadas de revisão de forma eficiente
1. Agrupe o feedback por prioridade (bloqueante vs. não bloqueante).
2. Referencie arquivos/linhas exatos ou checks falhando.
3. Confirme quando cada item bloqueante for resolvido.
4. Reexecute as etapas de validação críticas após as atualizações.

## Aceitação
Aceite/integre quando os requisitos acordados forem atendidos e as etapas de validação passarem.

Se a aceitação estiver bloqueada, forneça uma lista curta das mudanças necessárias restantes para que os contribuidores possam resolver a pendência rapidamente.
