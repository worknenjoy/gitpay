---
layout: doc
title: Por onde começar?
subtitle: Entenda como contribuir com tarefas pelo Gitpay e ser recompensado
tags: featured othertag
---

#### O que você vai ver aqui
{:.no_toc}
* TOC
{:toc}

O Gitpay é uma plataforma que oferece tarefas que usam qualquer outro sistema Git para entrega de alguma parte do projeto. Estas tarefas são muitas vezes chamadas de Issue, como por exemplo no Github, e Incidentes, no Bitbucket.

Você pode trabalhar em tarefas disponíveis na plataforma, de diferentes projetos e do próprio Gitpay. Isto quer dizer que a plataforma usa o seu próprio processo para evoluir suas features, utilizando as contribuições dos interessados.

Neste caso, quem contribui para o próprio projeto está ajudando a construir *a sua própria plataforma de trabalho independente* e aprender de forma colaborativa. Contribuições de projetos contam como experiência para outros projetos.

Estas tarefas são geralmente dividida em mudanças pequenas e específicas, mas também pode significar tarefas maiores, parte de um projeto. A vantagem de sempre buscar tarefas menores, é poder diminuir o risco e facilitar os testes e integrações necessárias para validar a tarefa.
Com o Gitpay, as tarefas podem ser validadas em diversos níveis para serem consideradas como prontas. Estes processos seguem as melhores práticas de desenvolvimento de software ágil, já consolidados e usados em diversas empresas. Contribuindo com o Gitpay, você também estará aprendendo como empresas podem funcionar totalmente remotas e projetos podem ser mantidos de maneira sustentável, colaborativo e com apoio da comunidade. 

## O que eu preciso saber?
Você não precisa saber destes conceitos para contribuir, usar o Gitpay e receber recompensas. No entanto, se não souber os conceitos abordados aqui, você tem que desejar ou estar aberto para aprender.

Conceitos como desenvolvimento ágil, scrum, extreme programming, open source, releases, Pull Requests, integração contínua, build pipeline e TDD, são parte da composição do processo de desenvolvimento que o Gitpay usa para os projetos cadastrados.

O Gitpay envolve um processo de recompensa e contribuição por projetos que usam o Git. Ele transforma o Git numa ferramenta de trabalho e pagamento pela realização de tarefas. Diferente de uma tarefa ou projeto que um cliente ofereça, aqui ela passa a fazer parte de um ciclo de desenvolvimento que é claro para quem desenvolve, e que no fim se torna claro para quem usa também.

As tarefas geralmente seguem um padrão que melhora através do tempo para detalhar da melhor forma como resolver aquele problema ou criar aquela funcionalidade. Temos screenshots e detalhes de como reproduzir cenários usando as boas práticas que as plataformas Git usam.

Muitas vezes, partes destes cenários e detalhes da tarefa também estão ligados a processos automatizados. Sendo assim, para alguns casos temos como fazer análises na proposta de mudança, que precisa passar nos testes automatizados de diferentes níveis de acordo com o projeto.

Sendo assim, seu código é verificado para adequar aos padrões do projeto em questão, e até testes de interface automatizados podem ser realizados, para garantir que antes mesmo de ser analisado por alguém, a qualidade mínima necessária para ir para produção é atendida.

## O conceito de entrega baseada no manifesto ágil

Com o Gitpay, você trabalha em uma tarefa passando pelo processo de desenvolvimento ágil, com integração contínua de tarefa por tarefa, que pode ser distribuída em times de diversas partes.

Isto significa que cada tarefa quando enviada através de um *Pull Request* vai para produção após aprovada. O contrato do Gitpay são processos já existentes no Git para validar um trabalho. 

{% include image.html img="image1.png" style="wide" lightbox="true" alt="Alt for image" caption="Image in lightbox" %}

## Como contribuir na prática e ser recompensado
Vamos mostrar de uma forma bem geral como é o processo a partir do interesse de uma tarefa. Quando você cadastra no Gitpay, podemos enviar propostas de tarefas da plataforma e também de clientes que disponibilizam tarefas de seus projetos.

Estas tarefas podem vir de várias fontes, de projetos Open Source, onde alguém quer que ela seja resolvida, e a partir disto pessoas interessadas na resolução podem investir em projetos. Isto mesmo, a recompensa da tarefa pode vir como investimento de várias fontes que desejam que aquela tarefa seja resolvida.

Sendo assim, o Gitpay é para usuários e empresas.

Você então, navegando pela plataforma na listagem de tarefas ou recebendo notificações sobre tarefas, você pode manifestar interesse em iniciá-la e começar a resolução.

Pegando um exemplo que poderia ser real, temos por exemplo o pedido de um cliente de colocar um favicon em seu site. O favicon é um ícone que aparece como uma miniatura do site na barra de endereços de um navegador.

Vamos supor que a tarefa tenha sido criada na plataforma a partir de uma issue que descreve esta necessidade em um repositório no Github, e ela seja tão simples quanto colocar uma linha no header do documento de um site que esteja na plataforma com a referência para o favicon. O código do site se encontra em um repositório do Github.

#### Interesse em uma tarefa

Você primeiro chega até a tarefa: https://gitpay.me/#/task/64

Nela, você pode demonstrar interesse e quem criou o tarefa será notificado.

> Não se acanhe em pegar quantas tarefas tiver interesse e se não for escolhido, o processo é dinâmico e garantiremos que você tenha oportunidade para diferentes tipos de tarefas e desafios

#### Escolhido

Você então é escolhido para iniciar a tarefa.

Dependendo da tarefa, você poderá ter que receber mais informações para acessar o projeto.

## Criando um fork

O primeiro passo para começar a trabalhar em um projeto de fato é quando realizamos um Fork. Quando você realiza este passo você obtem uma ramificação do projeto. Com esta "cópia" você pode realizar as modificações para enviar de volta ao projeto e ser integrado na base principal.
A versão do fork é para você realizar as modificações para quando concluídas, possam integrar o projeto.

O projeto pode, enquanto você estiver trabalhando em uma tarefa, passar por modificações, correção de bugs e novas funcionalidades, principalmente se a tarefa tiver uma longa duração. Quando você tem um fork, você saiu da raíz do projeto e ele seguiu outro caminho.
Você pode sempre obter a versão atualizada do projeto e deixar para o git sincronizar as mudanças. Assim você está em dia com as modificações e não teremos nenhum conflito para ter seu código integrado.

Vamos supor que seja o próprio projeto do Gitpay esta tarefa, sendo assim, teríamos: https://github.com/worknenjoy/gitpay/issues/12

Precisaríamos seguir as instruções para iniciar o projeto em: http://github.com/worknenjoy/gitpay

E rodaríamos o projeto com os seguintes comandos:

Frontend: `npm run dev`

Backend (node.js): `npm run start:dev`

Em seguida, iríamos para o código fonte do seguinte arquivo:

File: https://github.com/worknenjoy/gitpay/blob/master/frontend/public/index.html
```html
<head>
  <meta charset="utf-8">
  <meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no' />
  <title>GitPay - Freelancing with git</title>
  <script src="https://js.stripe.com/v3/"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
  <link rel="stylesheet" href="app.css">
</head>
```

E acrescentaríamos a linha: `<link rel="shortcut icon" type="image/png" href="favicon.png">`

E teríamos o arquivo da seguinte forma:

```html
<head>
  <meta charset="utf-8">
  <meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no' />
  <title>GitPay - Freelancing with git</title>
  <script src="https://js.stripe.com/v3/"></script>
  <link rel="shortcut icon" type="image/png" href="favicon.png">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
  <link rel="stylesheet" href="app.css">
</head>
```

Esse é o resultado final do seu trabalho, você pode verificar na home page que o favicon foi alterado.

Quer começar a aprender na prática? Essa é uma tarefa de teste, você pode enviar de fato um Pull Request com esta mudança para a gente.


## Enviando seu Pull Request
Agora que você tem a solução implementada, você deve efetuar um commit e um push para o seu repositório.

> Não se esqueça de executar os testes como `npm run test` e `npm run lint` que verificam automaticamente se seu código está nos padrões deste projeto


Para este projeto, no caso sendo do Gitpay, o pull request será enviado em https://github.com/worknenjoy/gitpay/pulls

Após o Pull Request ser enviado, podemos avaliar a mudança e pedir modificações se for necessário, e você passa fazer as correções solicitadas e os pull requests são atualizados, até chegar na solução final.

Uma vez aprovado, o seu código é integrado, aprovado e você recebe o pagamento daquela recompensa.
