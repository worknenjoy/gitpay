import React from 'react'
import { useHistory, useParams } from 'react-router'
import useUserTypes from './use-user-types'

const useMyIssuesTabs = ({ user, baseLink, issueTableData }) => {
  const history = useHistory()
  const { filter } = useParams<{ filter: string }>()
  const { isContributor, isMaintainer } = useUserTypes({ user })
  const [ activeTab, setActiveTab ] = React.useState('')

  const myIssuesTab = {
    label: 'My imported issues',
    value: 'createdbyme',
    link: `${baseLink}/createdbyme`,
    table: issueTableData
  }

  const workingTabs = {
    label: 'Issues I\'m working on',
    value: 'assigned',
    link: `${baseLink}/assigned`,
    table: issueTableData
  }

  const followingTabs = {
    label: 'Following',
    value: 'interested',
    link: `${baseLink}/interested`,
    table: issueTableData
  }

  const currentTabs = [
    ...(isMaintainer ? [myIssuesTab] : []),
    ...(isContributor ? [workingTabs, followingTabs] : [])
  ]

  React.useEffect(() => {
    const currentFirstTabByRole = isMaintainer ? 'createdbyme' : isContributor ? 'assigned' : 'createdbyme'
    history.push(`${baseLink}/${currentFirstTabByRole}`)
    setActiveTab(currentFirstTabByRole)
  }, [isContributor, isMaintainer])

  React.useEffect(() => {
   setActiveTab(filter)
  }, [filter])

  return { currentTabs, activeTab }
}

export default useMyIssuesTabs