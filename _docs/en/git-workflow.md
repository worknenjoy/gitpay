---
layout: doc
lang: en
title: Working with Git Workflow
subtitle: How to deliver a task on Gitpay using Git Workflow
author: Alexandre Magno
tags: workflow, git, work, task, delivery, issue, solve

---
#### Table of contents

{:.no_toc}
* TOC
{:toc}

The Git workflow is a process used to validate a task in open source and private projects.

It defines how distributed teams integrate their work using Git.

## Our workflow

We use contributions in a Git repository to validate work. Git acts as our smart contract. Change requests go through automated tests and multiple validation stages before the code is integrated.

## Git Workflow

Git workflow is the guideline we use to deliver tasks consistently and effectively.

When using Git as our version control system we follow a workflow that allows the team to collaborate on the codebase. Issues are opened and closed through Pull Requests.

There are many workflows for teams using Git. Here we describe the one used on Gitpay, similar to processes adopted by companies worldwide.


> Workflow are ways to present the work process in agile development. They are based in project guidelines using git as version control system.

## Forking Workflow

![](/uploads/img-multidev-forking-800-2.png)

This is the forking workflow used to integrate code into our projects. You create a repository from the main source, make your changes and then open a Pull Request.

Every change goes through an approval process that follows agile guidelines and good development practices.

## Validating changes

We validate your changes with the following guidelines:

1. We evaluate the value of the task being delivered rather than every minor detail.
2. We are flexible to discuss better solutions, but a well written issue avoids unnecessary scope changes.
3. We encourage automated tests, especially when fixing bugs.
