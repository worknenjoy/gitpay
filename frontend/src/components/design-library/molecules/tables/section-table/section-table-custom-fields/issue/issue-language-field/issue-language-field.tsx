import React from 'react'
import { Chip } from '@mui/material'
import TextEllipsis from 'text-ellipsis'

const IssueLanguageField = ({ issue }) => {
  const { Project: project } = issue
  return project?.ProgrammingLanguages?.length ? (
    <div>
      {project?.ProgrammingLanguages?.slice(0, 2).map((language, index) => (
        <Chip
          style={{ marginRight: 5, marginBottom: 5 }}
          size="small"
          label={TextEllipsis(`${language.name || ''}`, 10)}
        />
      ))}{' '}
      ...
    </div>
  ) : (
    <>-</>
  )
}

export default IssueLanguageField
