---
layout: doc
title: Como configurar um repositório
categories: [Getting Started, Troubleshooting]
author: John Black
tags: featured
---

#### O que você vai ver aqui
{:.no_toc}
* TOC
{:toc}

<a href="{{site.github.repository_url}}/blob/gh-pages/{{page.path}}">Editar esta página</a>

## Como trabalhar em um repositório de um projeto

Quando um repositório já está definido, geralmente já criado pelo cliente, você precisa fazer um *clone do projeto*.

Para isto, execute: `git clone <url do repositorio>`

Para saber qual o repositório do projeto, basta ir no Github na opção *Clone or download*

Quando você realiza um clone, você tem a cópia do projeto criada em um diretório.

Quando um clone é executado, a última versão do repositório é criada.

Para obter as mudanças do repositório e ficar com a última versão, você deve executar `git pull origin master`

## Versões do projeto

Quando você realiza um fork (basta ver a opção Fork no Github, dizendo quantos forks daquele projeto já foram feitos), você obtem uma nova versão sua.

Para clonar o seu projeto criado, você deve executar o seguinte comando: `git clone <url do repositorio>`

> Quando você realiza esta etapa, você tem uma versão (geralmente o origin) e o projeto original seguiu o seu ciclo de vida em outro caminho

A partir dali, o seu projeto que veio a partir do projeto principal tem um novo endereço e você pode cloná-lo também. Isto é o recomendável.

No entanto, quando isto acontece, você perdeu as mudanças do projeto original, e quando você envia as mudanças, você na verdade está enviando para o seu repositório.

> Uma das principais vantagens do Git é poder ter vários repositórios a partir de outros

Para ter ainda as atualizações do projeto principal, você irá precisar adicionar um *upstream*. Este termo define o projeto principal

Sendo, assim, você precisará adicionar um novo remote com a referência para o upstream com este comando: `git remote add upstream <url do repositorio>`

Com isto, quando você executa um `git pull origin master` você estará obtendo o seu projeto e executando um `git pull upstream master` você está obtendo as mudanças do projeto principal.

## Realizando modificações

O Git Workflow no modelo Fork diz que você trabalha na sua versão independente e envia as mudanças para o repositório principal através de Pull Requests.

Para se organizar melhor, é sempre bom no seu próprio repositório você usar um modelo de desenvolvimento baseado em branch. Então, para iniciar qualquer tarefa você execute:

`git branch nome-da-branch`

Depois para entrar nesta branch você roda: `git checkout nome-da-branch`

A partir daí você realiza modificações necessárias, faz um commit e então você pode enviar como uma branch para seu repositório

## Sincronizar branchs com o repositório principal

Quando você está no seu master, você pode usá-lo como uma branch principal, onde você não realiza nenhuam alteração, e sim o usa como um espelho do repositório principal.

Assim, você pode executar sempre do seu master: `git pull upstream master`

Então, a partir da sua branch você pode executar `git rebase master`

## Enviando modificações

Uma vez, estando sem conflitos e com sua versão no master, você pode enviar como uma branch do seu repositório com o comando: `git push origin sua-branch`

Quando você entrar no Github, na página do fork, você verá uma opção para criar um pull request a partir desta branch remota, e assim você cria um pull request que serve como uma solicitação para que seu código seja integrado ao seu projeto

Uma vez que o código seja aprovado, quando você obter novamente as mudanças do upstream, ele estará com o seu código e aquela branch poderá ser apagada e o seu projeto está em dia com o projeto principal novamente!

Saiba mais em [https://git-scm.com/book/pt-br/v1/Ramifica%C3%A7%C3%A3o-Branching-no-Git-Fluxos-de-Trabalho-com-Branches](https://git-scm.com/book/pt-br/v1/Ramifica%C3%A7%C3%A3o-Branching-no-Git-Fluxos-de-Trabalho-com-Branches)



