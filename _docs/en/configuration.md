---
layout: doc
title: Como rodar o projeto do Gitpay
subtitle: Veja como contribuir com o core do Gitpay para melhorar e evoluir na plataforma
author: Alexandre Magno
tags:
---

#### O que você vai ver aqui
{:.no_toc}
* TOC
{:toc}

## Como rodar o projeto

### Frontend server
`npm run dev`

### Backend (node.js)
`npm run start:dev`

Você então pode acessar o projeto em http://localhost:8082

### Usando Docker

Tivemos uma ótima contribuição da comunidade para suportarmos o docker e facilitar o desenvolvimento e execução do ambiente local para desenvolvimento.

### Requisitos

* Docker Engine
* Docker Compose

### Ubuntu

#### Instalando

* Docker Engine: https://docs.docker.com/install/linux/docker-ce/ubuntu/
* Docker Compose: https://docs.docker.com/compose/install/

#### Executando o projeto das imagens do docker

#### Development environment

`Run docker-compose up`

Abra então o projeto em http://localhost:8082

#### Para testar

`Run docker-compose -f docker-compose.test.yml up`
