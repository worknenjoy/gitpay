import { expect } from 'chai'
import { handleAmount } from '../src/modules/util/handle-amount/handle-amount'

describe('Amount Conversion', () => {
  it('should convert cents to decimal', () => {
    const result = handleAmount(100, 0, 'centavos')
    expect(result.centavos).to.equal(100)
    expect(result.decimal).to.equal(1)
  })

  it('should convert cents to decimal with currency and no fee', () => {
    const result = handleAmount(51666, 0, 'centavos', 'jod')
    expect(result.centavos).to.equal(51666)
    expect(result.decimal).to.equal(51.666)
  })

  it('should convert cents to decimal with currency and a fee', () => {
    const result = handleAmount(10000, 8, 'centavos', 'jod')
    expect(result.centavos).to.equal(9200)
    expect(result.decimal).to.equal(9.2)
  })

  it('should convert decimal to to centavos', () => {
    const result = handleAmount(100, 0, 'decimal')
    expect(result.centavos).to.equal(10000)
    expect(result.decimal).to.equal(100)
  })

  it('should convert decimal to cents', () => {
    const result = handleAmount(1, 0, 'decimal')
    expect(result.centavos).to.equal(100)
    expect(result.decimal).to.equal(1)
  })

  it('should apply percentage reduction', () => {
    const result = handleAmount(200, 10, 'centavos')
    expect(result.centavos).to.equal(180)
    expect(result.decimal).to.equal(1.8)
  })

  it('should handle zero percentage', () => {
    const result = handleAmount(200, 0, 'centavos')
    expect(result.centavos).to.equal(200)
    expect(result.decimal).to.equal(2)
  })
  it('should apply 8 percent reduction to decimal', () => {
    const result = handleAmount(10, 8, 'decimal')
    expect(result.centavos).to.equal(920)
    expect(result.decimal).to.equal(9.2)
  })
  it('should apply 8 percent reduction to centavos', () => {
    const result = handleAmount(100, 8, 'centavos')
    expect(result.centavos).to.equal(92)
    expect(result.decimal).to.equal(0.92)
  })
  it('should apply 8 percent for an amount that will cause rounding', () => {
    const result = handleAmount(4995, 8, 'centavos')
    expect(result.centavos).to.equal(4596)
    expect(result.decimal).to.equal(45.95)
  })
})
