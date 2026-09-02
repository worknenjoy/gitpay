import React, { useEffect } from 'react'
import IssuePublicPageComponent from 'design-library/pages/public-pages/issue-public-page/issue-public-page'
import { useParams, useLocation, useHistory } from 'react-router-dom'

const IssuePublicPage = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fetchTask, syncTask, addNotification, account, fetchAccount, ...rest } = props
  const { id, status } = useParams<{ id: string; status?: string }>()
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    if (status === 'success') {
      addNotification('task.order.payment.success')
    }
    if (status === 'error' || status === 'failed') {
      addNotification('task.order.payment.error', { severity: 'error' })
    }
  }, [id, status])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('paid') === '1') {
      addNotification('task.order.payment.success')
      params.delete('paid')
      params.delete('orderId')
      const remaining = params.toString()
      history.replace({ pathname: location.pathname, search: remaining ? `?${remaining}` : '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.search])

  useEffect(() => {
    if (fetchTask) {
      fetchTask(id)
    }
    if (syncTask) {
      syncTask(id)
    }
  }, [id, status])

  return <IssuePublicPageComponent {...rest} addNotification={addNotification} fetchTask={fetchTask} syncTask={syncTask} />
}

export default IssuePublicPage
