import React, { useEffect } from 'react'
import IssuePublicPageComponent from 'design-library/pages/public-pages/issue-public-page/issue-public-page'
import { useParams } from 'react-router-dom'

const IssuePublicPage = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fetchTask, syncTask, addNotification, account, fetchAccount, ...rest } = props
  const { id, status } = useParams<{ id: string; status?: string }>()

  useEffect(() => {
    if (status === 'success') {
      addNotification('The PayPal payment was completed successfully!', { variant: 'success' })
    }
    if (status === 'failed') {
      addNotification('There was an error processing the PayPal payment.', { variant: 'error' })
    }
  }, [id, status])

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
