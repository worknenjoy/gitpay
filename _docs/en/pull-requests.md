---
layout: doc
lang: en
title: The power of Pull Requests
subtitle: How the Pull Requests are the key to send your solution
author:
tags:
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

Pull Requests are our contracts to integrate the task in order to consider an issue as done. It contains all changes that you did in a powerful tool, that can be visualized in several platforms like Github and Bitbucket, to allow reviews from your requested changes.

With Pull Requests, we can provide feedbacks, comments and work together, allowing changes and suggestions to change the code directly

You can download a practical guide to git here: http://rogerdudler.github.io/git-guide/files/git_cheat_sheet.pdf

## Automated tests for each pull request

When a pull request is send, some automated tests can be run, before any review, and it needs to be in a GREEN state to be acceptable to review by a human.

If the test fail, you can adjust in your local branch and update your branch, and for every push, the pull request can be updated.

## What is Pull Requests?

Pull Request are, as the name say, request for changes, usually from an issue from that project that needs to be solved. In all platforms using git, like Github, Gitlab, Bitbucket or TeamFoundation, they have an interface when is possible to discuss in a pull request, and to do actions like merge or close.

These actions will start CI's and pipelines that will be triggered, using a continuous integration system, and we have a flow that will merge these changes and a new deploy to production happen.

Pull Requests are a tool for developers and members in order to complete some features or bug fixing. 

When you mention an issue to a Pull Request, you can create a link between them, and when the Pull Request is merged, the issue is automatically closed.

## Pull Request anatomy

When a Pull Request is open, you are requesting someone to review a change in the main repository. Within this change we have the following information:

1. The base repository
2. The base branch
3. The destination repo
4. The destination branch

You will then create a new change request to  *merge your branch*, from your fork, to the master branch of the base project.

## Steps to create a Pull Request

Pull request can be used as a change request from your fork, as one of the workflow models. The Pull Request is the starting point to send your code to production.

The general process to send a Pull Request

1. The contributor build a feature or bug fix in a branch dedicated to the forked repository of the main project;
2. The contributor do a `git push` to your forked branch (and it will create a remote branch);
3. The contributor open a Pull Request (on Github or Bitbucket);
4. Your code is reviewed, discussed and we can provide feedbacks and do reviews from specific parts about the changes that needs to be done;
5. The maintainer will have a chance to `merge` this feature or bug fixing and the code will be send to the official main repository and the Pull Request is closed;

Now you now what you need to send a Pull Request. When you're assigned to a task on Gitpay, this is the stage that we validate your solution and when we validate the task to send the payment for your work.