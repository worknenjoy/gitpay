import { expect } from 'chai'
import { extractRefundFailureReason } from '../../../src/services/issues/pendingTasks/refundPendingTasksService'

describe('extractRefundFailureReason', () => {
  it('extracts PayPal issue and description from error body', () => {
    const err = {
      message: '422 - Unprocessable Entity',
      error: {
        name: 'UNPROCESSABLE_ENTITY',
        message: 'The requested action could not be performed',
        details: [
          {
            issue: 'REFUND_TIME_LIMIT_EXCEEDED',
            description: 'The refund time limit for this capture has been exceeded.'
          }
        ]
      }
    }

    expect(extractRefundFailureReason(err)).to.equal(
      'REFUND_TIME_LIMIT_EXCEEDED: The refund time limit for this capture has been exceeded.'
    )
  })

  it('falls back to err.message', () => {
    expect(extractRefundFailureReason(new Error('paypal_capture_missing'))).to.equal(
      'paypal_capture_missing'
    )
  })

  it('handles null/undefined', () => {
    expect(extractRefundFailureReason(null)).to.equal('unknown_error')
  })
})
