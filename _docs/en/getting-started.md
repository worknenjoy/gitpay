---
layout: doc
lang: en
title: Getting Started
subtitle: Understand how to receive bounties for contributions on Gitpay
tags:
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

Gitpay is a platform designed to help you solve issues on projects that use Git.

Once registered you can work on available tasks from many projects, including Gitpay itself. We develop new features using contributions from our community.

Those who contribute to our project are helping to build *your platform to work, collaborate and get paid*. Experience gained on any Git project will help you deliver tasks on other repositories.

Tasks are usually small and well defined, but larger features can also be broken into issues. We keep tasks small to reduce risk and make them easier to complete. Some issues might be presented as a _challenge_.

The issues can be considered done in many levels, and some levels can be automated, and avoid extra effort for repetitive tasks, like validate a code beforehand, or use end to end testing, and a robot can do basic tests before you move into manual testing. These process is part of extreme programming and agile development, used by many companies. Contributing with Gitpay is helping you to work with newest technologies and development workflow. You will be able to maintain projects, in a sustainable, and be part of projects maintained by a development community.

## What do I need to know?

You do not need any special requirement to start contributing and earning bounties on Gitpay. If you are not familiar with the concepts mentioned here, we will help you complete your tasks. The only thing you need is a willingness to learn.

We follow modern practices such as agile development, Scrum, extreme programming, open source, releases, pull requests, continuous integration and TDD. These concepts are also recommended for maintainers and organizations that add their issues to the platform.

Gitpay handles payments through the bounty model in projects that use Git. The version control system works like a contract to track the task and its validation. The Git workflow clearly defines when a task is considered done.

Tasks follow guidelines describing how to fix bugs or implement features. Git provides templates to help create new issues. We rely on tools from Git clients such as GitHub and Bitbucket, following their best practices to speed up development and ensure contributors receive their bounty.


## Delivery tasks for projects with agile development

With Gitpay you work using agile practices and continuous integration. The workflow fits well with distributed development teams.

Each task submitted through a *Pull Request* goes to production once it is approved. We rely on the existing Git process to validate the work and trigger the payment.

## How to contribute with a project and receive payments
Below we present the typical lifecycle of an issue. After registering on Gitpay you can receive proposals for tasks from our platform, maintainers or organizations that need issues solved in their projects.

Tasks can come from open source or private projects. Sometimes several sponsors fund a bounty, similar to crowdfunding, so the reward may come from multiple sources.

Gitpay is designed for users, maintainers and organizations who wish to collaborate on software development.

Browse the platform to see available tasks and set your preferences to receive notifications. Apply to work on any issue and, once approved by the maintainer, you can start working on the solution.

As an example, imagine a task to place a *favicon* on a website. The favicon is the small icon displayed in your browser's address bar.

Such a task could be created in a GitHub repository. It would simply require adding a line in the document header (assuming the icon already exists). All website code would be hosted on GitHub.

#### Apply to work on an issue

Visit a task page on Gitpay, for example: [https://gitpay.me/#/task/64](https://gitpay.me/#/task/64)

Apply to work on it and you will be notified once the maintainer approves your request.

> There is no limit to how many tasks you can apply for. If you are not assigned to one, you can still be selected for others.

#### You were assigned

If you are assigned you can start working on the issue immediately.

The maintainer may provide additional information on how to run the project.

## Create a fork

When assigned, start by creating a fork. From your fork you can create branches, make changes and then submit them for merging into the main codebase.

Your fork lets you work safely on the required changes until they are ready to merge back.

The project may evolve while you are working. Keep your fork up to date to avoid conflicts.

Fetch the latest changes from the original repository and merge them into your fork regularly. Staying up to date helps avoid conflicts when merging your code.

Let's suppose that the issue would be an issue from our own Gitpay project: https://github.com/worknenjoy/gitpay/issues/12

The first step to solve the issue is to follow the setup instructions at <http://github.com/worknenjoy/gitpay>

Run the project with:

Frontend: `npm run dev`

Backend (node.js): `npm run start:dev`

Then edit the source code

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

Add the line `<link rel="shortcut icon" type="image/png" href="favicon.png">`

The final version becomes:

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

Check the local version in your browser to verify that the icon has changed.

You can even send your first Pull Request with these changes as a learning exercise.


## Sending your Pull Request

After making the changes, commit and push them to your forked repository.

> Run `npm run test` and `npm run lint` before creating a pull request. Fix any failures so the continuous integration system can verify your changes.

For this example issue the pull request can be opened at [https://github.com/worknenjoy/gitpay/pulls](https://github.com/worknenjoy/gitpay/pulls)

After you submit the pull request we will review it and may request changes. Update the pull request until the solution is ready to be merged.

Once approved your code is merged and you will receive a bounty for your contribution.
