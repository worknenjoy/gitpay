import React from 'react'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { DocsAlertRoot, IconCenter, Text, DocsLink } from './docs-alert.styles'

export type DocsAlertProps = {
  text: React.ReactNode
  docsUrl: string
  linkLabel?: React.ReactNode
}

export const DocsAlert = ({ text, docsUrl, linkLabel }: DocsAlertProps) => {
  return (
    <DocsAlertRoot>
      <IconCenter>
        <MenuBookIcon fontSize="small" />
      </IconCenter>
      <div>
        <Text>
          {text}{' '}
          <DocsLink href={docsUrl} target="_blank" rel="noopener noreferrer">
            {linkLabel ?? 'Read the guide'} <OpenInNewIcon sx={{ fontSize: 12 }} />
          </DocsLink>
        </Text>
      </div>
    </DocsAlertRoot>
  )
}

export default DocsAlert
