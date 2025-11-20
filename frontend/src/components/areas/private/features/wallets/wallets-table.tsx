import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Skeleton,
} from '@mui/material'
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@mui/icons-material'

const messages = defineMessages({
  firstPageLabel: {
    id: 'payments.table.page.first',
    defaultMessage: 'First page',
  },
  previousPageLabel: {
    id: 'payment.table.page.previous',
    defaultMessage: 'Previous page',
  },
  nextPageLabel: {
    id: 'payment.table.page.next',
    defaultMessage: 'Next page',
  },
  lastPageLabel: {
    id: 'payment.table.page.last',
    defaultMessage: 'Last page',
  },
  noDefined: {
    id: 'payment.table.date.none',
    defaultMessage: 'Not yet defined',
  },
  noBounty: {
    id: 'payment.table.value.none',
    defaultMessage: 'No bounty added',
  },
  onHoverpaymentProvider: {
    id: 'payment.table.onHover',
    defaultMessage: 'See on',
  },
})

const actionsStyles = {
  root: {
    flexShrink: 0,
    marginLeft: 20,
  },
} as const

const TablePaginationActions = (props) => {
  const intl = useIntl()
  const history = useHistory()
  const handleFirstPageButtonClick = (event) => {
    props.onChangePage(event, 0)
  }

  const handleBackButtonClick = (event) => {
    props.onChangePage(event, props.page - 1)
  }

  const handleNextButtonClick = (event) => {
    props.onChangePage(event, props.page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    props.onChangePage(event, Math.max(0, Math.ceil(props.count / props.rowsPerPage) - 1))
  }

  const { count, page, rowsPerPage, theme } = props

  return (
    <div style={actionsStyles.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label={intl.formatMessage(messages.firstPageLabel)}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label={intl.formatMessage(messages.previousPageLabel)}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={intl.formatMessage(messages.nextPageLabel)}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={intl.formatMessage(messages.lastPageLabel)}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  )
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
}

// removed HOC

const styles = {
  root: {
    width: '100%',
    marginTop: 24,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {},
} as const

const CustomPaginationActionsTable = (props) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const { walletOrders, tableHead } = props
  const emptyRows = walletOrders?.data?.length
    ? rowsPerPage - Math.min(rowsPerPage, walletOrders?.data?.length - page * rowsPerPage)
    : 0

  const TableRowPlaceholder = (
    <>
      {[0, 1, 2, 3, 4, 5, 6].map((_, idx) => (
        <TableRow key={idx}>
          {[0, 1, 2, 3, 4, 5, 6].map((_, cidx) => (
            <TableCell key={cidx}>
              <div style={{ width: 80 }}>
                <Skeleton variant="text" animation="wave" />
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )

  if (walletOrders?.data?.length === 0 && walletOrders.completed) {
    return (
      <Paper style={styles.root}>
        <div
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}
        >
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage
              id="walletOrders.table.body.walletOrders.empty"
              defaultMessage="No Wallet Orders"
            />
          </Typography>
        </div>
      </Paper>
    )
  }

  return (
    <Paper style={styles.root}>
      <div style={styles.tableWrapper}>
        <Table style={styles.table}>
          <TableHead>
            <TableRow>
              {tableHead.map((t) => (
                <TableCell>{t}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!walletOrders.completed ? (
              <>{TableRowPlaceholder}</>
            ) : (
              <>
                {walletOrders?.data
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((n) => {
                    return (
                      <TableRow key={n.id}>
                        {n.map((p) => (
                          <TableCell
                            component="th"
                            scope="row"
                            style={{ padding: 10, position: 'relative' }}
                          >
                            {p}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </Paper>
  )
}

export default CustomPaginationActionsTable
