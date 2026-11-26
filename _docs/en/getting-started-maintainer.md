---
layout: doc
lang: en
role: maintainer
title: Import issues and projects
subtitle: Bring issues from GitHub or Bitbucket into Gitpay so they can be funded and solved
tags: maintainer, issues, import, projects
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

Anyone can import a public issue into Gitpay. Maintainers usually import the issues they want help with, fund them or invite sponsors, and review the people who apply.

## Import an issue

1. Sign in and select **Import → Import issue** in the top bar.
2. Paste the URL of a GitHub or Bitbucket issue, for example `https://github.com/owner/repo/issues/123`.
3. Gitpay fetches the title, description, status and assignees from the provider, and creates the issue page.

Each issue can only be imported once. If it's already on Gitpay, you'll see "This issue was imported already".

When you import an issue, Gitpay also creates its organization and project pages, and lists the repository's languages.

### Private repositories

To import an issue from a private GitHub repository, authorize Gitpay to read your private repositories when prompted. Private issues use the **Private** plan (18% fee).

## Keep issues in sync

Gitpay reads each issue's status from GitHub when the issue is opened on Gitpay: when an issue is closed on GitHub, Gitpay marks it closed too. Gitpay checks this status before paying a bounty, so close issues on GitHub as you normally would.

## Issue visibility

| Visibility | Meaning |
|---|---|
| **Public** | Listed in Explore and search. |
| **Not listed** | Hidden from Explore and search; anyone with the link can still open it. |

## Find your issues

**Issues → My issues** has tabs for **My imported issues**, **Issues I'm working on**, **Sponsoring** and **Following**.

## Organizations and projects

Explore lists issues, projects and organizations. Each organization and project has a public page with its issues on Gitpay.

## Next steps

- [Review applications and offers](/docs/en/validating-work/)
- [Fund an issue](/docs/en/sponsor/)
- [How bounties are paid out](/docs/en/releasing-bounties/)
