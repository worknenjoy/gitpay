import { expect } from 'chai'
import {
  ALLOWED_USER_SEARCH_FILTERS,
  PUBLIC_USER_ATTRIBUTES,
  publicUserSearchAttributes,
  publicUserSearchWhere
} from '../../../src/utils/auth/public-user-search'
import { USER_SENSITIVE_ATTRIBUTES } from '../../../src/queries/user/userSensitiveAttributes'
import fs from 'fs'
import path from 'path'

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
  })

  it('documents the allow-listed filters', () => {
    expect([...ALLOWED_USER_SEARCH_FILTERS]).to.deep.equal([
      'id',
      'username',
      'recover_password_token'
    ])
  })
})

describe('remaining public list endpoints', () => {
  const read = (rel: string) =>
    fs.readFileSync(path.join(__dirname, '../../../', rel), 'utf8')

  it('organizationList excludes USER_SENSITIVE_ATTRIBUTES on the nested User', () => {
    const src = read('src/modules/organizations/organizationList.ts')
    expect(src).to.include('USER_SENSITIVE_ATTRIBUTES')
    expect(src).to.include('exclude:')
    expect(USER_SENSITIVE_ATTRIBUTES).to.include.members(['password', 'paypal_id'])
  })

  it('projectList and projectFetch exclude USER_SENSITIVE_ATTRIBUTES on Task.User', () => {
    const listSrc = read('src/modules/projects/projectList.ts')
    const fetchSrc = read('src/modules/projects/projectFetch.ts')
    expect(listSrc).to.include('USER_SENSITIVE_ATTRIBUTES')
    expect(fetchSrc).to.include('USER_SENSITIVE_ATTRIBUTES')
  })
})
