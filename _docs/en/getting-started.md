---
layout: doc
lang: en
title: Getting Started
subtitle: Understand how receive bounties with contributions on Gitpay
tags:
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

Gitpay is a platform to solve issues from Git. 

Once registered, you can work in available tasks in the platform, from many projects, and from issues of Gitpay. This means that we use Gitpay to create our features, by contributions from our users.

Who contribute with our project is helping to build *your platform to work, contribute and receive payments* and learn with collaboration. Your contributions from any project using Git will provide experience to perform tasks from other projects.

These tasks are divided in small changes with specific guidelines, but if is well described, it can be used for larger tasks, and a whole project. But we try to create small tasks to reduce the risks and make it easier to conclude the tasks. Some issues can be described as a _challenge_ too.

The issues can be considered done in many levels, and some levels can be automated, and avoid extra effort for repetitive tasks, like validate a code beforehand, or use end to end testing, and a robot can do basic tests before you move into manual testing. These process is part of extreme programming and agile development, used by many companies. Contributing with Gitpay is helping you to work with newest technologies and development workflow. You will be able to maintain projects, in a sustainable, and be part of projects maintained by a development community.

## What I need to know?

You don't need any extra requirement to start to contribute with Gitpay, even to start to receive bounties. If you don't know about the concepts here, we will help you to get any task done. You just need to be open to learn.

We build our company with agile development, scrum, extreme programing, open source, releases, Pull Requests, and continuous integration, build pipeline and TDD. All these terms are part of our development process and we try to have the same concept for maintainers and organizations that add their issues into our platform.

Gitpay is a process of payment for a work based in the bounty format with projects using Git. We track by this version control system as a workflow and a contract to solve a task in different ways, all using validation process used in a Git workflow. The git workflow process is clear and straightforward to define when a task should be considered as done.

The tasks follow guidelines that can be used to describe requirements to solve a bug or create a feature. Git provide issue templates model to serve as a template to create new issues. We use all the tools existing in Git clients like Github and Bitbucket and use their best practices to speed up the development, and we focus in make sure the developer will be paid by the bounty provided.


## Delivery tasks for projects with agile development

With Gitpay, you work using agile practices and continuous integrations, that can be distributes in distributed development teams.

This means that each task sent by a *Pull Request* goes to production when approved. We use an existent git process to send a solution to an issue in production to validate the work and send the payment.

## How to contribute with a project and receive payments
We will show in this topic the lifecycle of an issue to be solved. When you register on Gitpay, you can receive proposals for tasks of our platform and from maintainers and organizations that needs an issue solved in their projects.

These projects have different sources, from Open Source, and someone want that feature or bug solved, and then interested users to have their implementation can sponsor, as a crowdfunding. So the bounty you may receive sometimes can be originated from many sources.

Gitpay is for users, maintainers or developers, contributors and people engaged with causes, and for organization and for any software development.

You can navigate on our platform to check the available tasks, as setup preferences to receive notifications and proposals about projects available. You can apply to work on that issue and once approve by the author, you can start to work on that solution.

For a real world example, we have a demand to solve an issue to place a *favicon* in their website. Favicon is an mini icon that will be placed in the navigation bar in your browser.

So this task was created on a Github repository, and this task is a beginner task to add a line on the document header, considered that the icon was already created in this project. All the website code is on a Github repository.

#### Apply to work on an issue

You visit a task page on Gitpay from an issue on Github: [https://gitpay.me/#/task/64](https://gitpay.me/#/task/64)

You can apply to work and be notified if your request was approved by the maintainer.

> There's no limit of tasks to apply to work, if you're not be assigned to one, maybe you can be assigned to another ones available

#### You were assigned

If you were assigned, you can start to work on that issue.

The maintainer may contact you to provide extra information of how to run the project.

## Create a fork

The first step when you're assigned is start a fork. When you do this you will be able to create branches from your version of the project that you will be working. With this "copy" you can modify and send the solution back to be merged in the main codebase.

The fork is to you make the required changes, that once concluded, will be merged into the main codebase.

The project may change while you're working, like bug fixes and new features, maybe that will conflict to yours, specially if the tasks require time. When you have a fork, you had diverged and the project follow another branch three. 

You can always fetch to obtain the updated version and leave with git to merge the changes. So you should always be up to date with the changes and we will not have any conflict to merge your code.

Let's suppose that the issue would be an issue from our own Gitpay project: https://github.com/worknenjoy/gitpay/issues/12

The first step to solve that issue it would be follow the instructions to start this project: http://github.com/worknenjoy/gitpay

And we can run the project with:

Frontend: `npm run dev`

Backend (node.js): `npm run start:dev`

Then we could change the source code

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

With a line: `<link rel="shortcut icon" type="image/png" href="favicon.png">`

And the final version:

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

Then you can check in the local version from your browser, that the icon was updated.

If you want to learn, you can send your first Pull Request with these changes.


## Sending your Pull Request

Now that you have the changes, you should commit and push to your forked repo.

> Don't forget to run the tests `npm run test` e `npm run lint` that we do automated tests to check if the projects is good to go for a review. If these tests fails, we will ask you to fix and when you send a pull request, our continuous integration system will verify your changes before move on.

So for this issue, the pull request can be send in [https://github.com/worknenjoy/gitpay/pulls](https://github.com/worknenjoy/gitpay/pulls)

When you send the pull request, we can review and ask for changes, and you can do the fixings and the pull request can be updated, and it is approved when the solution is good to go.

When approved, your code is merged, approved and you will receive a bounty for your contribution.
