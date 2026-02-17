import { expect } from 'chai'

import { sanitizePaymentRequestInstructionsContent } from '../src/utils/sanitize/paymentRequestInstructions'

describe('Payment Request instructions sanitization', () => {
  it('removes script tags', () => {
    const input = '<p>Hello</p><script>alert(1)</script><p>World</p>'
    const output = sanitizePaymentRequestInstructionsContent(input)
    expect(output).to.be.a('string')
    expect(output).to.not.include('<script')
    expect(output).to.not.include('alert(1)')
    expect(output).to.include('<p>Hello</p>')
    expect(output).to.include('<p>World</p>')
  })

  it('removes event handler attributes', () => {
    const input = '<img src="https://example.com/a.png" onerror="alert(1)" />'
    const output = sanitizePaymentRequestInstructionsContent(input)
    expect(output).to.be.a('string')
    expect(output).to.include('src="https://example.com/a.png"')
    expect(output).to.not.include('onerror')
  })

  it('drops javascript: URLs', () => {
    const input = '<a href="javascript:alert(1)">click</a>'
    const output = sanitizePaymentRequestInstructionsContent(input)
    expect(output).to.be.a('string')
    expect(output).to.include('>click</a>')
    expect(output).to.not.include('javascript:')
  })

  it('escapes plain text and converts newlines to <br/>', () => {
    const input = 'Hello\nWorld <3'
    const output = sanitizePaymentRequestInstructionsContent(input)
    expect(output).to.equal('Hello<br/>World &lt;3')
  })
})
