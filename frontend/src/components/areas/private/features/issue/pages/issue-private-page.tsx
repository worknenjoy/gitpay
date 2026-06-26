import React, { useEffect } from 'react'
import IssuePrivatePageComponent from 'design-library/pages/private-pages/issue-pages/issue-private-page/issue-private-page'
import { useParams } from 'react-router-dom'

const IssuePrivatePage = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fetchTask, syncTask, account, fetchAccount, ...rest } = props
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (fetchTask) {
      fetchTask(id)
    }
    if (syncTask) {
      syncTask(id)
    }
  }, [id])

  return <IssuePrivatePageComponent {...rest} fetchTask={fetchTask} syncTask={syncTask} />
}

export default IssuePrivatePage
