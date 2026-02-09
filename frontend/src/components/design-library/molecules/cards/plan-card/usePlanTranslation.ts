import { useIntl } from 'react-intl'

interface PlanTranslationInput {
  fee?: number
  categoryId?: string
  titleId?: string
  itemIds?: string[]
}

interface PlanTranslation {
  fee?: number
  category?: string
  title?: string
  items?: string[]
}

/**
 * Custom hook to handle translation of plan details
 * Converts translation key strings to translated text
 */
export const usePlanTranslation = (plan?: PlanTranslationInput): PlanTranslation | undefined => {
  const intl = useIntl()

  if (!plan) {
    return undefined
  }

  const { fee, categoryId, titleId, itemIds } = plan

  return {
    fee,
    category: categoryId ? intl.formatMessage({ id: categoryId }) : undefined,
    title: titleId ? intl.formatMessage({ id: titleId }) : undefined,
    items: itemIds ? itemIds.map(id => intl.formatMessage({ id })) : []
  }
}
