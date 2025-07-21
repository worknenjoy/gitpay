const { expect } = require('chai');
const { convertAmount } = require('../modules/util/handle-amount/handle-amount');

describe('Amount Conversion', () => {
  it('should convert cents to decimal', () => {
    const result = convertAmount(100, 0, 'centavos');
    expect(result.centavos).to.equal(100);
    expect(result.decimal).to.equal(1);
  });

  it('should convert decimal to cents', () => {
    const result = convertAmount(1, 0, 'decimal');
    expect(result.centavos).to.equal(100);
    expect(result.decimal).to.equal(1);
  });

  it('should apply percentage reduction', () => {
    const result = convertAmount(200, 10, 'centavos');
    expect(result.centavos).to.equal(180);
    expect(result.decimal).to.equal(1.8);
  });

  it('should handle zero percentage', () => {
    const result = convertAmount(200, 0, 'centavos');
    expect(result.centavos).to.equal(200);
    expect(result.decimal).to.equal(2);
  });
  it('should apply 8 percent reduction to decimal', () => {
    const result = convertAmount(10, 8, 'decimal');
    expect(result.centavos).to.equal(920);
    expect(result.decimal).to.equal(9.2);
  });
  it('should apply 8 percent reduction to centavos', () => {
    const result = convertAmount(100, 8, 'centavos');
    expect(result.centavos).to.equal(92);
    expect(result.decimal).to.equal(0.92);
  });
});
