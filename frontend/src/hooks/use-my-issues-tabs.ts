import React from 'react'
import { useHistory, useParams } from 'react-router'
import useUserTypes from './use-user-types'

const useMyIssuesTabs = ({ user, baseLink, issueTableData }) => {
  const history = useHistory()
  const { filter } = useParams<{ filter: string }>()
  const { isContributor, isMaintainer, isFunding } = useUserTypes({ user })
  const [activeTab, setActiveTab] = React.useState('')

  const myIssuesTab = {
    label: 'My imported issues',
    value: 'createdbyme',
    link: `${baseLink}/createdbyme`,
    table: issueTableData,
  }

  const workingTabs = {
    label: "Issues I'm working on",
    value: 'assigned',
    link: `${baseLink}/assigned`,
    table: issueTableData,
  }

  const followingTabs = {
    label: 'Following',
    value: 'interested',
    link: `${baseLink}/interested`,
    table: issueTableData,
  }

  const sponsoringTabs = {
    label: 'Sponsoring',
    value: 'supported',
    link: `${baseLink}/supported`,
    table: issueTableData,
  }

  const currentTabs = [
    ...(isMaintainer ? [myIssuesTab] : []),
    ...(isFunding ? [sponsoringTabs] : []),
    ...(isContributor ? [workingTabs, followingTabs] : []),
  ]

  React.useEffect(() => {
    const currentFirstTabByRole = isMaintainer
      ? 'createdbyme'
      : isContributor
        ? 'assigned'
        : isFunding
          ? 'supported'
          : ''
    history.push(`${baseLink}/${currentFirstTabByRole}`)
    setActiveTab(currentFirstTabByRole)
  }, [isContributor, isMaintainer, isFunding])

  React.useEffect(() => {
    setActiveTab(filter)
  }, [filter])

  return { currentTabs, activeTab }
}

export default useMyIssuesTabs
