import React, { useEffect } from 'react'
import IssuePublicPageComponent from 'design-library/pages/public-pages/issue-public-page/issue-public-page'
import { useParams } from 'react-router-dom'

const IssuePublicPage = (props) => {
  const { fetchTask, syncTask } = props
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (fetchTask) {
      fetchTask(id)
    }
    if (syncTask) {
      syncTask(id)
    }
  }, [id])

  return <IssuePublicPageComponent {...props} />
}

export default IssuePublicPage
