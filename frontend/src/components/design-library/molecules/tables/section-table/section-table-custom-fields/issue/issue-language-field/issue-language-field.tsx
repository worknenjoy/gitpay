import React from 'react'
import { Chip, Typography } from '@mui/material'
import TextEllipsis from 'text-ellipsis'

const LANGUAGE_COLORS: Record<string, { bg: string; color: string }> = {
  JavaScript:  { bg: '#fef9c3', color: '#713f12' },
  TypeScript:  { bg: '#dbeafe', color: '#1e40af' },
  CSS:         { bg: '#ede9fe', color: '#5b21b6' },
  Python:      { bg: '#dbeafe', color: '#1d4ed8' },
  Go:          { bg: '#cffafe', color: '#155e75' },
  MDX:         { bg: '#ede9fe', color: '#6d28d9' },
  Ruby:        { bg: '#fce7f3', color: '#9d174d' },
  Rust:        { bg: '#ffedd5', color: '#9a3412' },
  HTML:        { bg: '#fee2e2', color: '#991b1b' },
  Java:        { bg: '#fef3c7', color: '#92400e' },
  PHP:         { bg: '#ede9fe', color: '#5b21b6' },
  Shell:       { bg: '#dcfce7', color: '#166534' },
  React:       { bg: '#dbeafe', color: '#1e40af' },
  Vue:         { bg: '#dcfce7', color: '#166534' },
  Swift:       { bg: '#ffedd5', color: '#9a3412' },
  Kotlin:      { bg: '#ede9fe', color: '#5b21b6' },
  Dart:        { bg: '#cffafe', color: '#155e75' },
}
const DEFAULT_LANG_COLOR = { bg: '#f3f4f6', color: '#374151' }

const IssueLanguageField = ({ issue }) => {
  const { Project: project } = issue
  const languages = project?.ProgrammingLanguages
  return languages?.length ? (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
      {languages.slice(0, 2).map((language) => {
        const { bg, color } = LANGUAGE_COLORS[language.name] ?? DEFAULT_LANG_COLOR
        return (
          <Chip
            key={language.name}
            size="small"
            sx={{ backgroundColor: bg, color, border: 'none', fontWeight: 500 }}
            label={TextEllipsis(`${language.name || ''}`, 10)}
          />
        )
      })}
      {languages.length > 2 && (
        <Typography variant="caption" color="text.secondary">
          +{languages.length - 2}
        </Typography>
      )}
    </div>
  ) : (
    <>-</>
  )
}

export default IssueLanguageField
