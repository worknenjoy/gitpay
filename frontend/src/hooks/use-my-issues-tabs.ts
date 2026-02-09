import React from 'react'
import { useHistory, useParams } from 'react-router'
import { useIntl, defineMessages } from 'react-intl'
import useUserTypes from './use-user-types'

const messages = defineMessages({
  myImportedIssues: {
    id: 'myIssues.tabs.imported',
    defaultMessage: 'My imported issues'
  },
  issuesWorking: {
    id: 'myIssues.tabs.working',
    defaultMessage: "Issues I'm working on"
  },
  following: {
    id: 'myIssues.tabs.following',
    defaultMessage: 'Following'
  },
  sponsoring: {
    id: 'myIssues.tabs.sponsoring',
    defaultMessage: 'Sponsoring'
  }
})

const useMyIssuesTabs = ({ user, baseLink, issueTableData }) => {
  const history = useHistory()
  const { filter } = useParams<{ filter: string }>()
  const { isContributor, isMaintainer, isFunding } = useUserTypes({ user })
  const [activeTab, setActiveTab] = React.useState('')
  const intl = useIntl()

  const myIssuesTab = {
    label: intl.formatMessage(messages.myImportedIssues),
    value: 'createdbyme',
    link: `${baseLink}/createdbyme`,
    table: issueTableData
  }

  const workingTabs = {
    label: intl.formatMessage(messages.issuesWorking),
    value: 'assigned',
    link: `${baseLink}/assigned`,
    table: issueTableData
  }

  const followingTabs = {
    label: intl.formatMessage(messages.following),
    value: 'interested',
    link: `${baseLink}/interested`,
    table: issueTableData
  }

  const sponsoringTabs = {
    label: intl.formatMessage(messages.sponsoring),
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
