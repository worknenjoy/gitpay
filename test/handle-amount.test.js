const { expect } = require('chai');
const { handleAmount } = require('../modules/util/handle-amount/handle-amount');

describe('Amount Conversion', () => {
  it('should convert cents to decimal', () => {
    const result = handleAmount(100, 0, 'centavos');
    expect(result.centavos).to.equal(100);
    expect(result.decimal).to.equal(1);
  });

  it('should convert decimal to cents', () => {
    const result = handleAmount(1, 0, 'decimal');
    expect(result.centavos).to.equal(100);
    expect(result.decimal).to.equal(1);
  });

  it('should apply percentage reduction', () => {
    const result = handleAmount(200, 10, 'centavos');
    expect(result.centavos).to.equal(180);
    expect(result.decimal).to.equal(1.8);
  });

  it('should handle zero percentage', () => {
    const result = handleAmount(200, 0, 'centavos');
    expect(result.centavos).to.equal(200);
    expect(result.decimal).to.equal(2);
  });
  it('should apply 8 percent reduction to decimal', () => {
    const result = handleAmount(10, 8, 'decimal');
    expect(result.centavos).to.equal(920);
    expect(result.decimal).to.equal(9.2);
  });
  it('should apply 8 percent reduction to centavos', () => {
    const result = handleAmount(100, 8, 'centavos');
    expect(result.centavos).to.equal(92);
    expect(result.decimal).to.equal(0.92);
  });
});
