![Gitpay](https://alexandremagno.net/wp-content/uploads/2019/05/gitpaydesigntop.png)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3881c342cfde4bcebb5fbe87f7998743)](https://app.codacy.com/gh/worknenjoy/gitpay/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Financial Contributors on Open Collective](https://opencollective.com/gitpay/all/badge.svg?label=financial+contributors)](https://opencollective.com/gitpay) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay?ref=badge_shield) [![first-timers-only](https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)](https://www.firsttimersonly.com/)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/worknenjoy/gitpay.svg)](http://isitmaintained.com/project/worknenjoy/gitpay "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/worknenjoy/gitpay.svg)](http://isitmaintained.com/project/worknenjoy/gitpay "Percentage of issues still open")

Gitpay is an open-source platform that empowers collaboration and rewards contributions to open-source projects.

### Slack channel

We have a slack channel to collaborate with solutions and to help you, and to be fun

[Join us on slack](https://join.slack.com/t/gitpay-workspace/shared_invite/zt-1ru4j0duc-mOPFRxkhRyMgavlGdlghmw)

## What is Gitpay?

We offer a marketplace for contributors and projects that use git for on demand project needs, using the Git Workflow as contract to solve issues and reward contributors.

* You can complete tasks with open collaboration and receive bounties for it
* Companies can receive reports, fixes and enhancements about the project by developers and offer bounties to complete required tasks

## Who is contributing
This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/worknenjoy/gitpay/graphs/contributors"><img src="https://opencollective.com/gitpay/contributors.svg?width=890&button=false" /></a>

### Join the team

Join the GitHub team to be assigned to tasks and to be part of the core.

[Join the Gitpay team on GitHub](https://github.com/worknenjoy/gitpay/)

## Requirements

* Node.js (currently at v8.6.0)
* React with webpack


## Running tests

To run the test:
`npm run migrate-test` (first time)

`npm run test` (to run the tests)

## Setup environment

For fully integration with api services used by the platform, you will need the api keys. *You should make a copy of your `.env.example` to `.env`* with the right credentials. Please let me know if you need any of those to solve a issue (mail tarefas@gitpay.me)

You can do this with: `cp .env.example .env`

#### You need to run create the .env in order to run the project: `cp .env.example .env`

### Important
- Make sure to use Node v12 (you can use <a href="https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/"> Node Version Manager (NVM)</a> to manage and switch different Node versions)
- Don't forget to run `npm install` on the root and front-end folders

### Database

#### Install postgres (mac)
1. install: `brew install postgres`
2. start the service: `brew services start postgresql`
3. create postgres user: `createuser postgres -s`
4. Login into postgres cli: `psql -U postgres`
5. Create test database: `create database gitpay_test;`
6. Create a dev database: `create database gitpay_dev;`
7. Exit: `\q`

#### Install PostgreSQL (Linux - Ubuntu)
1. install: `sudo apt install postgresql`
2. start the service: `sudo service postgresql start`
3. create postgres user: `createuser postgres -s`
4. Login into postgres: `sudo -i -u postgres`
5. Access the postgres prompt: `psql`
6. Make sure postgres user has the correct password: `ALTER USER postgres WITH PASSWORD 'postgres';`
5. Create test database: `CREATE DATABASE gitpay_test;`
6. Create a dev database: `CREATE DATABASE gitpay_dev;`
7. Exit: `\q`

#### Install PostgreSQL (Windows)
1. Download: access `https://www.enterprisedb.com/downloads/postgres-postgresql-downloads` and download the exe file for windows;
2. Install: proceed the installation with the postgreSQL setup wizard; once it is requested to provide a password for the database superuser, type `postgres`.
3. Login into postgres: `psql -U postgres`
4. Make sure postgres user has the correct password: `ALTER USER postgres WITH PASSWORD 'postgres';`
5. Create test database: `CREATE DATABASE gitpay_test;`
6. Create a dev database: `CREATE DATABASE gitpay_dev;`
7. Exit: `\q`

## Run migration

To run the migrations

`npm run migrate`

To create a new migration

`sequelize migration:create --name modelname`

How to create new models
- For Many to Many
    1. Create migration for first model (table `organizations`)
    2. Create migration for second model (table `projects`)
    3. Create migration for joint model (table `organizations_projects`)
    4. Change in the model to `Project.belongsTo(models.Organization)`
    5. Change in the second model to `Organization.hasMany(models.Project)`

## Database seeding

For more information related to database seeding please refer: https://en.wikipedia.org/wiki/Database_seeding

To seed the database

`npm run seed`

For test environment

`npm run seed-test`

For exhaustive list of options available, refer `migration.js` in root directory

### For windows users:

- Go to line 42 in the `migrate.js` file and hardcode "seed" into the env var below:
`const migrationType = process.env.TYPE`
- So it will be: 
`const migrationType = "seed"`
- Then run the commands above

## Run project

### Frontend server
- first go to `frontend` folder: `cd frontend`
- Then run the server: `npm run dev`

### Backend (node.js)
`npm run start:dev`

Then you can access at http://localhost:8082

## Translation

Please don't change the translation files directly, they will be managed on Crowdin.
The only thing you need to do is run

`npm run translate`

on front-end and use the React Intl (https://formatjs.io/docs/react-intl/) library to give id and default text to your strings.

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
- [Unnatii](https://github.com/unnatii )
- [Prerna Verma]( https://github.com/PrernaVerma )
- [I Gede Wicaksana]( https://github.com/wicaker )
- [Luísa Barros]( https://github.com/luisabfs )
- [Caio Reis]( https://github.com/caioreis123 )
- [Shivam Latawa]( https://github.com/ShivamLatawa )
- [Md. Al Amin]( https://github.com/Alamin02 )
- [Siso]( https://github.com/sisohs )
- [Amrut]( https://github.com/amrut07 )
- [Usman Sakirat Kehinde]( https://github.com/oyinkan )
- [Qiwei]( https://github.com/qiweiii )
- [Adam Ash](https://github.com/adamash99)
- [Shawn Noruzi]( https://github.com/shawn-noruzi )
- [Ssentongo Alex]( https://github.com/aleku399 )
- [Tushar Kudal]( https://github.com/tusharkudal )
- [Onamade Okikioluwa]( https://github.com/khoded)
- [Basukinath Tiwari](https://github.com/basuki57)
- [Paulo Henrique](https://github.com/henriques4nti4go)

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/gitpay/contribute)]

#### Individuals

<a href="https://opencollective.com/gitpay"><img src="https://opencollective.com/gitpay/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/gitpay/contribute)]

<a href="https://opencollective.com/gitpay/organization/0/website"><img src="https://opencollective.com/gitpay/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/gitpay/organization/1/website"><img src="https://opencollective.com/gitpay/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/gitpay/organization/2/website"><img src="https://opencollective.com/gitpay/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/gitpay/organization/3/website"><img src="https://opencollective.com/gitpay/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/gitpay/organization/4/website"><img src="https://opencollective.com/gitpay/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/gitpay/organization/5/website"><img src="https://opencollective.com/gitpay/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/gitpay/organization/6/website"><img src="https://opencollective.com/gitpay/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/gitpay/organization/7/website"><img src="https://opencollective.com/gitpay/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/gitpay/organization/8/website"><img src="https://opencollective.com/gitpay/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/gitpay/organization/9/website"><img src="https://opencollective.com/gitpay/organization/9/avatar.svg"></a>

## License

[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-blue.svg)](https://github.com/your/repository/blob/main/LICENSE.md)

This project is licensed under the [Attribution-NonCommercial-NoDerivatives 4.0 International](https://creativecommons.org/licenses/by-nc-nd/4.0/) license. Please review the license terms and conditions for details.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay?ref=badge_large)


