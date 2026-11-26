---
layout: doc
lang: en
role: maintainer
title: Maintainer questions
subtitle: Common questions about importing issues, bounties and contributors
tags: faq, maintainer
---

#### Table of contents
{:.no_toc}
* TOC
{:toc}

### Do I have to install anything on my repository?

No. You import issues by URL. Gitpay reads public issues and pull requests through the GitHub API. For private repositories, you authorize Gitpay to read them.

### Do I approve payments?

Not in Gitpay. Merging the pull request and closing the issue is the approval: the contributor then submits the solution and is paid automatically. Review the pull request carefully before merging. See [How bounties are paid out](/docs/en/releasing-bounties/).

### Someone else imported an issue from my project. Is that allowed?

Yes. Anyone can import a public issue and fund it. It still only pays out when you merge a pull request that solves it.

### Can I fund issues in my own project?

Yes. You're then both maintainer and sponsor. See [Fund an issue](/docs/en/sponsor/).

### What does Gitpay charge?

8% on top of the bounty for open source issues (nothing for bounties of $5,000 or more), 18% for private issues. The contributor receives 92% of the bounty. See [How payments and fees work](/docs/en/payments/).

### What if nobody solves the issue?

Contact [contact@gitpay.me](mailto:contact@gitpay.me) for a refund, or move the bounty to another issue with **Transfer Bounty** in **Payments**. Pledges to pay later are never charged if there's no solution.

### Can I pay a contributor who worked without a bounty?

Yes. Fund the issue, or ask them to send you a payment request for the work.

### How do I attract contributors?

Write a clear issue, fund it in advance rather than only pledging, and use **Post on GitHub** to link the Gitpay page from the GitHub issue.
