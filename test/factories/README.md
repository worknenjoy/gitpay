# Test Factories Guide

## Overview

This project uses the **Factory Pattern** for creating test data. Factories provide a consistent, maintainable way to create model instances for testing.

## Why Use Factories?

- **Consistency**: All tests use the same defaults
- **Maintainability**: Change defaults in one place
- **Readability**: Clear, self-documenting code
- **DRY**: Don't repeat default values
- **Type Safety**: Better TypeScript support

## Available Factories

All factories are exported from `test/factories/index.ts`:

### Core Models
- `TaskFactory` - Creates Task instances
- `UserFactory` - Creates User instances
- `OrderFactory` - Creates Order instances
- `AssignFactory` - Creates Assign instances

### Payment Models
- `PayoutFactory` - Creates Payout instances
- `TransferFactory` - Creates Transfer instances
- `PaymentRequestFactory` - Creates PaymentRequest instances
- `PaymentRequestCustomerFactory` - Creates PaymentRequestCustomer instances
- `PaymentRequestPaymentFactory` - Creates PaymentRequestPayment instances
- `PaymentRequestBalanceFactory` - Creates PaymentRequestBalance instances
- `PaymentRequestTransferFactory` - Creates PaymentRequestTransfer instances
- `PaymentRequestBalanceTransactionFactory` - Creates PaymentRequestBalanceTransaction instances

### Wallet Models
- `WalletFactory` - Creates Wallet instances
- `WalletOrderFactory` - Creates WalletOrder instances

## Usage Examples

### Basic Usage

```typescript
import { TaskFactory, UserFactory } from './factories'

// Create with default values
const task = await TaskFactory()

// Override specific values
const customTask = await TaskFactory({
  title: 'Custom Task',
  value: 500,
  userId: 123
})
```

### In Tests

```typescript
import { expect } from 'chai'
import { TaskFactory, OrderFactory } from './factories'

describe('Task Tests', () => {
  it('should create a task with an order', async () => {
    const task = await TaskFactory({ value: 100 })
    const order = await OrderFactory({ 
      TaskId: task.id,
      amount: 100 
    })
    
    expect(task.value).to.equal(100)
    expect(order.TaskId).to.equal(task.id)
  })
})
```

### With Options (e.g., AssignFactory)

```typescript
import { AssignFactory } from './factories'
import Models from '../src/models'

const models = Models as any

// Create with Sequelize options (like include)
const assign = await AssignFactory(
  { TaskId: 1, userId: 2 },
  { include: [models.User] }
)
```

## Default Values

Each factory defines sensible defaults. Check the factory file for specifics:

```typescript
// Example: TaskFactory defaults
{
  title: 'Sample Issue',
  description: 'This is a sample issue description.',
  paid: false,
  value: 100,
  userId: 1,
  provider: 'github',
  url: 'https://github.com/worknenjoy/gitpay/issues/1'
}
```

## Deprecated Helper Functions

The following helper functions in `test/helpers/index.ts` are deprecated:

- ❌ `createTask()` → Use `TaskFactory` instead
- ❌ `createOrder()` → Use `OrderFactory` instead
- ❌ `createAssign()` → Use `AssignFactory` instead
- ❌ `createTransfer()` → Use `TransferFactory` instead
- ❌ `createPayout()` → Use `PayoutFactory` instead

These are kept for backward compatibility but should not be used in new tests.

## Creating New Factories

If you need a factory for a new model:

1. Create a new file in `test/factories/` (e.g., `myModelFactory.ts`)
2. Follow the existing pattern:

```typescript
import Models from '../../src/models'

const models = Models as any

export const MyModelFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    // Add sensible defaults here
    name: 'Default Name',
    status: 'active'
  }
  const myModel = await models.MyModel.create({ 
    ...defaultParams, 
    ...paramsOverwrite 
  })
  return myModel
}
```

3. Export it in `test/factories/index.ts`:

```typescript
export { MyModelFactory } from './myModelFactory'
```

## Best Practices

1. **Always use factories** instead of `models.Model.create()` in tests
2. **Override only what you need** - let defaults handle the rest
3. **Keep defaults realistic** - they should create valid test data
4. **Document special requirements** - add comments for complex factories
5. **Update factories, not tests** - when defaults need to change

## Migration Guide

To migrate old tests to use factories:

```typescript
// Before
const task = await models.Task.create({
  title: 'Test Task',
  value: 100,
  userId: 1,
  provider: 'github',
  url: 'https://github.com/test/test/issues/1'
})

// After
import { TaskFactory } from './factories'

const task = await TaskFactory({ 
  title: 'Test Task' 
})
// value, userId, provider, url use defaults
```

## FAQ

**Q: Can I pass Sequelize options to factories?**  
A: Most factories support a second parameter for options (e.g., `AssignFactory`). Check the factory implementation.

**Q: What if I need a different default for my test?**  
A: Just override it when calling the factory. Factories merge your overrides with defaults.

**Q: Should I update the factory defaults or override in tests?**  
A: If the change is general, update the factory. If it's specific to one test, override it.

**Q: Are the helper functions going away?**  
A: They're deprecated but kept for backward compatibility. New code should use factories directly.

## Support

For questions or issues with factories:
1. Check this guide
2. Look at existing factory implementations in `test/factories/`
3. Check how other tests use factories
4. Ask the team in Slack/GitHub discussions
