import { expect } from 'chai'
import {
  ALLOWED_USER_SEARCH_FILTERS,
  PUBLIC_USER_ATTRIBUTES,
  publicUserSearchAttributes,
  publicUserSearchWhere
} from '../../../src/utils/auth/public-user-search'

describe('publicUserSearchWhere', () => {
  it('keeps only id, username, and recover_password_token', () => {
    expect(
      publicUserSearchWhere({
        id: '12',
        username: 'leo',
        recover_password_token: 'tok',
        paypal_id: 'hidden',
        email: 'hidden@example.com',
        password: 'hash',
        activation_token: 'act'
      })
    ).to.deep.equal({
      id: '12',
      username: 'leo',
      recover_password_token: 'tok'
    })
  })

  it('ignores empty values', () => {
    expect(publicUserSearchWhere({ id: '', username: 'a' })).to.deep.equal({ username: 'a' })
  })

  it('returns an empty where for a dump of payout fields', () => {
    expect(publicUserSearchWhere({ paypal_id: 'x', account_id: 'y' })).to.deep.equal({})
  })
})

describe('publicUserSearchAttributes', () => {
  it('omits payout and email fields on a public profile lookup', () => {
    const attributes = publicUserSearchAttributes({ id: '1' })
    expect(attributes).to.deep.equal([...PUBLIC_USER_ATTRIBUTES])
    expect(attributes).to.not.include('paypal_id')
    expect(attributes).to.not.include('email')
    expect(attributes).to.not.include('account_id')
    expect(attributes).to.not.include('password')
  })

  it('includes email only when looking up a reset token', () => {
    const attributes = publicUserSearchAttributes({ recover_password_token: 'tok' })
    expect(attributes).to.include('email')
    expect(attributes).to.not.include('paypal_id')
    expect(attributes).to.not.include('account_id')
  })

  it('documents the allow-listed filters', () => {
    expect([...ALLOWED_USER_SEARCH_FILTERS]).to.deep.equal([
      'id',
      'username',
      'recover_password_token'
    ])
  })
})
