import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import RequirementList from 'design-library/molecules/lists/requirements-list/requirement-list'

const messages = defineMessages({
  bountyAvailable: {
    id: 'solution.requirements.bountyAvailable',
    defaultMessage: 'The bounty is available'
  },
  connectedToGitHub: {
    id: 'solution.requirements.connectedToGitHub',
    defaultMessage: "You're connected to GitHub"
  },
  authorOfPR: {
    id: 'solution.requirements.authorOfPR',
    defaultMessage: "You're the author of this Pull Request on GitHub"
  },
  prMerged: {
    id: 'solution.requirements.prMerged',
    defaultMessage: 'The Pull Request / Merge Request was merged'
  },
  issueClosed: {
    id: 'solution.requirements.issueClosed',
    defaultMessage: 'The issue is closed on GitHub'
  },
  issueReferenced: {
    id: 'solution.requirements.issueReferenced',
    defaultMessage: 'The issue is referenced on the PR'
  }
})

const SendSolutionRequirements = ({
  completed,
  isConnectedToGitHub,
  isAuthorOfPR,
  isPRMerged,
  isIssueClosed,
  hasIssueReference,
  bountyAvailable
}) => {
  const intl = useIntl()
  
  const requirements = [
    { done: bountyAvailable, label: intl.formatMessage(messages.bountyAvailable) },
    { done: isConnectedToGitHub, label: intl.formatMessage(messages.connectedToGitHub) },
    { done: isAuthorOfPR, label: intl.formatMessage(messages.authorOfPR) },
    { done: isPRMerged, label: intl.formatMessage(messages.prMerged) },
    { done: isIssueClosed, label: intl.formatMessage(messages.issueClosed) },
    { done: hasIssueReference, label: intl.formatMessage(messages.issueReferenced) }
  ]

  return <RequirementList requirements={requirements} completed={completed} />
}

export default SendSolutionRequirements
