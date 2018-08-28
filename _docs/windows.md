---
layout: doc
title: O poder e a importância dos Pull Requests
subtitle: Como o Pull Request é importante e peça chave para integração de sua tarefa
author:
tags:
---

#### O que você vai ver aqui
{:.no_toc}
* TOC
{:toc}

Os Pull Requests são nossos contratos para integração da mudança e finalização da tarefa. Ele contém todas as modificações que você realizou e tem uma poderosa ferramenta, nas diferentes plataformas como Github e Bitbucket, para permitir avaliações da mudança.

Por lá também acontece os feedbacks, comentários e até trabalho em conjunto, para a partir dali, após aprovado, o código.

Baixe um (resumo prático do git (em inglês))[http://rogerdudler.github.io/git-guide/files/git_cheat_sheet.pdf]

## Testes automatizados para cada Pull Request

Quando o Pull Request é enviado, ele é analisado por testes automatizados, antes mesmo de ser revisado, ele precisa passar nestes teste para ter a mínima qualidade aceitável para ser integrado.

Por favor, caso ele não seja bem sucedido nestas verificações, você pode realizar os ajustes e enviar novamente para sua branch, que para cada push realizado, o Pull Request é atualizado.

## O que são Pull Requests?

Pull Requests são requisições ou entrega de uma tarefa que foi desenvolvida de um projeto em que desenvoledores colaboram entre si. Em todas plataformas que usam o Git, como Github, Gitlab, Bitbucket ou TeamFoundation possuem uma interface onde é possível discutir sobre aquela solução.

Essas discussões podem ser aprovadas e ações são executadas a partir dali, entre elas uma integração no repositório principal do projeto, que desencadeia um fluxo de envio destas mudanças para produção de uma forma eficiente e automatizada.

Os Pull Requests são mecanismos para que um desenvolvedor notifique membros que ele completou aquela funcionalidade. Esta funcionalidade geralmente vem de um incidente (ou issue) do repositório.

Quando você cita uma issue a partir de um Pull Request, é possível relacioná-los, e assim que o Pull Request é integrado, a issue é considerada finalizada.

## Anatomia de um Pull Request

Quando um Pull Request é realizado, o que você está fazendo é requisitar que outro desenvolvedor veja as mudanças que você quer realizar no repositório principal. Então esta mudança vem com quatro informações:

1. O repositório base
2. A branch base
3. O repositório de destino
4. A branch de destino

Sendo assim, no nosso modelo, geralmente você faz uma requisição para *integrar da sua branch*, criada a partir do seu fork, na branch principal (master) do projeto base. 

## Passos para criar um Pull Request

Pull Requests podem ser usados como envio de uma mudança no modelo de Fork, assim como outros modelos de workflow. Praticamente o Pull Request é a porta de entrada para o seu código virar realidade.

O processo geral para criação compreende os seguintes passos:

1. O desenvolvedor cria uma funcionalidade em uma branch dedicada no seu repositório após um fork do projeto;
2. O desenvolvedor realiza um `git push` para a branch do seu repositório (branch remota);
3. O desenvolvedor abre um Pull Request (no Github ou Bitbucket);
4. O código é revisado, discutido e é possível dar feedbacks e fazer revisões sobre partes específicas da mudança a ser realizda;
5. Quem mantém o projeto realiza um `merge` desta funcionalidade que irá ser integrada no repositório oficial e o Pull Request é fechado

Você agora sabe o que é necessário para enviar um Pull Request. Quando você é escolhido para uma tarefa, esta é a etapa que avaliamos a solução e que valida a tarefa para concluirmos com a recompensa.
