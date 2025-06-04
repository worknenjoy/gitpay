---
layout: doc
title: Por onde começar?
subtitle: Entenda como contribuir com tarefas pelo Gitpay e ser recompensado
tags:
---

#### O que você vai ver aqui
{:.no_toc}
* TOC
{:toc}

O Gitpay é uma plataforma que oferece tarefas para projetos que utilizam Git. Essas tarefas costumam ser chamadas de *issues* no GitHub ou *incidentes* no Bitbucket.

Você pode trabalhar em tarefas disponíveis na plataforma de diversos projetos, inclusive do próprio Gitpay. Dessa forma a plataforma evolui utilizando as contribuições da comunidade.

Quem contribui para o projeto ajuda a construir *sua própria plataforma de trabalho* e aprende de forma colaborativa. A experiência adquirida pode ser aplicada em outros projetos.

As tarefas normalmente são pequenas e específicas, mas também podem envolver demandas maiores. Focamos em tarefas menores para reduzir riscos e facilitar testes e integrações.
No Gitpay as tarefas passam por diversas validações seguindo as melhores práticas de desenvolvimento ágil. Contribuindo você aprende como projetos podem ser mantidos de forma sustentável e colaborativa, mesmo em equipes remotas.

## O que eu preciso saber?
Você não precisa dominar todos os conceitos para contribuir e receber recompensas. Basta estar disposto a aprender.

Trabalhamos com práticas como desenvolvimento ágil, Scrum, extreme programming, open source, releases, pull requests, integração contínua e TDD. Essas práticas também são recomendadas para os projetos cadastrados na plataforma.

O Gitpay envolve um processo de recompensa e contribuição por projetos que usam o Git. Ele transforma o Git numa ferramenta de trabalho e pagamento pela realização de tarefas. Diferente de uma tarefa ou projeto que um cliente ofereça, aqui ela passa a fazer parte de um ciclo de desenvolvimento que é claro para quem desenvolve, e que no fim se torna claro para quem usa também.

As tarefas geralmente seguem um padrão que melhora através do tempo para detalhar da melhor forma como resolver aquele problema ou criar aquela funcionalidade. Temos screenshots e detalhes de como reproduzir cenários usando as boas práticas que as plataformas Git usam.

Muitas vezes, partes destes cenários e detalhes da tarefa também estão ligados a processos automatizados. Sendo assim, para alguns casos temos como fazer análises na proposta de mudança, que precisa passar nos testes automatizados de diferentes níveis de acordo com o projeto.

Sendo assim, seu código é verificado para adequar aos padrões do projeto em questão, e até testes de interface automatizados podem ser realizados, para garantir que antes mesmo de ser analisado por alguém, a qualidade mínima necessária para ir para produção é atendida.

## O conceito de entrega baseada no manifesto ágil

Com o Gitpay, você trabalha em uma tarefa passando pelo processo de desenvolvimento ágil, com integração contínua de tarefa por tarefa, que pode ser distribuída em times de diversas partes.

Isto significa que cada tarefa quando enviada através de um *Pull Request* vai para produção após aprovada. O contrato do Gitpay são processos já existentes no Git para validar um trabalho. 

{% include image.html img="https://alexandremagno.net/wp-content/uploads/2018/09/Global-Business-Deals-Venn-Diagram.png" style="wide" lightbox="true" alt="Alt for image" caption="Image in lightbox" %}

## Como contribuir na prática e ser recompensado
Vamos mostrar de forma resumida como funciona o processo a partir do momento em que você demonstra interesse por uma tarefa. Depois de se cadastrar no Gitpay podemos enviar propostas tanto da plataforma quanto de clientes que disponibilizam demandas de seus projetos.

As tarefas podem ter origem em projetos open source ou privados. Pessoas interessadas podem investir na solução, então a recompensa pode ser financiada por várias fontes.

O Gitpay atende tanto usuários individuais quanto empresas.

Navegando pela plataforma ou recebendo notificações você pode manifestar interesse e iniciar a solução da tarefa.

Por exemplo, imagine a solicitação de adicionar um favicon ao site. O favicon é um pequeno ícone exibido na barra de endereços do navegador.

Suponha que essa tarefa tenha sido criada a partir de uma issue no GitHub. A solução seria apenas adicionar uma linha no *header* do site com a referência do favicon. O código do site estaria hospedado em um repositório do GitHub.

#### Interesse em uma tarefa

Você primeiro chega até a tarefa: [https://gitpay.me/#/task/64](https://gitpay.me/#/task/64)
Nessa página você pode demonstrar interesse e o criador da tarefa será notificado.
> Não hesite em se candidatar para quantas tarefas quiser. Caso não seja escolhido em uma, haverá outras oportunidades.

#### Escolhido
Se você for escolhido, pode iniciar a tarefa.
Dependendo da tarefa, pode ser necessário receber instruções adicionais para acessar o projeto.

## Criando um fork
O primeiro passo para trabalhar em um projeto é realizar um *fork*. Com essa "cópia" você faz as modificações e ao final envia de volta para integração na base principal.
O fork serve para que você trabalhe nas mudanças até que estejam prontas para integrar o projeto.
Enquanto você trabalha na tarefa o projeto pode sofrer atualizações. Mantenha seu fork sincronizado para evitar conflitos na hora de integrar o código.

Vamos supor que seja o próprio projeto do Gitpay esta tarefa, sendo assim, teríamos: https://github.com/worknenjoy/gitpay/issues/12

Precisaríamos seguir as instruções para iniciar o projeto em: http://github.com/worknenjoy/gitpay

E rodaríamos o projeto com os seguintes comandos:

Frontend: `npm run dev`

Backend (node.js): `npm run start:dev`

Em seguida, iríamos para o código fonte do seguinte arquivo:

File: [https://github.com/worknenjoy/gitpay/blob/master/frontend/public/index.html](https://github.com/worknenjoy/gitpay/blob/master/frontend/public/index.html)
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
Com a solução implementada, faça commit e push para o seu repositório.

> Não se esqueça de executar `npm run test` e `npm run lint` para garantir que o código está nos padrões do projeto.


Para este projeto o pull request deve ser aberto em [https://github.com/worknenjoy/gitpay/pulls](https://github.com/worknenjoy/gitpay/pulls)

Após abrir o Pull Request poderemos solicitar ajustes. Faça as correções necessárias até chegar à solução final.

Depois de aprovado seu código é integrado e você recebe a recompensa pela tarefa.
