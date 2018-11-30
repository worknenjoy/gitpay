[![Waffle.io - Columns and their card count](https://badge.waffle.io/worknenjoy/gitpay.png?columns=all)](https://waffle.io/worknenjoy/gitpay?utm_source=badge)
# gitpay
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/398ca838e49e4db2a537feb5568e7a87)](https://app.codacy.com/app/alexanmtz/gitpay?utm_source=github.com&utm_medium=referral&utm_content=worknenjoy/gitpay&utm_campaign=badger)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay?ref=badge_shield)

Freelancing with development workflow

(https://gitpitch.com/worknenjoy/gitpay)[https://gitpitch.com/worknenjoy/gitpay]

## What is Gitpay?

We offer a marketplace for developersand platforms that use git for on demand project needs, using the Git Workflow as contract of deliver issues solved.

* You can complete tasks with open collaboration and receive bounties for it
* Companies can receive reports, fixes and enhancements about the project by developers and offer bounties to complete required tasks

## Who is contributing
[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/0)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/0)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/1)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/1)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/2)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/2)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/3)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/3)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/4)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/4)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/5)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/5)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/6)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/6)[![](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/images/7)](https://sourcerer.io/fame/alexanmtz/worknenjoy/gitpay/links/7)



## Requirements

* Node.js (currently at v8.6.0)
* React with webpack


## Running tests

To run the test: 
`npm run migrate-test` (first time)

`npm run test` (to run the tests)

## Env to do some actions

For fully integration with api services used by the platform, you will need the api keys. *You should make a copy of your `.env.example` to `.env`* with the right credentials. Please let me know if you need any of those to solve a issue (mail tarefas@gitpay.me)


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

### Ubuntu

#### Installing 
- Docker Engine: https://docs.docker.com/install/linux/docker-ce/ubuntu/
- Docker Compose: https://docs.docker.com/compose/install/

#### Running
##### Development environment 
- Run `docker-compose up`
- Open your browser at http://localhost:8082
##### Test environment
- Run `docker-compose -f docker-compose.test.yml up`

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay?ref=badge_large)
