import { expect } from 'chai'
import {
  USER_SECRET_ATTRIBUTES,
  publicUserInclude
} from '../../../src/utils/auth/user-secret-attributes'

describe('publicUserInclude', () => {
  it('excludes credential attributes from sequelize User includes', () => {
    const User = { name: 'User' }
    expect(publicUserInclude(User, 'destination')).to.deep.equal({
      model: User,
      as: 'destination',
      attributes: { exclude: [...USER_SECRET_ATTRIBUTES] }
    })
  })

  it('omits password hashes and payout identifiers', () => {
    expect([...USER_SECRET_ATTRIBUTES]).to.include.members([
      'password',
      'paypal_id',
      'account_id',
      'customer_id',
      'activation_token'
    ])
  })
})
