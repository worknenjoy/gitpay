![Gitpay](https://alexandremagno.net/wp-content/uploads/2019/05/gitpaydesigntop.png)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/398ca838e49e4db2a537feb5568e7a87)](https://app.codacy.com/app/alexanmtz/gitpay?utm_source=github.com&utm_medium=referral&utm_content=worknenjoy/gitpay&utm_campaign=badger)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay?ref=badge_shield) [![first-timers-only](https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)](https://www.firsttimersonly.com/)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/worknenjoy/gitpay.svg)](http://isitmaintained.com/project/worknenjoy/gitpay "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/worknenjoy/gitpay.svg)](http://isitmaintained.com/project/worknenjoy/gitpay "Percentage of issues still open")

An Open Source Bounty platform to solve issues from Git, since open source and libraries to real projects demands

https://gitpitch.com/worknenjoy/gitpay

### Slack channel

We have a slack channel to collaborate with solutions and to help you, and to be fun

[Join us on slack](https://join.slack.com/t/gitpay/shared_invite/enQtNDg4NzM2NDI5NDg4LWE1MzZlM2VhOGJhM2QyNmFhMjlhNzQyZjY0NjcwOGVlMGU1ZmIyMDZmOTEwOTBjNWU1ZTA0NjBlYjUyZGE2ZWU) 

## What is Gitpay?

We offer a marketplace for contributors and projects that use git for on demand project needs, using the Git Workflow as contract to solve issues and reward contributors.

* You can complete tasks with open collaboration and receive bounties for it
* Companies can receive reports, fixes and enhancements about the project by developers and offer bounties to complete required tasks

## Who is contributing
[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/0)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/0)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/1)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/1)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/2)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/2)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/3)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/3)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/4)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/4)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/5)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/5)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/6)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/6)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/7)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/7)

### Join the team

Join the Github team to be assigned to tasks and to be part of the core.

[Join the Gitpay team on Github](https://bit.ly/2Irhfqk)

## Requirements

* Node.js (currently at v8.6.0)
* React with webpack


## Running tests

To run the test:
`npm run migrate-test` (first time)

`npm run test` (to run the tests)

## Env to do some actions

For fully integration with api services used by the platform, you will need the api keys. *You should make a copy of your `.env.example` to `.env`* with the right credentials. Please let me know if you need any of those to solve a issue (mail tarefas@gitpay.me)

You can do this with: `cp .env.example .env`

### Database

#### Install postgres
1. install: `brew install postgres` (mac)
2. start the service: `brew services start postgresql`
3. create postgres user: `createuser postgres -s`
4. Login into postgres cli: `psql -U postgres`
5. Create test database: `create database gitpay_test;`
6. Create a dev database: `create database gitpay_dev;`
7. Exit: `\q`

## Run migration

To run the migrations

`npm run migrate`

To create a new migration

`sequelize migration:create --name modelname`

## Run project

### Frontend server
`npm run dev`

### Backend (node.js)
`npm run start:dev`

Then you can access at http://localhost:8082

## Docker

### Requirements

- `Docker Engine`
- `Docker Compose`

### **Linux**
### Ubuntu

#### Installing
- Docker Engine: https://docs.docker.com/install/linux/docker-ce/ubuntu/
- Docker Compose: https://docs.docker.com/compose/install/

### Arch Linux / Manjaro / Antergos

#### Installing
- Docker and Docker Compose: `sudo pacman -S docker docker-compose`

#### Running
##### Development environment
- Run `docker-compose up`
Then you can access at http://localhost:8082
##### Test environment
- Run `docker-compose -f docker-compose.test.yml up`

### First timers
Here you can start to learn how to create your first pull request and start to be a contributor:
[https://github.com/worknenjoy/gitpay/issues/247](https://github.com/worknenjoy/gitpay/issues/247)
- [Prerna Verma]( https://github.com/PrernaVerma ) 
- [I Gede Wicaksana]( https://github.com/wicaker ) 
- [Luísa Barros]( https://github.com/luisabfs )
- [Caio Reis]( https://github.com/caioreis123 )


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay?ref=badge_large)
