---
layout: doc
title: Running the Gitpay project
subtitle: Learn how to contribute to the Gitpay core and evolve the platform
author: Alexandre Magno
tags:
---

#### What you will learn here
{:.no_toc}
* TOC
{:toc}

## Running the project

### Frontend server
`npm run dev`

### Backend (node.js)
`npm run start:dev`

After starting both services you can access the application at http://localhost:8082

### Using Docker

We received a great community contribution to support Docker and make it easier to run a local environment for development.

### Requirements

* Docker Engine
* Docker Compose

### Ubuntu

#### Installing

* Docker Engine: https://docs.docker.com/install/linux/docker-ce/ubuntu/
* Docker Compose: https://docs.docker.com/compose/install/

#### Running the project from Docker images

##### Development environment

Run `docker-compose up`

Then open the application at http://localhost:8082

##### Running tests

Run `docker-compose -f docker-compose.test.yml up`
