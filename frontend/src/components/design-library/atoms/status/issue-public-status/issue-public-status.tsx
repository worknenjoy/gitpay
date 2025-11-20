import React from 'react'
import { StyledChip, PrivateIconStyled, PublicIconStyled } from './issue-public-status.styles'

// styles migrated to styled-components in issue-public-status.styles.ts

const IssuePublicStatus = ({ status }) => {
  const Status = () => {
    if (status) {
      return (
        <React.Fragment>
          {status === 'private' ? (
            <StyledChip label="Private" icon={<PrivateIconStyled fontSize="small" />} />
          ) : (
            <StyledChip label="Public" icon={<PublicIconStyled fontSize="small" />} />
          )}
        </React.Fragment>
      )
    } else return <div />
  }
  return (
    <React.Fragment>
      <span>
        <Status />
      </span>
    </React.Fragment>
  )
}

export default IssuePublicStatus
