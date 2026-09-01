import { expect } from 'chai'
import Models from '../../src/models'

const models = Models as any

describe('Plan.calcFinalPrice', () => {
  it('should keep the exact fee-inclusive cents amount instead of rounding to a whole dollar', () => {
    // 20 + 8% open source fee = 21.6, previously rounded up to 22.
    expect(models.Plan.calcFinalPrice(20, 'open source')).to.equal(21.6)
  })

  it('should preserve cents for a private plan', () => {
    // 20 + 18% private fee = 23.6
    expect(models.Plan.calcFinalPrice(20, 'private')).to.equal(23.6)
  })

  it('should preserve cents for a full/with-support plan', () => {
    // 20 + 30% fee = 26
    expect(models.Plan.calcFinalPrice(20, 'full')).to.equal(26)
  })

  it('should charge no fee for open source amounts of 5000 or more', () => {
    expect(models.Plan.calcFinalPrice(5000, 'open source')).to.equal(5000)
  })

  it('should default to the open source fee when no plan is given', () => {
    expect(models.Plan.calcFinalPrice(20)).to.equal(21.6)
  })
})
