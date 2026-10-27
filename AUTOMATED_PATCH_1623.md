Contributor details
Your Expensify account email: 3055073676@qq.com
Upwork Profile Link: https://www.upwork.com/freelancers/~01a6c3832b8108493d

## Proposal

### Please re-state the problem that we are trying to solve in this issue.

An Insecure Direct Object Reference (IDOR) / Broken Object-Level Authorization (BOLA) vulnerability (CWE-639, CWE-862) exists in the task assignment removal endpoint (`PUT /tasks/:id/assignment/remove`).

When an authenticated user invokes `PUT /tasks/:id/assignment/remove`, the route controller in [`src/app/controllers/task.ts`](https://github.com/worknenjoy/gitpay/blob/ab67c6d741a7245ec200636c1b81c7bcc468d677/src/app/controllers/task.ts#L250-L258) extracts the caller's ID (`userId: req.user.id`) and passes it to [`removeAssignedUser({ id, userId }, { message })`](https://github.com/worknenjoy/gitpay/blob/ab67c6d741a7245ec200636c1b81c7bcc468d677/src/modules/tasks/removeAssignedUser.ts#L7-L18). However, inside `removeAssignedUser.ts`, the `userId` predicate in the database query is commented out (`// userId`). As a result, the lookup loads the task solely by `id`.

Because the caller's ownership is never validated:
1. Any authenticated user can unassign the contributor from any active in-progress task across the platform.
2. The task status is forcefully reverted from `'in_progress'` back to `'open'`, disrupting ongoing bounty work.
3. The assigned contributor's `Assign` record status is demoted to `'pending'`.
4. Automated notification emails (`mail.assign.remove` and `mail.assign.remove.owner`) are dispatched to both the assigned contributor and the legitimate task owner containing the attacker's arbitrary `message`, facilitating spam and denial of service.

The expected behavior is to reject unassignment attempts with `HTTP 403 Forbidden` unless the authenticated caller is the task owner.

---

### What is the root cause of that problem?

The defect is caused by flaws across the module lookup, error handling, and controller status propagation:

#### 1. Commented-out Ownership Constraint in [`src/modules/tasks/removeAssignedUser.ts#L7-L18`](https://github.com/worknenjoy/gitpay/blob/ab67c6d741a7245ec200636c1b81c7bcc468d677/src/modules/tasks/removeAssignedUser.ts#L7-L18)
```typescript
export async function removeAssignedUser({ id, userId }: any, { message }: any) {
  const task = await currentModels.Task.findOne(
    {
      where: {
        id
        // userId        <-- Commented out, ignoring caller identity
      }
    },
    {
      include: [currentModels.User, currentModels.Order, currentModels.Assign]
    }
  )
```
Although `userId` is passed to the function, it is never applied to the query or verified against `task.userId`. Additionally, in Sequelize `Model.findOne(options)` accepts a single options object; splitting `{ where: { id } }` and `{ include: [...] }` into two separate function arguments causes the second argument (`include`) to be silently ignored.

#### 2. Missing Existence (Null) Verification
If an invalid or non-existent task ID is provided, `task` is `null`. Line 20 immediately accesses `task.assigned`, throwing an unhandled `TypeError: Cannot read properties of null (reading 'assigned')` rather than returning a clean `404 Not Found` response.

#### 3. Missing HTTP Status Code Differentiation in [`src/app/controllers/task.ts#L250-L258`](https://github.com/worknenjoy/gitpay/blob/ab67c6d741a7245ec200636c1b81c7bcc468d677/src/app/controllers/task.ts#L250-L258)
```typescript
export const removeAssignedUser = async (req: any, res: any) => {
  try {
    const params = { id: req.params.id, userId: req.user.id }
    const data = await taskRemoveAssignedUser(params, req.body)
    res.send(data)
  } catch (error: any) {
    res.send({ error: error.message }) // Defaults to HTTP 200 OK
  }
}
```
When an error is thrown in `taskRemoveAssignedUser`, `removeAssignedUser` catches it but invokes `res.send({ error: error.message })` without setting `res.status(...)`. This causes client errors to return `HTTP 200 OK` rather than semantic HTTP status codes (`403 Forbidden`, `404 Not Found`, `400 Bad Request`).

---

### What changes do you think we should make in order to solve the problem?

#### 1. Enforce Strict Task Ownership and Existence Checks in [`src/modules/tasks/removeAssignedUser.ts`](https://github.com/worknenjoy/gitpay/blob/ab67c6d741a7245ec200636c1b81c7bcc468d677/src/modules/tasks/removeAssignedUser.ts)
- Query the task by `id` using a single valid Sequelize options object.
- If the task does not exist, throw an error with `status: 404` / `StatusCodeError: 404`.
- Validate that `userId` matches `task.userId`. If not, throw an error with `status: 403` / `StatusCodeError: 403`.
- Verify that `task.assigned` is present; if not, throw an error with `status: 400` / `StatusCodeError: 400`.
- Consolidate the concurrent `.save()` calls on the same `task` instance (`task.set('assigned', null).save()` and `task.set('status', 'open').save()`) into a single atomic update.

```diff
diff --git a/src/modules/tasks/removeAssignedUser.ts b/src/modules/tasks/removeAssignedUser.ts
--- a/src/modules/tasks/removeAssignedUser.ts
+++ b/src/modules/tasks/removeAssignedUser.ts
@@ -5,17 +5,29 @@ import i18n from 'i18n'
 const currentModels = models as any
 
 export async function removeAssignedUser({ id, userId }: any, { message }: any) {
-  const task = await currentModels.Task.findOne(
-    {
-      where: {
-        id
-        // userId
-      }
-    },
-    {
-      include: [currentModels.User, currentModels.Order, currentModels.Assign]
-    }
-  )
+  const task = await currentModels.Task.findOne({
+    where: {
+      id
+    },
+    include: [currentModels.User, currentModels.Order, currentModels.Assign]
+  })
+
+  if (!task) {
+    const error: any = new Error('Task not found')
+    error.status = 404
+    error.StatusCodeError = 404
+    throw error
+  }
+
+  if (!userId || Number(task.userId) !== Number(userId)) {
+    const error: any = new Error('Unauthorized')
+    error.status = 403
+    error.StatusCodeError = 403
+    throw error
+  }
 
   const assignedId = task.assigned
 
-  if (!assignedId) throw new Error("The Task doesn't have an assigned user.")
+  if (!assignedId) {
+    const error: any = new Error("The Task doesn't have an assigned user.")
+    error.status = 400
+    error.StatusCodeError = 400
+    throw error
+  }
 
   const assignedPromise = await currentModels.Assign.findByPk(assignedId, {
     include: [currentModels.User]
   })
 
   const author = await currentModels.User.findByPk(task.userId)
 
-  // Unset assigned value,
-  const saveTaskPromise = task.set('assigned', null).save()
-  const changeStatusPromise = task.set('status', 'open').save()
+  // Unset assigned value and reset status atomically
+  const saveTaskPromise = task.set({ assigned: null, status: 'open' }).save()
   const changeStatusAssign = assignedPromise.set('status', 'pending').save()
 
   const [assign] = await Promise.all([
     assignedPromise,
     saveTaskPromise,
-    changeStatusPromise,
     changeStatusAssign
   ])
```

#### 2. Propagate Proper HTTP Status Codes in [`src/app/controllers/task.ts`](https://github.com/worknenjoy/gitpay/blob/ab67c6d741a7245ec200636c1b81c7bcc468d677/src/app/controllers/task.ts)
Ensure errors thrown by `taskRemoveAssignedUser` respond with the corresponding HTTP status (`error.status || error.StatusCodeError || 400`) instead of returning 200 OK:

```diff
diff --git a/src/app/controllers/task.ts b/src/app/controllers/task.ts
--- a/src/app/controllers/task.ts
+++ b/src/app/controllers/task.ts
@@ -253,6 +253,7 @@ export const removeAssignedUser = async (req: any, res: any) => {
     const data = await taskRemoveAssignedUser(params, req.body)
     res.send(data)
   } catch (error: any) {
-    res.send({ error: error.message })
+    const status = error.status || error.StatusCodeError || 400
+    res.status(status).send({ error: error.message })
   }
 }
```

---

### What alternative solutions did you explore? (Optional)

1. **Restricting directly in the query (`where: { id, userId }`)**:
   - *Approach*: Re-enable `where: { id, userId }` in `Task.findOne`.
   - *Trade-off*: When `!task`, this approach cannot differentiate between a non-existent task (`404 Not Found`) and an unauthorized caller accessing another user's task (`403 Forbidden`). Explicitly querying by `id` first and comparing `Number(task.userId) !== Number(userId)` provides clear semantic error codes for API consumers and security monitoring.

2. **Express Route Middleware Guard (`isTaskOwner`)**:
   - *Approach*: Add an Express authorization middleware on `PUT /:id/assignment/remove`.
   - *Trade-off*: While modular, middleware guards only protect requests arriving through that specific Express route. Validating ownership inside `removeAssignedUser.ts` provides defense-in-depth across direct service invocations, GraphQL resolvers, or scheduled worker jobs.

3. **Allowing Assignee Self-Unassignment (Contributor Resignation)**:
   - *Approach*: Permit either the task owner OR the assigned contributor (`assign.userId === userId`) to call this endpoint.
   - *Trade-off*: The current endpoint and its notification email templates (`"mail.assign.remove.message": "<p>You were unassigned... The issue owner sent the reason: {{message}}</p>"`) are specifically designed for owner-driven contributor removals. Allowing contributors to resign should be handled via a dedicated endpoint (e.g., `POST /tasks/:id/assignment/resign`) with tailored messaging and separate notification flows.

---

### What automated tests can you add to prevent this from re-occurring?

Add the following end-to-end integration tests to [`test/api/task/taskAssignment.test.ts`](https://github.com/worknenjoy/gitpay/blob/ab67c6d741a7245ec200636c1b81c7bcc468d677/test/api/task/taskAssignment.test.ts) to verify authorization enforcement and assignment removal semantics:

```typescript
import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { registerAndLogin, truncateModels } from '../../helpers'
import { TaskFactory, AssignFactory } from '../../factories'
import nock from 'nock'

const models = Models as any
const agent = request.agent(api)

describe('PUT /tasks/:id/assignment/remove - Authorization & Ownership Protection', () => {
  let ownerUser: any
  let contributorUser: any
  let attackerUser: any
  let task: any
  let assign: any

  beforeEach(async () => {
    await truncateModels(models.Task)
    await truncateModels(models.User)
    await truncateModels(models.Assign)
    await truncateModels(models.Order)

    // 1. Create task owner and contributor
    ownerUser = await registerAndLogin(agent, {
      name: 'Task Owner',
      email: 'owner@example.com',
      password: 'password123'
    })

    contributorUser = await registerAndLogin(agent, {
      name: 'Contributor User',
      email: 'contributor@example.com',
      password: 'password123'
    })

    attackerUser = await registerAndLogin(agent, {
      name: 'Attacker User',
      email: 'attacker@example.com',
      password: 'password123'
    })

    // 2. Setup assigned task in progress
    task = await TaskFactory({
      userId: ownerUser.body.id,
      title: 'Bounty Task in Progress',
      url: 'https://github.com/worknenjoy/gitpay/issues/100',
      status: 'in_progress'
    })

    assign = await AssignFactory({
      userId: contributorUser.body.id,
      TaskId: task.id,
      status: 'accepted'
    })

    await task.update({ assigned: assign.id })
  })

  afterEach(async () => {
    nock.cleanAll()
  })

  it('should return 403 Forbidden and NOT unassign task when non-owner attempts to remove assignment', async () => {
    const res = await agent
      .put(`/tasks/${task.id}/assignment/remove`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', attackerUser.headers.authorization)
      .send({ message: 'Attacker attempting unauthorized unassign' })

    expect(res.status).to.equal(403)
    expect(res.body.error).to.equal('Unauthorized')

    // Verify task state remains intact in the database
    const refreshedTask = await models.Task.findByPk(task.id)
    expect(refreshedTask.status).to.equal('in_progress')
    expect(refreshedTask.assigned).to.equal(assign.id)

    // Verify assign record status remains accepted
    const refreshedAssign = await models.Assign.findByPk(assign.id)
    expect(refreshedAssign.status).to.equal('accepted')
  })

  it('should return 404 Not Found when attempting to remove assignment on non-existent task', async () => {
    const nonExistentTaskId = 999999
    const res = await agent
      .put(`/tasks/${nonExistentTaskId}/assignment/remove`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', ownerUser.headers.authorization)
      .send({ message: 'Removing from non-existent task' })

    expect(res.status).to.equal(404)
    expect(res.body.error).to.equal('Task not found')
  })

  it('should return 400 Bad Request when task has no assigned user', async () => {
    const unassignedTask = await TaskFactory({
      userId: ownerUser.body.id,
      title: 'Unassigned Task',
      url: 'https://github.com/worknenjoy/gitpay/issues/101',
      status: 'open',
      assigned: null
    })

    const res = await agent
      .put(`/tasks/${unassignedTask.id}/assignment/remove`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', ownerUser.headers.authorization)
      .send({ message: 'Remove unassigned user' })

    expect(res.status).to.equal(400)
    expect(res.body.error).to.equal("The Task doesn't have an assigned user.")
  })

  it('should allow legitimate task owner to remove assignment and reset task to open', async () => {
    const res = await agent
      .put(`/tasks/${task.id}/assignment/remove`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', ownerUser.headers.authorization)
      .send({ message: 'Owner removing contributor for inactivity' })

    expect(res.status).to.equal(200)

    // Verify task is reverted to open with null assignment
    const updatedTask = await models.Task.findByPk(task.id)
    expect(updatedTask.status).to.equal('open')
    expect(updatedTask.assigned).to.be.null

    // Verify assign record is reset to pending
    const updatedAssign = await models.Assign.findByPk(assign.id)
    expect(updatedAssign.status).to.equal('pending')
  })
})
```