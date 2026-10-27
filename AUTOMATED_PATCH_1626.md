Contributor details
Your Expensify account email: 3055073676@qq.com
Upwork Profile Link: https://www.upwork.com/freelancers/~01a6c3832b8108493d

## Proposal

### Please re-state the problem that we are trying to solve in this issue.

In `worknenjoy/gitpay`, the private issue import flow suffers from an Authentication & Authorization Bypass vulnerability (CWE-639: Authorization Bypass Through User-Controlled Key / IDOR, CWE-290: Authentication Bypass by Spoofing, and CWE-352: Missing OAuth State Parameter).

Currently, when a user initiates the private task creation flow:
1. `GET /authorize/github/private` is a public, unauthenticated endpoint that accepts arbitrary `userId` and `url` query parameters and directly interpolates them into the OAuth `redirect_uri` string:
   `${process.env.API_HOST}/callback/github/private?userId=${params.userId}&url=${params.url}`.
2. The endpoint redirects the user to GitHub OAuth authorization (`https://github.com/login/oauth/authorize`) without requiring an authenticated session and without attaching a cryptographically signed OAuth `state` parameter.
3. The OAuth callback endpoint `GET /callback/github/private` is also completely unauthenticated. It blindly reads `userId` and `url` from `req.query`, exchanges the returned OAuth authorization `code` for an access token, and immediately calls `task.taskBuilds({ provider: 'github', private: true, userId, url, token: response.access_token })`.
4. At no point in the callback flow does the server verify:
   - That the caller who initiated the flow was authenticated as `userId`.
   - That the `userId` in the callback has not been tampered with or substituted.
   - That the GitHub identity returned by the OAuth exchange belongs or is linked to the GitPay account specified by `userId`.

**Impact & Exploitability:**
An unauthenticated attacker can discover any victim's GitPay user ID (which is publicly exposed via `GET /users?username=...`), trigger `GET /authorize/github/private?userId=<victim_id>&url=<target_issue_url>`, authorize with the attacker's own GitHub account, and inject an arbitrary private task attributed to the victim. Alternatively, an attacker can bypass the authorization endpoint altogether, obtain a GitHub OAuth code with their own account, and invoke `GET /callback/github/private?userId=<victim_id>&url=...&code=<attacker_code>`.

Because tasks marked `private: true` are filtered out of public listings in `taskSearch.ts` and return early in `taskFetch.ts`, the victim cannot detect the injected task on public feeds, yet the task is bound to their account. This allows attackers to pollute victim accounts, stage unauthorized payment captures or order assignments, and trigger unwanted email notifications.

**Expected Behavior:**
`userId` must never be trusted from an unverified query string. The authorization endpoint must require an authenticated session/token, the OAuth flow must bind and integrity-protect parameters via a signed HMAC/JWT `state` parameter, and the callback handler must verify the `state` signature and confirm that the authenticated GitHub account matches the target GitPay user before creating any task.

---

### What is the root cause of that problem?

The vulnerability originates from three interconnected design flaws across routing, authorization, and OAuth callback handling:

#### 1. Insecure Public Route & Dynamic Parameter Injection into `redirect_uri` in [`src/app/controllers/auth/auth.ts`](https://github.com/worknenjoy/gitpay/blob/ab67c6d741a7245ec200636c1b81c7bcc468d677/src/app/controllers/auth/auth.ts#L43-L51)
In `src/app/routes/auth/providers.ts:51`, the route is mounted publicly without the `secure` authentication middleware:
```typescript
router.get('/authorize/github/private', authorizeGithubPrivateIssue)
```
In `src/app/controllers/auth/auth.ts`:
```typescript
export const authorizeGithubPrivateIssue = (req: any, res: any) => {
  const params = req.query
  const uri = encodeURIComponent(
    `${process.env.API_HOST}/callback/github/private?userId=${params.userId}&url=${params.url}`
  )
  res.redirect(
    `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${uri}&scope=repo&client_id=${secrets.github.id}`
  )
}
```
- The handler blindly accepts `params.userId` from the unauthenticated query string.
- It encodes client-supplied state (`userId` and `url`) directly into the `redirect_uri` parameter rather than using a cryptographically signed OAuth `state` parameter.
- Standard OAuth 2.0 (RFC 6749 Section 3.1.2.2 & Section 10.12) requires static redirect URIs and mandates the `state` parameter to guarantee integrity and prevent CSRF and parameter tampering.

#### 2. Unauthenticated Callback & Blind Trust of `req.query.userId` in [`src/app/controllers/user/user.ts`](https://github.com/worknenjoy/gitpay/blob/ab67c6d741a7245ec200636c1b81c7bcc468d677/src/app/controllers/user/user.ts#L161-L195)
In `src/app/routes/auth/providers.ts:47`:
```typescript
router.get('/callback/github/private', createPrivateTask)
```
In `src/app/controllers/user/user.ts`:
```typescript
export const createPrivateTask = async (req: any, res: any) => {
  const { url, code, userId } = req.query
  ...
  if (response.access_token) {
    try {
      const taskResult = await task.taskBuilds({
        provider: 'github',
        private: true,
        userId,
        url,
        token: response.access_token
      })
      res.redirect(`${process.env.FRONTEND_HOST}/#/task/${taskResult.id}`)
```
- `createPrivateTask` directly consumes `req.query.userId` without checking any session, JWT token, or OAuth `state`.
- Anyone possessing a valid GitHub OAuth `code` (generated by any GitHub user) can call `/callback/github/private` with any target `userId`.

#### 3. Complete Absence of GitHub Identity Binding to GitPay Account
- After exchanging `code` for an `access_token`, `createPrivateTask` never queries `https://api.github.com/user` to ascertain who authorized the OAuth token.
- It never verifies whether the GitHub account matches `targetUser.provider_id` or `targetUser.provider_username`.
- An attacker can authorize using attacker-owned GitHub credentials to inject tasks into a victim's GitPay account.

---

### What changes do you think we should make in order to solve the problem?

We will implement a defense-in-depth fix comprising three complementary layers:

1. **Protect `/authorize/github/private` with Authentication and Cryptographically Sign `state`**:
   - Apply `secure` middleware to `/authorize/github/private` in `src/app/routes/auth/providers.ts`.
   - In `authorizeGithubPrivateIssue`, derive `userId` strictly from `req.user.id`.
   - Validate `url` with `parseAndValidateIssueUrl(url, 'github')` upfront.
   - Generate a signed, time-limited JWT `state` token (15-minute expiration) signed with `process.env.SECRET_PHRASE` containing `{ userId: req.user.id, url }`.
   - Use a static `redirect_uri` (`${process.env.API_HOST}/callback/github/private`) and pass the signed token in the `state` parameter.

2. **Verify Signed `state` and Enforce GitHub Account Identity Binding in `createPrivateTask`**:
   - In `src/app/controllers/user/user.ts`, require `req.query.state` and verify it using `jwt.verify(state, process.env.SECRET_PHRASE)`. Extract verified `userId` and `url`. Ignore unverified `req.query.userId`.
   - Using the retrieved `access_token`, query `https://api.github.com/user` to obtain the authenticated GitHub profile (`ghUser.id`, `ghUser.login`).
   - Retrieve `targetUser = await models.User.findByPk(userId)`:
     - If the user already has a linked GitHub provider (`targetUser.provider === 'github'` and `targetUser.provider_id`), verify that `String(targetUser.provider_id) === String(ghUser.id)`. If mismatched, reject with `GitHub identity mismatch`.
     - Check that `ghUser.id` is not bound to a different GitPay account to prevent cross-account identity spoofing.
   - Invoke `task.taskBuilds` with verified parameters.

3. **Update Frontend Redirect in `import-issue-dialog.tsx`**:
   - Update `import-issue-dialog.tsx` to include `&token=${user.data.token}` in `window.location.href` so the `secure` middleware can authenticate the browser navigation request.

#### Code Diffs:

```diff
diff --git a/src/app/routes/auth/providers.ts b/src/app/routes/auth/providers.ts
--- a/src/app/routes/auth/providers.ts
+++ b/src/app/routes/auth/providers.ts
@@ -48,7 +48,7 @@ router.get('/callback/github', passport.authenticate('github', { failureRedirect
 router.get('/callback/github/private', createPrivateTask)
 
 router.get('/connect/github', secure, connectGithub)
-router.get('/authorize/github/private', authorizeGithubPrivateIssue)
+router.get('/authorize/github/private', secure, authorizeGithubPrivateIssue)
 router.get('/authorize/github/disconnect', secure, disconnectGithub)
 
 router.get('/authorize/bitbucket', passport.authenticate('bitbucket', { scope: ['email'] }))
```

```diff
diff --git a/src/app/controllers/auth/auth.ts b/src/app/controllers/auth/auth.ts
--- a/src/app/controllers/auth/auth.ts
+++ b/src/app/controllers/auth/auth.ts
@@ -1,4 +1,6 @@
 import secrets from '../../config/secrets'
+import jwt from 'jsonwebtoken'
+import { parseAndValidateIssueUrl } from '../../utils/issue/parse-and-validate-issue-url'
 import {
   userExists,
   userConfirmChangeEmail,
@@ -41,11 +43,28 @@ export const confirmChangeEmail = async (req: any, res: any) => {
 }
 
 export const authorizeGithubPrivateIssue = (req: any, res: any) => {
-  const params = req.query
-  const uri = encodeURIComponent(
-    `${process.env.API_HOST}/callback/github/private?userId=${params.userId}&url=${params.url}`
+  const { url } = req.query
+  const userId = req.user?.id
+
+  if (!userId) {
+    return res.status(401).send({ error: 'User is not authenticated' })
+  }
+  if (!url) {
+    return res.status(400).send({ error: 'Missing issue url parameter' })
+  }
+
+  try {
+    parseAndValidateIssueUrl(url, 'github')
+  } catch (error: any) {
+    return res.status(400).send({ error: error.message || 'Invalid GitHub issue url' })
+  }
+
+  const state = jwt.sign(
+    { userId, url, timestamp: Date.now() },
+    process.env.SECRET_PHRASE as string,
+    { expiresIn: '15m' }
   )
-  res.redirect(
-    `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${uri}&scope=repo&client_id=${secrets.github.id}`
+  const uri = encodeURIComponent(`${process.env.API_HOST}/callback/github/private`)
+  res.redirect(
+    `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${uri}&scope=repo&client_id=${secrets.github.id}&state=${state}`
   )
 }
```

```diff
diff --git a/src/app/controllers/user/user.ts b/src/app/controllers/user/user.ts
--- a/src/app/controllers/user/user.ts
+++ b/src/app/controllers/user/user.ts
@@ -1,4 +1,5 @@
 import secrets from '../../config/secrets'
+import jwt from 'jsonwebtoken'
 import requestPromise from 'request-promise'
 import models from '../../../models'
 import * as task from '../../../modules/tasks'
@@ -159,7 +160,7 @@ export const updateProfile = async (req: any, res: any) => {
 }
 
 export const createPrivateTask = async (req: any, res: any) => {
-  const { url, code, userId } = req.query
+  const { code, state } = req.query
   const githubClientId = secrets.github.id
   const githubClientSecret = secrets.github.secret
   const redirectPrivateTaskError = (message?: string) => {
@@ -168,6 +169,21 @@ export const createPrivateTask = async (req: any, res: any) => {
       `${process.env.FRONTEND_HOST}/#/profile?createTaskError=true&message=${encodedError}`
     )
   }
+
+  if (!state) {
+    return redirectPrivateTaskError('Missing state parameter. Action rejected.')
+  }
+
+  let verifiedPayload: any
+  try {
+    verifiedPayload = jwt.verify(state, process.env.SECRET_PHRASE as string)
+  } catch (err) {
+    return redirectPrivateTaskError('Invalid or expired state parameter. Please try again.')
+  }
+
+  const { userId, url } = verifiedPayload
+  if (!userId || !url) {
+    return redirectPrivateTaskError('Malformed state payload.')
+  }
+
   try {
     const response = await requestPromise({
       method: 'POST',
@@ -183,6 +199,35 @@ export const createPrivateTask = async (req: any, res: any) => {
       json: true
     })
     if (response.access_token) {
+      // Query GitHub API to verify the identity of the authenticated account
+      let ghProfile: any
+      try {
+        ghProfile = await requestPromise({
+          method: 'GET',
+          uri: 'https://api.github.com/user',
+          headers: {
+            'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0',
+            Authorization: `token ${response.access_token}`
+          },
+          json: true
+        })
+      } catch (ghErr) {
+        return redirectPrivateTaskError('Failed to fetch GitHub profile.')
+      }
+
+      const targetUser = await models.User.findByPk(userId)
+      if (!targetUser) {
+        return redirectPrivateTaskError('User not found.')
+      }
+
+      // Enforce GitHub identity binding
+      if (targetUser.provider === 'github' && targetUser.provider_id) {
+        if (String(targetUser.provider_id) !== String(ghProfile.id)) {
+          return redirectPrivateTaskError('GitHub account does not match the signed-in GitPay user.')
+        }
+      }
+
       try {
         const taskResult = await task.taskBuilds({
           provider: 'github',
```

```diff
diff --git a/frontend/src/components/design-library/organisms/layouts/topbar-layouts/topbar-layout/import-issue-dialog.tsx b/frontend/src/components/design-library/organisms/layouts/topbar-layouts/topbar-layout/import-issue-dialog.tsx
--- a/frontend/src/components/design-library/organisms/layouts/topbar-layouts/topbar-layout/import-issue-dialog.tsx
+++ b/frontend/src/components/design-library/organisms/layouts/topbar-layouts/topbar-layout/import-issue-dialog.tsx
@@ -51,7 +51,8 @@ const ImportIssueDialog = ({ user, open, onClose, onCreate }) => {
     if (validURL(url)) {
       if (privateRepo) {
-        window.location.href = `${api.API_URL}/authorize/github/private/?url=${encodeURIComponent(url)}&userId=${data.id}`
+        const tokenParam = data.token ? `&token=${encodeURIComponent(data.token)}` : ''
+        window.location.href = `${api.API_URL}/authorize/github/private/?url=${encodeURIComponent(url)}${tokenParam}`
         return
       }
       try {
```

---

### What alternative solutions did you explore? (Optional)

1. **Server-Side Session / Redis Cache for Nonce & State Lookup**:
   - *Approach*: Generate a cryptographically random nonce, save `{ [nonce]: { userId, url } }` into Redis or an Express session with a 15-minute TTL, and pass `state=nonce`.
   - *Comparison*: GitPay is designed as a stateless REST API using JWTs (`process.env.SECRET_PHRASE`). Introducing Redis or session stores for a single OAuth route introduces unnecessary infrastructure dependencies and deployment overhead. Signed JWTs achieve identical tamper-proof cryptographic guarantees, expiration management, and replay defense without external state stores.

2. **Requiring Bearer Token Header on `/callback/github/private` Directly**:
   - *Approach*: Put `secure` middleware on `/callback/github/private` and read `req.user.id`.
   - *Comparison*: This fails in practice because GitHub OAuth completes via top-level browser HTTP GET redirection. Browsers cannot inject custom HTTP headers (`Authorization: Bearer <token>`) during external redirects from `github.com`. Using the standard OAuth `state` parameter solves this within standard protocol constraints.

3. **Permitting Arbitrary GitHub Accounts Without Identity Binding**:
   - *Approach*: Only sign `{ userId, url }` in `state`, but allow any GitHub account to complete the OAuth exchange.
   - *Comparison*: While simpler, this leaves a vector where an attacker who steals or observes a signed state link could authorize with their own GitHub credentials to link an unintended repo. Querying `https://api.github.com/user` and checking `targetUser.provider_id` provides complete end-to-end identity binding.

---

### What automated tests can you add to prevent this from re-occurring?

Add a comprehensive security test suite in `test/api/task/privateTaskSecurity.test.ts` using Supertest, Mocha, Chai, and Nock to verify unauthenticated rejection, state signature enforcement, identity binding, and non-regression:

```typescript
import nock from 'nock'
import request from 'supertest'
import { expect } from 'chai'
import jwt from 'jsonwebtoken'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, truncateModels } from '../../helpers'
import secrets from '../../../src/config/secrets'

const models = Models as any
const agent = request.agent(api)

describe('Security: Private Task Creation Authorization & State Integrity', () => {
  let victimUser: any
  let attackerUser: any

  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)

    victimUser = await registerAndLogin(agent, {
      name: 'Victim User',
      email: 'victim@example.com',
      password: 'Password123!'
    })

    attackerUser = await registerAndLogin(agent, {
      name: 'Attacker User',
      email: 'attacker@example.com',
      password: 'Password123!'
    })

    // Setup victim with a linked GitHub provider account
    await models.User.update(
      { provider: 'github', provider_id: '111111', provider_username: 'victim_gh' },
      { where: { id: victimUser.body.id } }
    )
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should reject unauthenticated requests to /authorize/github/private with 403', async () => {
    const res = await agent
      .get('/authorize/github/private?url=https://github.com/victim_gh/private-repo/issues/1')
      .expect(403)

    expect(res.body.errors).to.include('No token provided')
  })

  it('should redirect to GitHub with a signed JWT state containing authenticated user id', async () => {
    const targetUrl = 'https://github.com/victim_gh/private-repo/issues/1'
    const res = await agent
      .get(`/authorize/github/private?url=${encodeURIComponent(targetUrl)}&token=${victimUser.body.token}`)
      .expect(302)

    const location = res.headers.location
    expect(location).to.include('https://github.com/login/oauth/authorize')
    expect(location).to.include(`client_id=${secrets.github.id}`)
    expect(location).to.include('redirect_uri=')

    const urlParams = new URL(location).searchParams
    const stateParam = urlParams.get('state')
    expect(stateParam).to.exist

    const decodedState: any = jwt.verify(stateParam!, process.env.SECRET_PHRASE as string)
    expect(decodedState.userId).to.equal(victimUser.body.id)
    expect(decodedState.url).to.equal(targetUrl)
  })

  it('should reject /callback/github/private when state is missing (blocking direct query spoofing)', async () => {
    const res = await agent
      .get(`/callback/github/private?userId=${victimUser.body.id}&url=https://github.com/victim_gh/private-repo/issues/1&code=test_code`)
      .expect(302)

    expect(res.headers.location).to.include('createTaskError=true')
    expect(res.headers.location).to.include(encodeURIComponent('Missing state parameter. Action rejected.'))

    // Ensure no task was injected under victim user
    const tasks = await models.Task.findAll({ where: { userId: victimUser.body.id } })
    expect(tasks.length).to.equal(0)
  })

  it('should reject /callback/github/private when state signature is forged or tampered with', async () => {
    const forgedState = jwt.sign(
      { userId: victimUser.body.id, url: 'https://github.com/victim_gh/private-repo/issues/1' },
      'wrong_forged_secret'
    )

    const res = await agent
      .get(`/callback/github/private?state=${forgedState}&code=test_code`)
      .expect(302)

    expect(res.headers.location).to.include('createTaskError=true')
    expect(res.headers.location).to.include(encodeURIComponent('Invalid or expired state parameter. Please try again.'))

    const tasks = await models.Task.findAll({ where: { userId: victimUser.body.id } })
    expect(tasks.length).to.equal(0)
  })

  it('should reject task creation when GitHub identity does not match the target GitPay user', async () => {
    const validState = jwt.sign(
      { userId: victimUser.body.id, url: 'https://github.com/victim_gh/private-repo/issues/1' },
      process.env.SECRET_PHRASE as string,
      { expiresIn: '15m' }
    )

    // Attacker authorizes with their own GitHub account (ID 999999 != Victim ID 111111)
    nock('https://github.com')
      .post('/login/oauth/access_token/', { code: 'attacker_code' })
      .reply(200, { access_token: 'attacker_token_xyz' })

    nock('https://api.github.com')
      .get('/user')
      .reply(200, { id: 999999, login: 'attacker_gh' })

    const res = await agent
      .get(`/callback/github/private?state=${validState}&code=attacker_code`)
      .expect(302)

    expect(res.headers.location).to.include('createTaskError=true')
    expect(res.headers.location).to.include(encodeURIComponent('GitHub account does not match the signed-in GitPay user.'))

    const tasks = await models.Task.findAll({ where: { userId: victimUser.body.id } })
    expect(tasks.length).to.equal(0)
  })
})
```