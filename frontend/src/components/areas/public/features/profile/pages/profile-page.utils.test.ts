import { isProviderType, mapToServiceProviderProfileData } from './profile-page.utils'

describe('isProviderType', () => {
  it('returns true when the "provider" type is present', () => {
    expect(isProviderType([{ name: 'contributor' }, { name: 'provider' }])).toBe(true)
  })

  it('returns false when the "provider" type is absent', () => {
    expect(isProviderType([{ name: 'contributor' }])).toBe(false)
  })

  it('returns false for an undefined/empty types list', () => {
    expect(isProviderType()).toBe(false)
    expect(isProviderType([])).toBe(false)
  })
})

describe('mapToServiceProviderProfileData', () => {
  const baseUser = {
    username: 'alexandremagno',
    createdAt: '2021-03-15T00:00:00Z',
    Types: [{ name: 'provider' }]
  }

  it('returns undefined/null userData unchanged', () => {
    expect(mapToServiceProviderProfileData(undefined)).toBeUndefined()
    expect(mapToServiceProviderProfileData(null)).toBeNull()
  })

  it('sums paidCount across payment links into the identity line', () => {
    const result = mapToServiceProviderProfileData(baseUser, [
      { id: 1, paidCount: 38 },
      { id: 2, paidCount: 14 }
    ])

    expect(result.identity).toEqual(['Provider since 2021', '52 payments'])
  })

  it('singularizes "payment" when the total is exactly 1', () => {
    const result = mapToServiceProviderProfileData(baseUser, [{ id: 1, paidCount: 1 }])

    expect(result.identity).toEqual(['Provider since 2021', '1 payment'])
  })

  it('handles an empty payment links list', () => {
    const result = mapToServiceProviderProfileData(baseUser, [])

    expect(result.identity).toEqual(['Provider since 2021', '0 payments'])
    expect(result.paymentLinks).toEqual([])
  })

  it('sets the role label to "service provider" with a yellow tone', () => {
    const result = mapToServiceProviderProfileData(baseUser, [])

    expect(result.role).toEqual({ name: 'service provider', tone: 'yellow' })
  })

  it('omits role when the user has no "provider" Type', () => {
    const result = mapToServiceProviderProfileData({ ...baseUser, Types: [] }, [])

    expect(result.role).toBeUndefined()
  })

  it('omits the "Provider since" line when createdAt is missing', () => {
    const result = mapToServiceProviderProfileData({ ...baseUser, createdAt: undefined }, [])

    expect(result.identity).toEqual(['0 payments'])
  })
})
