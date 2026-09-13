import {
  isProviderType,
  mapToServiceProviderProfileData,
  isMaintainerType,
  mapToMaintainerProfileData,
  isFundingType,
  mapToFundingProfileData
} from './profile-page.utils'

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

describe('isMaintainerType', () => {
  it('returns true when the "maintainer" type is present', () => {
    expect(isMaintainerType([{ name: 'contributor' }, { name: 'maintainer' }])).toBe(true)
  })

  it('returns false when the "maintainer" type is absent', () => {
    expect(isMaintainerType([{ name: 'contributor' }])).toBe(false)
  })

  it('returns false for an undefined/empty types list', () => {
    expect(isMaintainerType()).toBe(false)
    expect(isMaintainerType([])).toBe(false)
  })
})

describe('mapToMaintainerProfileData', () => {
  const baseUser = {
    username: 'alexandremagno',
    createdAt: '2019-03-15T00:00:00Z',
    Types: [{ name: 'maintainer' }]
  }

  it('returns undefined/null userData unchanged', () => {
    expect(mapToMaintainerProfileData(undefined)).toBeUndefined()
    expect(mapToMaintainerProfileData(null)).toBeNull()
  })

  it('sums paid-out task values (non-open, valued) across all projects', () => {
    const result = mapToMaintainerProfileData(baseUser, [
      {
        id: 1,
        Tasks: [
          { value: 50, status: 'closed' },
          { value: 40, status: 'closed' }
        ]
      },
      {
        id: 2,
        Tasks: [
          { value: 120, status: 'closed' },
          { value: 0, status: 'open' }
        ]
      }
    ])

    expect(result.identity).toEqual(['Maintaining since 2019', '2 active projects'])
    expect(result.stats).toEqual(['$210 paid out'])
  })

  it('ignores open tasks and tasks with no value when summing paid out', () => {
    const result = mapToMaintainerProfileData(baseUser, [
      {
        id: 1,
        Tasks: [
          { value: 100, status: 'open' },
          { value: 0, status: 'closed' }
        ]
      }
    ])

    expect(result.stats).toEqual([])
  })

  it('singularizes "project" when there is exactly 1', () => {
    const result = mapToMaintainerProfileData(baseUser, [{ id: 1, Tasks: [] }])

    expect(result.identity).toEqual(['Maintaining since 2019', '1 active project'])
  })

  it('handles an empty projects list', () => {
    const result = mapToMaintainerProfileData(baseUser, [])

    expect(result.identity).toEqual(['Maintaining since 2019', '0 active projects'])
    expect(result.stats).toEqual([])
  })

  it('sets the role with a teal tone from the "maintainer" Type', () => {
    const result = mapToMaintainerProfileData(baseUser, [])

    expect(result.role).toEqual({ name: 'maintainer', tone: 'teal' })
  })

  it('omits role when the user has no "maintainer" Type', () => {
    const result = mapToMaintainerProfileData({ ...baseUser, Types: [] }, [])

    expect(result.role).toBeUndefined()
  })

  it('omits the "Maintaining since" line when createdAt is missing', () => {
    const result = mapToMaintainerProfileData({ ...baseUser, createdAt: undefined }, [])

    expect(result.identity).toEqual(['0 active projects'])
  })
})

describe('isFundingType', () => {
  it('returns true when the "funding" type is present', () => {
    expect(isFundingType([{ name: 'contributor' }, { name: 'funding' }])).toBe(true)
  })

  it('returns false when the "funding" type is absent', () => {
    expect(isFundingType([{ name: 'contributor' }])).toBe(false)
  })

  it('returns false for an undefined/empty types list', () => {
    expect(isFundingType()).toBe(false)
    expect(isFundingType([])).toBe(false)
  })
})

describe('mapToFundingProfileData', () => {
  const baseUser = {
    username: 'alexandremagno',
    createdAt: '2023-03-15T00:00:00Z',
    Types: [{ name: 'funding' }]
  }

  it('returns undefined/null userData unchanged', () => {
    expect(mapToFundingProfileData(undefined)).toBeUndefined()
    expect(mapToFundingProfileData(null)).toBeNull()
  })

  it('sums bounty values into the stats line and counts them in identity', () => {
    const result = mapToFundingProfileData(baseUser, [
      { id: 1, value: 200 },
      { id: 2, value: 150 },
      { id: 3, value: 300 }
    ])

    expect(result.identity).toEqual(['Funding since 2023', '3 bounties funded'])
    expect(result.stats).toEqual(['$650 funded'])
  })

  it('singularizes "bounty" when there is exactly 1', () => {
    const result = mapToFundingProfileData(baseUser, [{ id: 1, value: 200 }])

    expect(result.identity).toEqual(['Funding since 2023', '1 bounty funded'])
  })

  it('handles an empty bounties list', () => {
    const result = mapToFundingProfileData(baseUser, [])

    expect(result.identity).toEqual(['Funding since 2023', '0 bounties funded'])
    expect(result.stats).toEqual([])
  })

  it('sets the role with a pink tone from the "funding" Type', () => {
    const result = mapToFundingProfileData(baseUser, [])

    expect(result.role).toEqual({ name: 'funding', tone: 'pink' })
  })

  it('omits role when the user has no "funding" Type', () => {
    const result = mapToFundingProfileData({ ...baseUser, Types: [] }, [])

    expect(result.role).toBeUndefined()
  })

  it('omits the "Funding since" line when createdAt is missing', () => {
    const result = mapToFundingProfileData({ ...baseUser, createdAt: undefined }, [])

    expect(result.identity).toEqual(['0 bounties funded'])
  })
})
