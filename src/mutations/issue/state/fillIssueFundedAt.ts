export const fillIssueFundedAt = async (task: any) => {
  const orders: any[] = task.Orders || []
  if (orders.length === 0) return null

  const sorted = [...orders].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
  const fundedAt = sorted[0].createdAt

  await task.update({ funded_at: fundedAt })
  await task.reload()
  return task
}
