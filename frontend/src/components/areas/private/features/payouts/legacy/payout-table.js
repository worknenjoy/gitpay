import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  Typography,
  withStyles,
  Paper,
  IconButton,
  Skeleton
} from '@mui/material'
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon
} from '@mui/icons-material'
import slugify from '@sindresorhus/slugify'

const messages = defineMessages({
  firstPageLabel: {
    id: 'payouts.table.page.first',
    defaultMessage: 'First page'
  },
  previousPageLabel: {
    id: 'transfer.table.page.previous',
    defaultMessage: 'Previous page'
  },
  nextPageLabel: {
    id: 'transfer.table.page.next',
    defaultMessage: 'Next page'
  },
  lastPageLabel: {
    id: 'transfer.table.page.last',
    defaultMessage: 'Last page'
  },
  noDefined: {
    id: 'transfer.table.date.none',
    defaultMessage: 'Not yet defined'
  },
  noBounty: {
    id: 'transfer.table.value.none',
    defaultMessage: 'No bounty added'
  },
  onHoverpaymentProvider: {
    id: 'transfer.table.onHover',
    defaultMessage: 'See on'
  }
})

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5)
  }
})

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0)
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1)
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1)
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    )
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props

    return (
      <div className={classes.root} >
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
      </div>
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

const TablePaginationActionsWrapped = injectIntl(withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions
))

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: 'auto'
  }
})

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
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  };

  handleClickListItem = transfer => {
    this.props.history.push(`/transfer/${transfer.id}/${slugify(transfer.title)}`)
  }

  goToProject = (e, id, organizationId) => {
    e.preventDefault()
    window.location.href = '/#/organizations/' + organizationId + '/projects/' + id
    window.location.reload()
  }

  render() {
    const { classes, payouts, tableHead } = this.props
    const { rowsPerPage, page } = this.state
    const emptyRows = payouts?.data?.length ? rowsPerPage - Math.min(rowsPerPage, payouts.data.length - page * rowsPerPage) : 0


    if (payouts?.data?.length === 0 && payouts?.completed) {
      return (
        <Paper className={classes.root}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              <FormattedMessage id="transfer.table.body.noPayouts" defaultMessage="No Payouts" />
            </Typography>
          </div>
        </Paper>
      )
    }

    const TableRowPlaceholder = (
      [0,1,2,3,4,5].map((_, rIdx) => (
        <TableRow key={`ph-${rIdx}`}>
          {[0,1,2,3,4,5].map((_, cIdx) => (
            <TableCell key={`phc-${cIdx}`}>
              <div style={{ width: 80 }}>
                <Skeleton variant="text" />
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))
    );

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {tableHead.map(t =>
                  <TableCell>
                    {t}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {!payouts.completed ? (
                <>{TableRowPlaceholder}</>
              ) : (
                <>
                  {payouts.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                    return (
                      <TableRow key={n.id}>
                        {n.map(p =>
                          <TableCell component="th" scope="row" style={{ padding: 10, position: 'relative' }}>
                            {p}
                          </TableCell>
                        )}
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
                  count={payouts.data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={(e, page) => this.handleChangePage(e, page)}
                  onChangeRowsPerPage={(e, page) => this.handleChangeRowsPerPage(e, page)}
                  Actions={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    )
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  payments: PropTypes.object
}

export default injectIntl(withRouter(withStyles(styles)(CustomPaginationActionsTable)))
export default injectIntl(withRouter(withStyles(styles)(CustomPaginationActionsTable)))
