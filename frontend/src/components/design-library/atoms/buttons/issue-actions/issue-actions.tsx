import React from 'react'
import ActionButtons from '../action-buttons/action-buttons'

interface IssueActionsProps {
  role: string
  roles: any
  children?: React.ReactNode
}

const IssueActions = ({ role, roles }: IssueActionsProps) => {
  return <ActionButtons primary={roles[role].primary} secondary={roles[role].secondary} />
}

export default IssueActions
