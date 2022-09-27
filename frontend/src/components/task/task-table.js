import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import MomentComponent from 'moment'
import TextEllipsis from 'text-ellipsis'
import ReactPlaceholder from 'react-placeholder'

import {
  Avatar,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  withStyles,
  Tooltip,
  Chip,
  Paper,
  IconButton
} from '@material-ui/core'
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon
} from '@material-ui/icons'
import slugify from '@sindresorhus/slugify'

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')
import Constants from '../../consts'

const messages = defineMessages({
  firstPageLabel: {
    id: 'task.table.page.first',
    defaultMessage: 'First page'
  },
  previousPageLabel: {
    id: 'task.table.page.previous',
    defaultMessage: 'Previous page'
  },
  nextPageLabel: {
    id: 'task.table.page.next',
    defaultMessage: 'Next page'
  },
  lastPageLabel: {
    id: 'task.table.page.last',
    defaultMessage: 'Last page'
  },
  noDefined: {
    id: 'task.table.date.none',
    defaultMessage: 'Not yet defined'
  },
  noBounty: {
    id: 'task.table.value.none',
    defaultMessage: 'No bounty added'
  },
  onHoverTaskProvider: {
    id: 'task.table.onHover',
    defaultMessage: 'See on'
  }
})

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
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

  render () {
    const { classes, count, page, rowsPerPage, theme } = this.props

    return (
      <div className={ classes.root } >
        <IconButton
          onClick={ (e) => this.handleFirstPageButtonClick(e) }
          disabled={ page === 0 }
          aria-label={ this.props.intl.formatMessage(messages.firstPageLabel) }
        >
          { theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon /> }
        </IconButton>
        <IconButton
          onClick={ (e) => this.handleBackButtonClick(e) }
          disabled={ page === 0 }
          aria-label={ this.props.intl.formatMessage(messages.previousPageLabel) }
        >
          { theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft /> }
        </IconButton>
        <IconButton
          onClick={ (e) => this.handleNextButtonClick(e) }
          disabled={ page >= Math.ceil(count / rowsPerPage) - 1 }
          aria-label={ this.props.intl.formatMessage(messages.nextPageLabel) }
        >
          { theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight /> }
        </IconButton>
        <IconButton
          onClick={ (e) => this.handleLastPageButtonClick(e) }
          disabled={ page >= Math.ceil(count / rowsPerPage) - 1 }
          aria-label={ this.props.intl.formatMessage(messages.lastPageLabel) }
        >
          { theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon /> }
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
  theme: PropTypes.object.isRequired,
}

const TablePaginationActionsWrapped = injectIntl(withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions
))

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: 'auto',
  },
})

class CustomPaginationActionsTable extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 0,
      rowsPerPage: 10,
    }
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  };

  handleClickListItem = task => {
    this.props.history.push(`/task/${task.id}/${slugify(task.title)}`)
  }

  goToProject = (e, id, organizationId) => {
    e.preventDefault()
    window.location.href = '/#/organizations/' + organizationId + '/projects/' + id
    window.location.reload()
  }

  render () {
    const { classes, tasks } = this.props
    const { rowsPerPage, page } = this.state
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, tasks.data.length - page * rowsPerPage)

    return (
      <Paper className={ classes.root }>
        <ReactPlaceholder style={ { marginBottom: 20, padding: 20 } } showLoadingAnimation type='text' rows={ 5 } ready={ tasks.completed }>
          <div className={ classes.tableWrapper }>
            <Table className={ classes.table }>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormattedMessage id='task.table.head.author' defaultMessage='Author' />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id='task.table.head.task' defaultMessage='Task' />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id='task.table.head.project' defaultMessage='Project' />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id='task.table.head.status' defaultMessage='Status' />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id='task.table.head.value' defaultMessage='Value' />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id='task.table.head.deadline' defaultMessage='Deadline' />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id='task.table.head.assignedTo' defaultMessage='Assigned to' />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { tasks.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                  const assigned = n.Assigns.find(a => a.id === n.assigned)
                  const assignedUser = assigned && assigned.User
                  return (
                    <TableRow key={ n.id }>
                      <TableCell component='th' scope='row' style={ { padding: 5 } }>
                        { n.User
                          ? (
                            <div>
                              { n.User.profile_url
                                ? (
                                  <a style={ { display: 'flex', alignItems: 'center' } } target='_blank'
                                    href={ n.User.profile_url }>
                                    <Avatar
                                      src={ n.User.picture_url }
                                    />
                                    <span style={ { marginLeft: 10 } }>
                                      { TextEllipsis(n.User.username || n.User.name || ' - ', 10) }
                                    </span>
                                  </a>
                                ) : (
                                  <div style={ { display: 'flex', alignItems: 'center', height: 20 } }>
                                    <Avatar />
                                    <span style={ { marginLeft: 10 } }>
                                      { TextEllipsis(n.User.username || n.User.name || ' - ', 10) }
                                    </span>
                                  </div>
                                )
                              }
                            </div>
                          ) : (
                            <div>
                              <FormattedMessage id='task.table.body.author.none' defaultMessage='No author' />
                            </div>
                          )
                        }
                      </TableCell>
                      <TableCell component='th' scope='row' style={ { padding: 10, position: 'relative' } }>
                        <div style={ { width: 250, display: 'flex', alignItems: 'center' } }>
                          <a style={ { cursor: 'pointer' } } onClick={ (e) => this.handleClickListItem(n) }>
                            { TextEllipsis(`${n.title || 'no title'}`, 30) }
                          </a>
                          <a target='_blank' href={ n.url }>
                            <Tooltip id='tooltip-fab' title={ `${this.props.intl.formatMessage(messages.onHoverTaskProvider)} ${n.provider}` } placement='top'>
                              <img width='24' src={ n.provider === 'github' ? logoGithub : logoBitbucket } style={ { borderRadius: '50%', padding: 3, backgroundColor: 'black', borderColor: 'black', borderWidth: 1, marginLeft: 10 } } />
                            </Tooltip>
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Chip label={ n.Project ? n.Project.name : 'no project' } onClick={ (e) => this.goToProject(e, n.Project.id, n.Project.OrganizationId) } />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={ { width: 80 } }>
                          <Chip label={ this.props.intl.formatMessage(Constants.STATUSES[n.status]) } style={ { backgroundColor: `${Constants.STATUSES_COLORS[n.status]}`, color: 'white' } } />
                        </div>
                      </TableCell>
                      <TableCell numeric style={ { padding: 5 } }>
                        <div style={ { width: 70, textAlign: 'center' } }>
                          { n.value ? (n.value === '0' ? this.props.intl.formatMessage(messages.noBounty) : `$ ${n.value}`) : this.props.intl.formatMessage(messages.noBounty) }
                        </div>
                      </TableCell>
                      <TableCell numeric>
                        <div style={ { width: 80 } }>
                          { n.deadline ? MomentComponent(n.deadline).fromNow() : this.props.intl.formatMessage(messages.noDefined) }
                        </div>
                      </TableCell>
                      <TableCell component='th' scope='row' style={ { padding: 5 } }>
                        { assignedUser
                          ? (
                            <div>
                              { assignedUser.profile_url
                                ? (
                                  <a style={ { display: 'flex', alignItems: 'center' } } target='_blank'
                                    href={ assignedUser.profile_url }>
                                    <Avatar
                                      src={ assignedUser.picture_url }
                                    />
                                    <span style={ { marginLeft: 10 } }>
                                      { TextEllipsis(assignedUser.username || assignedUser.name || ' - ', 10) }
                                    </span>
                                  </a>
                                ) : (
                                  <div style={ { display: 'flex', alignItems: 'center', height: 20 } }>
                                    <Avatar />
                                    <span style={ { marginLeft: 10 } }>
                                      { TextEllipsis(assignedUser.username || assignedUser.name || ' - ', 10) }
                                    </span>
                                  </div>
                                )
                              }
                            </div>
                          ) : (
                            <div>
                              <FormattedMessage id='task.table.body.assigned.none' defaultMessage='No one assigned' />
                            </div>
                          )
                        }
                      </TableCell>
                    </TableRow>
                  )
                }) }
                { emptyRows > 0 && (
                  <TableRow style={ { height: 48 * emptyRows } }>
                    <TableCell colSpan={ 6 } />
                  </TableRow>
                ) }
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={ 3 }
                    count={ tasks.data.length }
                    rowsPerPage={ rowsPerPage }
                    page={ page }
                    onChangePage={ (e, page) => this.handleChangePage(e, page) }
                    onChangeRowsPerPage={ (e, page) => this.handleChangeRowsPerPage(e, page) }
                    Actions={ TablePaginationActionsWrapped }
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </ReactPlaceholder>
      </Paper>
    )
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  tasks: PropTypes.object
}

export default injectIntl(withRouter(withStyles(styles)(CustomPaginationActionsTable)))
