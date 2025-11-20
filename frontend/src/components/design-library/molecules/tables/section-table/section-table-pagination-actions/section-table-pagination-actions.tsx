import React from 'react'
import { useTheme } from '@mui/material/styles'
import { useIntl } from 'react-intl'

import { IconButton } from '@mui/material'
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@mui/icons-material'
import messages from '../../../../../../messages/messages'
import { Root } from './section-table-pagination-actions.styles'

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
  const theme = useTheme()
  const intl = useIntl()

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange?.(event, 0)
  }

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange?.(event, page - 1)
  }

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange?.(event, page + 1)
  }

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange?.(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  const { direction } = theme
  const isRtl = direction && direction === 'rtl'

  return (
    <Root>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label={intl.formatMessage(messages.firstPageLabel)}
      >
        {isRtl ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label={intl.formatMessage(messages.previousPageLabel)}
      >
        {isRtl ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={intl.formatMessage(messages.nextPageLabel)}
      >
        {isRtl ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={intl.formatMessage(messages.lastPageLabel)}
      >
        {isRtl ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Root>
  )
}

export default TablePaginationActions
