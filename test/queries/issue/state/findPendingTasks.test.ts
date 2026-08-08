import { expect } from 'chai'
import {
  classifyPendingTaskAction,
  isRefundEligibleAction
} from '../../../../src/queries/issue/state/findPendingTasks'

describe('Queries - Issue - State - findPendingTasks classification', () => {
  it('classifies unclaimed without stale_at as pending_claim', () => {
    const action = classifyPendingTaskAction(
      { status: 'closed', state: 'funded', stale_at: null, claim_retries: 0 },
      true
    )
    expect(action).to.equal('pending_claim')
    expect(isRefundEligibleAction(action)).to.equal(false)
  })

  it('classifies stale + closed + funded unclaimed as stale_unclaimed_eligible_for_refund', () => {
    const action = classifyPendingTaskAction(
      {
        status: 'closed',
        state: 'funded',
        stale_at: new Date('2026-01-01'),
        claim_retries: 0
      },
      true
    )
    expect(action).to.equal('stale_unclaimed_eligible_for_refund')
    expect(isRefundEligibleAction(action)).to.equal(true)
  })

  it('classifies non-unclaimed funded as eligible_for_refund', () => {
    const action = classifyPendingTaskAction(
      { status: 'open', state: 'funded', stale_at: null },
      false
    )
    expect(action).to.equal('eligible_for_refund')
    expect(isRefundEligibleAction(action)).to.equal(true)
  })

  it('does not mark stale unclaimed as refund-eligible if state is not funded', () => {
    const action = classifyPendingTaskAction(
      {
        status: 'closed',
        state: 'claimed',
        stale_at: new Date('2026-01-01')
      },
      true
    )
    expect(action).to.equal('pending_claim')
  })
})
