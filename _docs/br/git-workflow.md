---
layout: doc
title: Trabalhando com o Git Workflow
subtitle: O processo de entrega integrado de uma tarefa no Gitpay
author: Alexandre Magno
tags: 

---
#### O que você vai aprender aqui

{:.no_toc}
* TOC
{:toc}

O Git Workflow é um processo usado no desenvolvimento de software para validar tarefas em projetos open source ou privados.

Ele define diretrizes e processos de trabalho com Git para times distribuídos.

## O nosso Workflow

Utilizamos o processo de contribuição em um repositório Git para validar o trabalho. O Git funciona como nosso contrato. Mudanças passam por testes automatizados e validações em vários ambientes antes de serem integradas.

## Git Workflow

O Git Workflow recomenda como usar o Git para finalizar tarefas de maneira consistente e produtiva.

Quando usamos Git para controle de versão seguimos um fluxo de trabalho comum. Ele garante que times em grande escala estejam na mesma página e define quando a tarefa é considerada finalizada.

Existem diversos tipos de workflow para equipes. Aqui apresentamos o que usamos no Gitpay e que também é adotado por muitas empresas.

> Workflows são formas de apresentar um processo de trabalho no desenvolvimento de software ágil. Ele se baseia em regras claras e concretas de como trabalhamos em projetos usando o Git como controle de versão.

## Forking Workflow

![](/uploads/img-multidev-forking-800-2.png)

Este é o processo que usamos para integrar tarefas. No Forking Workflow você cria um repositório a partir do principal, faz suas alterações e depois abre um Pull Request.

Toda mudança passa por um processo de aprovação que segue as melhores práticas de desenvolvimento.

## Avaliando as mudanças

Avaliamos as mudanças seguindo as seguintes premissas:

1. Focamos no valor da entrega, não em cada detalhe.
2. Somos flexíveis para discutir melhores soluções, mas uma tarefa bem descrita evita aumento de escopo.
3. Adotamos desenvolvimento ágil e incentivamos testes automatizados, principalmente em correções de bugs.
