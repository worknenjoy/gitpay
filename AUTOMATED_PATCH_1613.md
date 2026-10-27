Contributor details
Your Expensify account email: 3055073676@qq.com
Upwork Profile Link: https://www.upwork.com/freelancers/~01a6c3832b8108493d

## Proposal

### Please re-state the problem that we are trying to solve in this issue.

An Insecure Direct Object Reference (IDOR) / Broken Object-Level Authorization (BOLA) vulnerability (CWE-639) exists in the order creation endpoint (`POST /orders`). 

When an authenticated user creates an order funded by stored wallet funds (`provider === 'wallet'` and `source_type === 'wallet-funds'`), the client provides `walletId` in the request body. In [`src/modules/orders/orderBuilds.ts`](file:///root/remote_claw/src/modules/orders/orderBuilds.ts), the backend loads the wallet record exclusively using `id: orderParameters.walletId` without verifying that `wallet.userId` matches the authenticated caller (`orderParameters.userId` passed from `req.user.id`).

Consequently, an attacker can specify any arbitrary victim's `walletId` with a positive balance. The order is immediately marked as `paid: true` with `status: 'succeeded'` and assigned to the attacker's order and task, while setting `source_id: wallet.id`. When the victim's wallet balance is subsequently computed via `Wallet.spendBalance()`, the victim's balance is debited by the order amount (plus transaction fees), allowing any authenticated user to steal other users' stored wallet funds.

### What is the root cause of that problem?

The vulnerability stems from three interrelated flaws across the order controller, module build logic, and accounting model:

1. **Missing Ownership & Tenancy Verification in [`src/modules/orders/orderBuilds.ts#L267-L278`](file:///root/remote_claw/src/modules/orders/orderBuilds.ts#L267-L278):**
   ```typescript
   if (orderParameters.provider === 'wallet' && orderParameters.source_type === 'wallet-funds') {
     const wallet = await currentModels.Wallet.findOne({
       where: {
         id: orderParameters.walletId
       }
     })

     if (!wallet) {
       throw new Error(`Wallet with id ${orderParameters.walletId} not found`)
     }
   ```
   `orderParameters.walletId` is fully user-controlled. The query lacks `userId: orderParameters.userId`, and there is no verification that `wallet.userId === orderParameters.userId`. Any valid wallet ID in the database can be retrieved regardless of ownership.

2. **Dynamic Debit Association in [`src/models/wallet.ts#L123-L138`](file:///root/remote_claw/src/models/wallet.ts#L123-L138):**
   ```typescript
   async spendBalance(): Promise<Decimal> {
     const orders = await sequelize.models.Order.findAll({
       where: {
         provider: 'wallet',
         source_type: 'wallet-funds',
         source_id: `${this.id}`,
         status: 'succeeded'
       }
     })
     ...
   }
   ```
   Because `Wallet.spendBalance()` dynamically calculates total debits by summing all succeeded orders where `source_id === String(wallet.id)`, updating the attacker's order with `source_id: `${wallet.id}`` directly deducts the amount from the victim's balance on all subsequent calls to `wallet.totalBalance()`.

3. **Controller Error Status Masking in [`src/app/controllers/order.ts#L36-L44`](file:///root/remote_claw/src/app/controllers/order.ts#L36-L44):**
   ```typescript
   export const createOrder = async (req: any, res: any) => {
     try {
       const params = { ...req.body, ...{ userId: req.user.id } }
       const data = await orderBuild(params)
       res.send(data)
     } catch (error: any) {
       console.log('error on createOrder', error)
       res.status(401).send(error)
     }
   }
   ```
   The controller hardcodes `401` on all caught exceptions, ignoring specific HTTP semantic statuses like `403 Forbidden` for authorization failures or `404 Not Found`.

---

### What changes do you think we should make in order to solve the problem?

#### 1. Enforce strict wallet ownership check and cleanup in [`src/modules/orders/orderBuilds.ts`](file:///root/remote_claw/src/modules/orders/orderBuilds.ts):
Validate `orderParameters.walletId`, check if the wallet exists, and ensure `wallet.userId === orderParameters.userId`. If authorization fails, clean up the newly built pending order and throw an error with `status: 403` / `StatusCodeError: 403`.

```diff
--- a/src/modules/orders/orderBuilds.ts
+++ b/src/modules/orders/orderBuilds.ts
@@ -265,11 +265,24 @@ export async function orderBuilds(orderParameters: OrderBuildsParams) {
   }

   if (orderParameters.provider === 'wallet' && orderParameters.source_type === 'wallet-funds') {
+    if (!orderParameters.walletId) {
+      await orderCreated.destroy()
+      const error: any = new Error('walletId is required for wallet-funds orders')
+      error.status = 400
+      error.StatusCodeError = 400
+      throw error
+    }
+
     const wallet = await currentModels.Wallet.findOne({
       where: {
         id: orderParameters.walletId
       }
     })

     if (!wallet) {
+      await orderCreated.destroy()
+      const error: any = new Error(`Wallet with id ${orderParameters.walletId} not found`)
+      error.status = 404
+      error.StatusCodeError = 404
+      throw error
+    }
+
+    if (wallet.userId !== orderParameters.userId) {
+      await orderCreated.destroy()
+      const error: any = new Error('Unauthorized: Wallet does not belong to the authenticated user')
+      error.status = 403
+      error.StatusCodeError = 403
+      throw error
     }

     // Wallet balance is calculated from WalletOrders via afterFind hook
@@ -279,6 +292,7 @@ export async function orderBuilds(orderParameters: OrderBuildsParams) {
     const enoughBalance = currentBalance.greaterThanOrEqualTo(new Decimal(orderParameters.amount))

     if (!enoughBalance) {
+      await orderCreated.destroy()
       throw new Error(
         `Not enough balance. current: ${currentBalance}, amount: ${orderParameters.amount}`
       )
```

#### 2. Propagate correct HTTP status codes in [`src/app/controllers/order.ts`](file:///root/remote_claw/src/app/controllers/order.ts):
Ensure errors with `status` or `StatusCodeError` return the appropriate HTTP status code (such as `403` or `404`) instead of defaulting to `401`.

```diff
--- a/src/app/controllers/order.ts
+++ b/src/app/controllers/order.ts
@@ -39,6 +39,8 @@ export const createOrder = async (req: any, res: any) => {
     res.send(data)
   } catch (error: any) {
     console.log('error on createOrder', error)
-    res.status(401).send(error)
+    const status = error.status || error.StatusCodeError || error.statusCode || 401
+    res.status(status).send(error.message ? { message: error.message, error: error.message } : error)
   }
 }
```

---

### What alternative solutions did you explore? (Optional)

1. **Direct Scope in Query (`where: { id: walletId, userId: req.user.id }`):**
   - *Approach:* Load the wallet with both `id` and `userId` in the `where` clause. If `null`, throw `not_authorized` or `not_found`.
   - *Evaluation:* While concise, querying by `id` first and comparing `wallet.userId !== orderParameters.userId` enables precise distinction between `404 Not Found` (invalid wallet ID) and `403 Forbidden` (IDOR / unauthorized access attempt), complying with standard REST security guidelines and auditing requirements.

2. **Route Middleware Authorization Guard (`verifyWalletOwnership`):**
   - *Approach:* Add a middleware on `POST /orders` that inspects `req.body.walletId`.
   - *Evaluation:* `POST /orders` is polymorphic and handles multiple payment gateways (`stripe`, `paypal`, `whop`, `wallet`). Embedding provider-specific authorization guards in the order build workflow keeps the route definition clean and guarantees protection even if internal services call `orderBuilds` directly.

3. **Omit `walletId` from Client Body (Derive from Session):**
   - *Approach:* Never accept `walletId` from client requests; always query `Wallet.findOne({ where: { userId: req.user.id } })`.
   - *Evaluation:* Breaks flexibility if users manage multiple named wallets in the future, and alters the established API schema contract. Explicit ID check with tenancy verification is superior.

---

### What automated tests can you add to prevent this from re-occurring?

Add the following end-to-end integration and security test cases to [`test/api/order/orderCreate.test.ts`](file:///root/remote_claw/test/api/order/orderCreate.test.ts):

```typescript
describe('POST /orders - Wallet IDOR & Authorization Protection', () => {
  it('should return 403 Forbidden and NOT deduct victim balance when user attempts to spend another user wallet', async () => {
    // 1. Setup Victim with a funded wallet
    const victim = await registerAndLogin(agent)
    const victimWallet = await WalletFactory({
      name: 'Victim Wallet',
      balance: 0,
      userId: victim.body.id
    })
    await WalletOrderFactory({
      walletId: victimWallet.id,
      amount: 1000,
      currency: 'USD',
      status: 'paid',
      paid: true
    })
    await victimWallet.reload()
    const victimInitialBalance = await victimWallet.totalBalance()
    expect(victimInitialBalance.toNumber()).to.equal(1000)

    // 2. Setup Attacker with their own task
    const attacker = await registerAndLogin(agent)
    const attackerTask = await TaskFactory({
      url: 'https://github.com/test/repo/issues/100',
      userId: attacker.body.id,
      title: 'Attacker Bounty Task',
      not_listed: false,
      private: false
    })

    // 3. Attacker attempts to fund order using Victim's walletId
    const res = await agent
      .post('/orders')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', attacker.headers.authorization)
      .send({
        provider: 'wallet',
        source_type: 'wallet-funds',
        walletId: victimWallet.id,
        amount: 500,
        currency: 'USD',
        taskId: attackerTask.id
      })
      .expect(403)

    expect(res.body.message || res.body.error).to.include('Unauthorized')

    // 4. Verify victim wallet balance remains completely untouched
    await victimWallet.reload()
    const victimPostAttackBalance = await victimWallet.totalBalance()
    expect(victimPostAttackBalance.toNumber()).to.equal(1000)

    // 5. Verify no succeeded orders were created under victim's wallet ID
    const compromisedOrders = await models.Order.findAll({
      where: {
        source_id: `${victimWallet.id}`,
        source_type: 'wallet-funds',
        status: 'succeeded'
      }
    })
    expect(compromisedOrders.length).to.equal(0)
  })

  it('should return 404 Not Found when walletId does not exist', async () => {
    const user = await registerAndLogin(agent)
    const task = await TaskFactory({
      url: 'https://github.com/test/repo/issues/101',
      userId: user.body.id,
      title: 'Non-existent Wallet Task'
    })

    await agent
      .post('/orders')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', user.headers.authorization)
      .send({
        provider: 'wallet',
        source_type: 'wallet-funds',
        walletId: 999999,
        amount: 100,
        currency: 'USD',
        taskId: task.id
      })
      .expect(404)
  })

  it('should successfully complete order when user funds using their own wallet with sufficient balance', async () => {
    const user = await registerAndLogin(agent)
    const wallet = await WalletFactory({
      name: 'Legitimate Wallet',
      balance: 0,
      userId: user.body.id
    })
    await WalletOrderFactory({
      walletId: wallet.id,
      amount: 500,
      currency: 'USD',
      status: 'paid',
      paid: true
    })
    await wallet.reload()

    const task = await TaskFactory({
      url: 'https://github.com/test/repo/issues/102',
      userId: user.body.id,
      title: 'Legitimate Task'
    })

    const res = await agent
      .post('/orders')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', user.headers.authorization)
      .send({
        provider: 'wallet',
        source_type: 'wallet-funds',
        walletId: wallet.id,
        amount: 200,
        currency: 'USD',
        taskId: task.id
      })
      .expect(200)

    expect(res.body.status).to.equal('succeeded')
    expect(res.body.paid).to.equal(true)
    expect(res.body.source_id).to.equal(`${wallet.id}`)

    // Verify balance is properly debited
    await wallet.reload()
    const updatedBalance = await wallet.totalBalance()
    // 500 - (200 * 1.08 fee) = 284
    expect(updatedBalance.toNumber()).to.equal(284)
  })
})
```