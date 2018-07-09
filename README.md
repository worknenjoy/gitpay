[![Waffle.io - Columns and their card count](https://badge.waffle.io/worknenjoy/gitpay.png?columns=all)](https://waffle.io/worknenjoy/gitpay?utm_source=badge)
# gitpay
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/398ca838e49e4db2a537feb5568e7a87)](https://app.codacy.com/app/alexanmtz/gitpay?utm_source=github.com&utm_medium=referral&utm_content=worknenjoy/gitpay&utm_campaign=badger)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay?ref=badge_shield)

Freelancing with development workflow

## What is Gitpay?

We offer a marketplace for developersand platforms that use git for on demand project needs, using the Git Workflow as contract of deliver issues solved.

* You can complete tasks with open collaboration and receive bounties for it
* Companies can receive reports, fixes and enhancements about the project by developers and offer bounties to complete required tasks


## Requirements

* Node.js (currently at v8.6.0)
* React with webpack


## Running tests

To run the test: 
`npm run migrate` (first time)

`npm run test` (to run the tests)

## Env to do some actions

For fully integration with api services used by the platform, you will need the api keys. *You should make a copy of your `.env.example` to `.env`* with the right credentials. Please let me know if you need any of those to solve a issue (mail tarefas@gitpay.me)


## Run migration

To run the migrations

`npm run migrate`

For user as example

`sequelize migration:create --name users`


## Postgres

If you don't want install a Postgres server in your local environment, you can use a docker container.

### Requirements

- `docker`
- `docker-compose`

### Run

To run the Postgres container execute

`docker-compose up`

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay?ref=badge_large)
