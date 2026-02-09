/**
 * @jest-environment jsdom
 */
import React from 'react'
import { renderHook } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { usePlanTranslation } from '../usePlanTranslation'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider
    locale="en"
    messages={{
      'test.category': 'Test Category',
      'test.title': 'Test Title',
      'test.item1': 'Item 1',
      'test.item2': 'Item 2'
    }}
  >
    {children}
  </IntlProvider>
)

describe('usePlanTranslation hook', () => {
  it('should return undefined when plan is not provided', () => {
    const { result } = renderHook(() => usePlanTranslation(undefined), {
      wrapper: Wrapper
    })

    expect(result.current).toBeUndefined()
  })

  it('should translate category, title and items', () => {
    const { result } = renderHook(
      () =>
        usePlanTranslation({
          fee: 8,
          categoryId: 'test.category',
          titleId: 'test.title',
          itemIds: ['test.item1', 'test.item2']
        }),
      {
        wrapper: Wrapper
      }
    )

    expect(result.current).toEqual({
      fee: 8,
      category: 'Test Category',
      title: 'Test Title',
      items: ['Item 1', 'Item 2']
    })
  })

  it('should handle missing translation keys gracefully', () => {
    const { result } = renderHook(
      () =>
        usePlanTranslation({
          fee: 10,
          categoryId: 'missing.category',
          titleId: 'missing.title',
          itemIds: ['missing.item']
        }),
      {
        wrapper: Wrapper
      }
    )

    // react-intl returns the key when translation is missing
    expect(result.current).toEqual({
      fee: 10,
      category: 'missing.category',
      title: 'missing.title',
      items: ['missing.item']
    })
  })

  it('should handle undefined translation IDs', () => {
    const { result } = renderHook(
      () =>
        usePlanTranslation({
          fee: 5
        }),
      {
        wrapper: Wrapper
      }
    )

    expect(result.current).toEqual({
      fee: 5,
      category: undefined,
      title: undefined,
      items: []
    })
  })
})
