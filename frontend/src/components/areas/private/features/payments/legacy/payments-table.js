import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import { withRouter } from 'react-router-dom'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Skeleton
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon
} from '@mui/icons-material'
import slugify from '@sindresorhus/slugify'

const messages = defineMessages({
  firstPageLabel: {
    id: 'payments.table.page.first',
    defaultMessage: 'First page'
  },
  previousPageLabel: {
    id: 'payment.table.page.previous',
    defaultMessage: 'Previous page'
  },
  nextPageLabel: {
    id: 'payment.table.page.next',
    defaultMessage: 'Next page'
  },
  lastPageLabel: {
    id: 'payment.table.page.last',
    defaultMessage: 'Last page'
  },
  noDefined: {
    id: 'payment.table.date.none',
    defaultMessage: 'Not yet defined'
  },
  noBounty: {
    id: 'payment.table.value.none',
    defaultMessage: 'No bounty added'
  },
  onHoverpaymentProvider: {
    id: 'payment.table.onHover',
    defaultMessage: 'See on'
  }
})

const ActionsRoot = styled('div')(({ theme }) => ({
  flexShrink: 0,
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(2.5)
}))

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = (event) => {
    this.props.onChangePage(event, 0)
  }

  handleBackButtonClick = (event) => {
    this.props.onChangePage(event, this.props.page - 1)
  }

  handleNextButtonClick = (event) => {
    this.props.onChangePage(event, this.props.page + 1)
  }

  handleLastPageButtonClick = (event) => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    )
  }

  render() {
    const { count, page, rowsPerPage, theme } = this.props

    return (
      <ActionsRoot>
        <IconButton
          onClick={(e) => this.handleFirstPageButtonClick(e)}
          disabled={page === 0}
          aria-label={this.props.intl.formatMessage(messages.firstPageLabel)}
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={(e) => this.handleBackButtonClick(e)}
          disabled={page === 0}
          aria-label={this.props.intl.formatMessage(messages.previousPageLabel)}
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={(e) => this.handleNextButtonClick(e)}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label={this.props.intl.formatMessage(messages.nextPageLabel)}
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={(e) => this.handleLastPageButtonClick(e)}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label={this.props.intl.formatMessage(messages.lastPageLabel)}
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </ActionsRoot>
    )
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
}

const TablePaginationActionsWrapped = injectIntl((props) => <TablePaginationActions {...props} />)

const RootPaper = styled(Paper)(({ theme }) => ({ width: '100%', marginTop: theme.spacing(3) }))
const TableWrapper = styled('div')(({ theme }) => ({ overflowX: 'auto' }))

class CustomPaginationActionsTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 0,
      rowsPerPage: 10
    }
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value })
  }

  handleClickListItem = (payment) => {
    this.props.history.push(`/payment/${payment.id}/${slugify(payment.title)}`)
  }

  goToProject = (e, id, organizationId) => {
    e.preventDefault()
    window.location.href = '/#/organizations/' + organizationId + '/projects/' + id
    window.location.reload()
  }

  render() {
    const { payments, tableHead } = this.props
    const { rowsPerPage, page } = this.state
    const emptyRows = payments?.data?.length
      ? rowsPerPage - Math.min(rowsPerPage, payments?.data?.length - page * rowsPerPage)
      : 0

    const TableRowPlaceholder = [0, 1, 2, 3, 4, 5, 6].map((_, rIdx) => (
      <TableRow key={`ph-${rIdx}`}>
        {[0, 1, 2, 3, 4, 5, 6].map((_, cIdx) => (
          <TableCell key={`phc-${cIdx}`}>
            <div style={{ width: 80 }}>
              <Skeleton variant="text" />
            </div>
          </TableCell>
        ))}
      </TableRow>
    ))

    return (
      <RootPaper>
        <TableWrapper>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                {tableHead.map((t) => (
                  <TableCell>{t}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!payments.completed ? (
                <>{TableRowPlaceholder}</>
              ) : (
                <>
                  {payments?.data
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
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={payments?.data?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={(e, page) => this.handleChangePage(e, page)}
                  onChangeRowsPerPage={(e, page) => this.handleChangeRowsPerPage(e, page)}
                  Actions={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableWrapper>
      </RootPaper>
    )
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  payments: PropTypes.object
}

export default injectIntl(withRouter(CustomPaginationActionsTable))
