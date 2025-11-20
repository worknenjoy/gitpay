import React from 'react'
import RequirementList from 'design-library/molecules/lists/requirements-list/requirement-list'

const SendSolutionRequirements = ({
  completed,
  isConnectedToGitHub,
  isAuthorOfPR,
  isPRMerged,
  isIssueClosed,
  hasIssueReference,
  bountyAvailable,
}) => {
  const requirements = [
    { done: bountyAvailable, label: 'The bounty is available' },
    { done: isConnectedToGitHub, label: "You're connected to GitHub" },
    { done: isAuthorOfPR, label: "You're the author of this Pull Request on GitHub" },
    { done: isPRMerged, label: 'The Pull Request / Merge Request was merged' },
    { done: isIssueClosed, label: 'The issue is closed on GitHub' },
    { done: hasIssueReference, label: 'The issue is referenced on the PR' },
  ]

  return <RequirementList requirements={requirements} completed={completed} />
}

export default SendSolutionRequirements
