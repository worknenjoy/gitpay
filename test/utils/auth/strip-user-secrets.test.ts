import { expect } from 'chai'
import {
  USER_SECRET_ATTRIBUTES,
  publicUserInclude,
  stripUserSecrets
} from '../../../src/utils/auth/strip-user-secrets'

describe('stripUserSecrets', () => {
  it('removes credential fields from a nested public task payload', () => {
    const payload = {
      id: 1224,
      title: 'i18n',
      User: {
        id: 1,
        name: 'Owner',
        password: '$2b$08$not-a-real-hash',
        paypal_id: 'secret@example.com',
        customer_id: 'cus_secret'
      },
      orders: [
        {
          id: 10,
          amount: '50',
          User: {
            id: 2,
            name: 'Funder',
            email: 'funder@example.com',
            password: '$2b$08$also-not-real',
            recover_password_token: 'reset-token',
            activation_token: 'activate-token',
            email_change_token: 'change-token',
            paypal_id: 'paypal-secret',
            customer_id: 'cus_funder',
            account_id: 'acct_funder',
            whop_account_id: 'whop_funder',
            pending_email_change: 'new@example.com'
          }
        }
      ],
      Offers: [
        {
          id: 3,
          User: {
            id: 4,
            username: 'solver',
            password: 'hash'
          }
        }
      ],
      assignedUser: {
        id: 5,
        name: 'Assignee',
        password: 'hash',
        paypal_id: 'hidden'
      }
    }

    const sanitized = stripUserSecrets(payload)

    expect(sanitized.id).to.equal(1224)
    expect(sanitized.User.name).to.equal('Owner')
    expect(sanitized.User).to.not.have.property('password')
    expect(sanitized.User).to.not.have.property('paypal_id')
    expect(sanitized.User).to.not.have.property('customer_id')
    expect(sanitized.orders[0].User.email).to.equal('funder@example.com')
    expect(sanitized.orders[0].User.name).to.equal('Funder')
    for (const key of USER_SECRET_ATTRIBUTES) {
      expect(sanitized.orders[0].User).to.not.have.property(key)
    }
    expect(JSON.stringify(sanitized)).to.not.include('$2b$08$')
    expect(JSON.stringify(sanitized)).to.not.include('paypal-secret')
    expect(JSON.stringify(sanitized)).to.not.include('cus_funder')
    expect(JSON.stringify(sanitized)).to.not.include('reset-token')
    expect(sanitized.Offers[0].User.username).to.equal('solver')
    expect(sanitized.Offers[0].User).to.not.have.property('password')
    expect(sanitized.assignedUser.name).to.equal('Assignee')
    expect(sanitized.assignedUser).to.not.have.property('password')
    expect(sanitized.assignedUser).to.not.have.property('paypal_id')
  })

  it('leaves non-objects and dates unchanged', () => {
    expect(stripUserSecrets(null)).to.equal(null)
    expect(stripUserSecrets(12)).to.equal(12)
    const date = new Date('2026-09-01T00:00:00.000Z')
    expect(stripUserSecrets(date)).to.equal(date)
  })

  it('strips hashes and tokens from a register-style user payload', () => {
    const registerBody = {
      id: 8815,
      email: 'user@example.com',
      name: 'Leo',
      password: '$2b$08$examplehash',
      activation_token: 'a'.repeat(64),
      recover_password_token: null,
      paypal_id: null,
      customer_id: null
    }
    const sanitized = stripUserSecrets(registerBody)
    expect(sanitized).to.deep.equal({
      id: 8815,
      email: 'user@example.com',
      name: 'Leo'
    })
  })

  it('plain-ifies sequelize-like instances before stripping', () => {
    const instance = {
      dataValues: {
        id: 9,
        name: 'Nested',
        password: 'hash',
        paypal_id: 'hidden'
      },
      get({ plain }: { plain: boolean }) {
        expect(plain).to.equal(true)
        return { ...this.dataValues }
      }
    }

    const sanitized = stripUserSecrets({ User: instance })
    expect(sanitized.User).to.deep.equal({ id: 9, name: 'Nested' })
  })
})

describe('publicUserInclude', () => {
  it('excludes credential attributes from sequelize User includes', () => {
    const User = { name: 'User' }
    expect(publicUserInclude(User)).to.deep.equal({
      model: User,
      attributes: { exclude: [...USER_SECRET_ATTRIBUTES] }
    })
  })
})
