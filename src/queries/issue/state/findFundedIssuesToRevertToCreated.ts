import findFundedIssues from './findFundedIssues'

const findFundedIssuesToRevertToCreated = async () => {
  const fundedTasks = await findFundedIssues()

  return fundedTasks.filter((task: any) => {
    const orders = task.Orders ?? []
    const hasSucceededOrder = orders.some((o: any) => o.status === 'succeeded')
    const hasRefundedOrder = orders.some((o: any) => o.status === 'refunded')
    return !hasSucceededOrder && hasRefundedOrder
  })
}

export default findFundedIssuesToRevertToCreated
