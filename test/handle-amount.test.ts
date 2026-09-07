import { expect } from 'chai'
import { calculateAmountWithPercent } from '../src/utils'

describe('Amount Conversion', () => {
  for (const currency of ['jpy', 'JPY', 'krw', 'clp', 'vnd', 'xaf', 'xof', 'vuv', 'xpf', 'rwf']) {
    for (const type of ['centavos', 'decimal']) {
      it(`should preserve whole units for ${currency} in ${type} mode`, () => {
        expect(calculateAmountWithPercent(1000, 8, type, currency)).to.deep.equal({
          centavos: 920,
          decimal: 920,
          decimalFee: 80,
          centavosFee: 80
        })
      })
    }
  }

  it('should retain the two-decimal fallback for an unknown currency', () => {
    expect(calculateAmountWithPercent(1000, 8, 'centavos', 'unknown')).to.deep.equal({
      centavos: 920,
      decimal: 9.2,
      decimalFee: 0.8,
      centavosFee: 80
    })
  })

  it('should convert cents to decimal', () => {
    const result = calculateAmountWithPercent(100, 0, 'centavos')
    expect(result.centavos).to.equal(100)
    expect(result.decimal).to.equal(1)
  })

  it('should convert cents to decimal with currency and no fee', () => {
    const result = calculateAmountWithPercent(51666, 0, 'centavos', 'jod')
    expect(result.centavos).to.equal(51666)
    expect(result.decimal).to.equal(51.666)
  })

  it('should convert cents to decimal with currency and a fee', () => {
    const result = calculateAmountWithPercent(10000, 8, 'centavos', 'jod')
    expect(result.centavos).to.equal(9200)
    expect(result.decimal).to.equal(9.2)
  })

  it('should convert decimal to to centavos', () => {
    const result = calculateAmountWithPercent(100, 0, 'decimal')
    expect(result.centavos).to.equal(10000)
    expect(result.decimal).to.equal(100)
  })

  it('should convert decimal to cents', () => {
    const result = calculateAmountWithPercent(1, 0, 'decimal')
    expect(result.centavos).to.equal(100)
    expect(result.decimal).to.equal(1)
  })

  it('should apply percentage reduction', () => {
    const result = calculateAmountWithPercent(200, 10, 'centavos')
    expect(result.centavos).to.equal(180)
    expect(result.decimal).to.equal(1.8)
  })

  it('should handle zero percentage', () => {
    const result = calculateAmountWithPercent(200, 0, 'centavos')
    expect(result.centavos).to.equal(200)
    expect(result.decimal).to.equal(2)
  })
  it('should apply 8 percent reduction to decimal', () => {
    const result = calculateAmountWithPercent(10, 8, 'decimal')
    expect(result.centavos).to.equal(920)
    expect(result.decimal).to.equal(9.2)
  })
  it('should apply 8 percent reduction to centavos', () => {
    const result = calculateAmountWithPercent(100, 8, 'centavos')
    expect(result.centavos).to.equal(92)
    expect(result.decimal).to.equal(0.92)
  })
  it('should apply 8 percent for an amount that will cause rounding', () => {
    const result = calculateAmountWithPercent(4995, 8, 'centavos')
    expect(result.centavos).to.equal(4596)
    expect(result.decimal).to.equal(45.95)
  })
})
