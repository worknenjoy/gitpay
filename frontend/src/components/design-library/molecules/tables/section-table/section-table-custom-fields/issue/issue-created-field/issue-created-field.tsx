import React from 'react'
import CreatedField from '../../base/created-field/created-field'

const IssueCreatedField = ({ issue }) => {
  const { createdAt } = issue
  return <CreatedField createdAt={createdAt} />
}

export default IssueCreatedField
