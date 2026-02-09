import React from 'react'
import { FormattedMessage } from 'react-intl'
import RequirementList from 'design-library/molecules/lists/requirements-list/requirement-list'

const SendSolutionRequirements = ({
  completed,
  isConnectedToGitHub,
  isAuthorOfPR,
  isPRMerged,
  isIssueClosed,
  hasIssueReference,
  bountyAvailable
}) => {
  const requirements = [
    { done: bountyAvailable, label: <FormattedMessage id="solution.requirements.bountyAvailable" defaultMessage="The bounty is available" /> },
    { done: isConnectedToGitHub, label: <FormattedMessage id="solution.requirements.connectedToGitHub" defaultMessage="You're connected to GitHub" /> },
    { done: isAuthorOfPR, label: <FormattedMessage id="solution.requirements.authorOfPR" defaultMessage="You're the author of this Pull Request on GitHub" /> },
    { done: isPRMerged, label: <FormattedMessage id="solution.requirements.prMerged" defaultMessage="The Pull Request / Merge Request was merged" /> },
    { done: isIssueClosed, label: <FormattedMessage id="solution.requirements.issueClosed" defaultMessage="The issue is closed on GitHub" /> },
    { done: hasIssueReference, label: <FormattedMessage id="solution.requirements.issueReferenced" defaultMessage="The issue is referenced on the PR" /> }
  ]

  return <RequirementList requirements={requirements} completed={completed} />
}

export default SendSolutionRequirements
