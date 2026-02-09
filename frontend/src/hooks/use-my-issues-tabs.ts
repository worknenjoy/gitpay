import React from 'react'
import { useHistory, useParams } from 'react-router'
import { FormattedMessage } from 'react-intl'
import useUserTypes from './use-user-types'

const useMyIssuesTabs = ({ user, baseLink, issueTableData }) => {
  const history = useHistory()
  const { filter } = useParams<{ filter: string }>()
  const { isContributor, isMaintainer, isFunding } = useUserTypes({ user })
  const [activeTab, setActiveTab] = React.useState('')

  const myIssuesTab = {
    label: <FormattedMessage id="myIssues.tabs.imported" defaultMessage="My imported issues" />,
    value: 'createdbyme',
    link: `${baseLink}/createdbyme`,
    table: issueTableData
  }

  const workingTabs = {
    label: <FormattedMessage id="myIssues.tabs.working" defaultMessage="Issues I'm working on" />,
    value: 'assigned',
    link: `${baseLink}/assigned`,
    table: issueTableData
  }

  const followingTabs = {
    label: <FormattedMessage id="myIssues.tabs.following" defaultMessage="Following" />,
    value: 'interested',
    link: `${baseLink}/interested`,
    table: issueTableData
  }

  const sponsoringTabs = {
    label: <FormattedMessage id="myIssues.tabs.sponsoring" defaultMessage="Sponsoring" />,
    value: 'supported',
    link: `${baseLink}/supported`,
    table: issueTableData
  }

  const currentTabs = [
    ...(isMaintainer ? [myIssuesTab] : []),
    ...(isFunding ? [sponsoringTabs] : []),
    ...(isContributor ? [workingTabs, followingTabs] : [])
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
