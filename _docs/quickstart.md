---
layout: doc
title: Trabalhando com o Git Workflow
subtitle: O processo de entrega intregado de uma tarefa no Gitpay
author: Alexandre Magno
tags: 

---
#### O que você vai aprender aqui

{:.no_toc}
* TOC
{:toc}

O Git Workflow é um processo já existente no desenvolvimento de software que usamos como base para validar uma tarefa de um projeto Open Source, ou até mesmo de forma interna em projetos privados.

Ele consiste em disseminar diretrizes e processos de trabalho com o Git para times distribuidos.

## O nosso Workflow

Usamos os processo de contribuição de um repositório git para validar o trabalho. O Git é o nosso contrato inteligente. A partir de uma integração de mudança que passa por testes automatizados e validações em vários ambientes, é possível realizar processos de trabalhos independnetes de forma integrada.

## Git Workflow

O Git Workflow é um processo e recomendação de como devemos usar o Git para finalizar tarefas de uma maneira consistente e produtiva. Ele nos encoraja a usar o Git de forma efetiva e consistente.

Trabalhando em projeto, quando usamos o Git para o controle de versão, temos um fluxo de trabalho tendo ele como base. Para garantir que times e projetos em grande escala estejam na mesma página, acordamos de ter o Git Workflow para considerar a tarefa como finalizada.

Há diversos tipos de Workflow para times, e aqui vamos falar do que usamos no Gitpay e que muitas empresas também usam

> Workflows são formas de apresentar um processo de trabalho no desenvolvimento de software ágil. Ele se baseia em regras claras e concretas de como trabalhamos em projetos usando o Git como controle de versão.

## Forking Workflow

![](/uploads/img-multidev-forking-800.png)

Este é o processo que usamos para integração das tarefas. No Forking Workflow, repositórios são criados a partir do principal onde contém a sua mudança. Você deve ser capaz de reproduzir um ambiente com o que você precisa para concluir aquela tarefa.

Toda mudança passa por um processo de aprovação. Este processo é concreto e segue as linhas das práticas de desenvolvimento.

## Avaliando as mudanças

Avaliamos as mudanças seguindo as seguintes premissas:

1. Não vamos nos atentar a detalhes, e sim no valor daquela entrega
2. Seremos sempre flexíveis e abertos a discutir melhores soluções, no entanto, uma tarefa bem descrita evita que o escopo aumente descontrolodamente
3. Adotamos o desenvolvimento ágil, então estimulamos o desenvolvimento juntamente com testes automatizados, principalmente na correção de bugs
