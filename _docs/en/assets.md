---
layout: doc
title: How to set up a repository
categories: [Getting Started, Troubleshooting]
author: John Black
tags:
---

#### What you will learn here
{:.no_toc}
* TOC
{:toc}

## Working on a project repository

When a repository already exists, usually created by the client, you need to clone the project.

To do that, run: `git clone <repository url>`

To find the repository address go to the GitHub page and choose *Clone or download*.

After cloning you will have a copy of the project in a directory.

Every clone grabs the latest version of the repository.

To pull new changes from the repository and keep it up to date, run `git pull origin master`.

## Project versions

When you fork a project (check the Fork option on GitHub to see how many forks it has) you create your own copy.

To clone your fork run: `git clone <repository url>`

> After this step you have your own version (usually named origin) while the original project continues evolving separately.

From that point your fork has its own address and you can also clone it again if needed. This is recommended.

However you will not automatically get changes from the original repository and pushing will send changes only to your fork.

> One of the main advantages of Git is having multiple repositories derived from others.

To keep receiving updates from the main project you need to add an *upstream* remote, which points to the original repository.

Add it with: `git remote add upstream <repository url>`

Now running `git pull origin master` fetches your fork and `git pull upstream master` fetches changes from the main repository.

## Making changes

The Forking Workflow says you work on your own version and submit changes to the main repository through Pull Requests.

To stay organized it's best to use branches in your fork. To start any task run:

`git branch branch-name`

Then switch to it with: `git checkout branch-name`

Make the necessary modifications, commit and push the branch to your fork.

## Keeping branches in sync

Use your local master branch as a mirror of the main repository where you don't make changes directly.

From master run `git pull upstream master` regularly.

Then update your feature branch with `git rebase master`.

## Sending your changes

Once your branch has no conflicts and is updated with master you can push it using: `git push origin branch-name`

On GitHub you'll see an option to open a pull request from that remote branch. Create the pull request so your code can be merged into the project.

When the code is approved and you pull updates from upstream again your changes will be included. You can delete the branch and your fork will be in sync with the main project.

Learn more at [https://git-scm.com/book/pt-br/v1/Ramifica%C3%A7%C3%A3o-Branching-no-Git-Fluxos-de-Trabalho-com-Branches](https://git-scm.com/book/pt-br/v1/Ramifica%C3%A7%C3%A3o-Branching-no-Git-Fluxos-de-Trabalho-com-Branches)
