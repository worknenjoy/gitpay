import { expect } from 'chai'
import { omitRegisterSecrets } from '../../../src/utils/auth/omit-register-secrets'

describe('omitRegisterSecrets', () => {
  it('drops password hashes and payout ids but keeps activation_token', () => {
    const sanitized = omitRegisterSecrets({
      id: 8817,
      email: 'user@example.com',
      password: '$2b$08$examplehash',
      activation_token: 'token-needed-to-confirm',
      paypal_id: 'hidden',
      customer_id: 'cus_hidden',
      recover_password_token: 'reset'
    })

    expect(sanitized).to.deep.equal({
      id: 8817,
      email: 'user@example.com',
      activation_token: 'token-needed-to-confirm'
    })
  })

  it('plain-ifies sequelize-like instances', () => {
    const instance = {
      dataValues: {
        id: 2,
        email: 'a@b.c',
        password: 'hash',
        activation_token: 'tok'
      },
      get({ plain }: { plain: boolean }) {
        expect(plain).to.equal(true)
        return { ...this.dataValues }
      }
    }

    expect(omitRegisterSecrets(instance)).to.deep.equal({
      id: 2,
      email: 'a@b.c',
      activation_token: 'tok'
    })
  })
})
