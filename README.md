![Gitpay](https://alexandremagno.net/wp-content/uploads/2019/05/gitpaydesigntop.png)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3881c342cfde4bcebb5fbe87f7998743)](https://app.codacy.com/gh/worknenjoy/gitpay/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Financial Contributors on Open Collective](https://opencollective.com/gitpay/all/badge.svg?label=financial+contributors)](https://opencollective.com/gitpay) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fworknenjoy%2Fgitpay?ref=badge_shield) [![first-timers-only](https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)](https://www.firsttimersonly.com/)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/worknenjoy/gitpay.svg)](http://isitmaintained.com/project/worknenjoy/gitpay "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/worknenjoy/gitpay.svg)](http://isitmaintained.com/project/worknenjoy/gitpay "Percentage of issues still open")

Gitpay is an open-source platform that empowers collaboration and rewards contributions to open-source projects.

### Slack channel

We have a Slack channel where you can collaborate with other people who are using Gitpay and work together to find solutions. Feel free to join the community and hang out on Slack with us.

[Join us on Slack](https://join.slack.com/t/gitpay-workspace/shared_invite/zt-1ru4j0duc-mOPFRxkhRyMgavlGdlghmw)

## What is Gitpay?

Gitpay is an open-source platform that empowers collaboration and rewards contributions to open-source projects. With Gitpay, you can complete tasks from anywhere in the world with open collaboration and receive bounties for completing them. Likewise, companies can receive reports, fixes, and enhancements from developers and offer bounties for completing requirements.

## Who is contributing?

This project has been made possible thanks to all the amazing people contributing their time and effort into making Gitpay better. You can also start contributing to the project and join the community by [contributing](CONTRIBUTING.md) to Gitpay on GitHub or join our team on GitHub first.

[Join the Gitpay team on GitHub](https://github.com/worknenjoy/gitpay/)

## Requirements

To contribute to Gitpay, you will need the following:

* Node.js (currently at v8.6.0)
* React with webpack

## Running Tests

To run the tests, use the following commands:

`npm run migrate-test` (first time)

`npm run test` (to run the tests)

## Setup Environment

To ensure full integration with the API services used by the platform, you will need the API keys. *You should make a copy of your `.env.example` file and rename it to `.env`* with the right credentials. Please let me know if you need any of these credentials to solve an issue (mail tarefas@gitpay.me).

You can do this with: `cp .env.example .env`

#### You need to run create the .env in order to run the project: `cp .env.example .env`

### Important
- Make sure to use Node v12 (you can use <a href="https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/"> Node Version Manager (NVM)</a> to manage and switch different Node versions)
- Don't forget to run `npm install` on the root and front-end folders

### Database

#### Install Postgres (Mac)
1. Install by running the following command: `brew install postgres`
2. Start the command service by running the following command: `brew services start postgresql`
3. Create a postgres user by running the following command: `createuser postgres -s`
4. Login into the Postgres cli with by running the following command: `psql -U postgres`
5. Create a test database by typing the following command: `create database gitpay_test;`
6. Create a dev database by running the following command: `create database gitpay_dev;`
7. Run this command to exit: `\q`

#### Install PostgreSQL (Linux - Ubuntu)
1. Install by running the following command: `sudo apt install postgresql`
2. Start the command service by running the following command: `sudo service postgresql start`
3. Create a postgres user by running the following command: `createuser postgres -s`
4. Login into the Postgres cli with by running the following command: `sudo -i -u postgres`
5. Access the Postgres prompt by running the following command: `psql`
6. Make sure the Postgres user has the correct password by typing the following command: `ALTER USER postgres WITH PASSWORD 'postgres';`
7. Create a test database by running the following command: `CREATE DATABASE gitpay_test;`
8. Create a dev database by running the following command: `CREATE DATABASE gitpay_dev;`
9. To finally exit, type the following command: `\q`

#### Install PostgreSQL (Windows)
