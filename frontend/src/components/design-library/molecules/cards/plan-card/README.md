# PlanCard Component

## Overview

The `PlanCard` component displays plan details including fee, category, title, and feature items. It supports multiple ways of providing content:

1. **Direct React nodes** (Recommended for most cases)
2. **Translation key strings** (Using the `usePlanTranslation` hook)

## Usage

### Method 1: Using FormattedMessage Components (Recommended)

This is the recommended approach when you have a fixed set of plans:

```tsx
import { FormattedMessage } from 'react-intl'
import PlanCard from './plan-card'

const MyComponent = () => {
  const plan = {
    fee: 8,
    category: (
      <FormattedMessage
        id="actions.task.payment.plan.opensource"
        defaultMessage="Open Source"
      />
    ),
    title: (
      <FormattedMessage
        id="actions.task.payment.plan.opensource.info"
        defaultMessage="For Open Source Project"
      />
    ),
    items: [
      <FormattedMessage
        key="1"
        id="actions.task.payment.plan.bullet.public"
        defaultMessage="For Public Projects"
      />,
      <FormattedMessage
        key="2"
        id="actions.task.payment.plan.bullet.basic"
        defaultMessage="Basic Campaign"
      />
    ]
  }

  return <PlanCard plan={plan} />
}
```

### Method 2: Using the usePlanTranslation Hook

Use this approach when you need to dynamically build translation keys or when you prefer to keep translation logic separate:

```tsx
import PlanCard from './plan-card'
import { usePlanTranslation } from './usePlanTranslation'

const MyComponent = ({ planType }) => {
  // Define the plan with translation key IDs
  const planInput = {
    fee: 8,
    categoryId: 'actions.task.payment.plan.opensource',
    titleId: 'actions.task.payment.plan.opensource.info',
    itemIds: [
      'actions.task.payment.plan.bullet.public',
      'actions.task.payment.plan.bullet.basic'
    ]
  }

  // Use the hook to translate all strings
  const translatedPlan = usePlanTranslation(planInput)

  return <PlanCard plan={translatedPlan} />
}
```

## Type Definitions

### PlanDetails

```typescript
type PlanDetails = {
  fee?: number
  category?: React.ReactNode
  title?: React.ReactNode
  items?: React.ReactNode[]
}
```

### PlanTranslationInput (for usePlanTranslation hook)

```typescript
interface PlanTranslationInput {
  fee?: number
  categoryId?: string
  titleId?: string
  itemIds?: string[]
}
```

## Why Two Methods?

1. **FormattedMessage components** provide better static analysis and are easier to extract for translation management tools
2. **usePlanTranslation hook** is useful when translation keys need to be constructed dynamically or when you prefer to keep JSX cleaner

## Migration from Dynamic Keys

If you were previously trying to use dynamic translation keys like this (which doesn't work):

```tsx
// ❌ This doesn't work - intl.formatMessage doesn't support dynamic keys
const category = intl.formatMessage({ id: `pricing.${type}.category` })
```

Use the hook instead:

```tsx
// ✅ This works correctly
const translatedPlan = usePlanTranslation({
  categoryId: `pricing.${type}.category`,
  titleId: `pricing.${type}.title`,
  itemIds: [`pricing.${type}.item1`, `pricing.${type}.item2`]
})
```
