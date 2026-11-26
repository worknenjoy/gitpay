---
layout: doc
lang: en
role: contributor
title: Git workflow
subtitle: How to structure your branch and pull request so your solution passes Gitpay's checks
tags: contributor, git, github, pull-requests
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

Gitpay doesn't change how you work with Git. It only reads your pull request on GitHub to decide whether the bounty can be paid. This page is the workflow that passes those checks first time.

## 1. Fork and branch

If you don't have write access to the repository, fork it and clone your fork:

```bash
git clone https://github.com/<your-username>/<repo>.git
cd <repo>
git remote add upstream https://github.com/<owner>/<repo>.git
git fetch upstream
git checkout -b fix-123-short-description upstream/main
```

Use the project's default branch (`main`, `master` or whatever the project uses) and follow its contributing guide.

## 2. Commit and push

```bash
git add .
git commit -m "Fix login redirect loop (#123)"
git push origin fix-123-short-description
```

## 3. Open the pull request against the original repository

Open the pull request from your fork's branch **into the original repository**, the one the issue belongs to. A pull request merged into your own fork doesn't count.

In the description, reference the issue with a closing keyword:

```
Fixes #123
```

You can also use `Closes #123`, `Resolves #123`, or paste the full issue URL. A closing keyword does two things Gitpay checks: it references the issue, and GitHub closes the issue automatically when the pull request is merged.

## 4. After the merge

Make sure the issue is closed, then submit the pull request URL on Gitpay. See [Submit a solution](/docs/en/pull-requests/).

## Checklist

- [ ] Signed in to Gitpay with the same GitHub account that opened the pull request
- [ ] Pull request opened against the original repository
- [ ] Description references the issue (`Fixes #123` or the issue URL)
- [ ] Pull request merged
- [ ] Issue closed
- [ ] Solution submitted on Gitpay

## Next steps

- [Submit a solution](/docs/en/pull-requests/)
