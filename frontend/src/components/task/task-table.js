import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import MomentComponent from 'moment'
import TextEllipsis from 'text-ellipsis'
import ReactPlaceholder from 'react-placeholder'

import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  TableSortLabel,
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

import logoGithub from '../../images/github-logo.png'
import logoBitbucket from '../../images/bitbucket-logo.png'
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
      sortBy: '',
      sortDirection: 'asc',
      data: props.tasks.data || [],
    }
  }

  sortTasksBy( sortBy = '', direction = 'asc', getter = Function()){
    const {props, state} = this
    let sortDirection = direction
    if( state.sortBy == sortBy ){
      sortDirection = state.sortDirection == 'asc' ? 'desc' : 'asc'
    }
    const sortedData = sortRecords(state.data, sortBy, sortDirection, getter)
    this.setState({...state, sortBy, sortDirection, data: sortedData})
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
    const { data, rowsPerPage, page, sortBy, sortDirection } = this.state
    const emptyRows = data.length ? rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage) : 0

    const humanise = (text = '') => text[0].toUpperCase() + text.slice(1)
    const TableColumnTitle = ({
      field = String(),
      getter = (record) => Object(record)[field],
      active = sortBy === field,
      id = `task.table.head.${field}`,
      defaultMessage = humanise(field),
    }) => 
      <TableSortLabel
        active={ active }
        direction={ active ? (sortDirection == 'asc' ? 'desc' : 'asc') : 'desc' }
        onClick={ this.sortTasksBy.bind(this, field, sortDirection, getter) }
      >
        <FormattedMessage {...{id, defaultMessage}} />
      </TableSortLabel>
    
    return (
      <Paper className={ classes.root }>
        { tasks.completed && data.length
          ? <ReactPlaceholder style={ { marginBottom: 20, padding: 20 } } showLoadingAnimation type='text' rows={ 5 } ready={ tasks.completed }>
            <div className={ classes.tableWrapper }>
              <Table className={ classes.table }>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableColumnTitle field='task' getter={({title}) => title} />
                    </TableCell>
                    <TableCell>
                      <TableColumnTitle field='status' />
                    </TableCell>
                    <TableCell>
                      <TableColumnTitle field='project' getter={({Project}) => Object(Project).name} />
                    </TableCell>
                    <TableCell>
                      <TableColumnTitle field='value' />
                    </TableCell>
                    <TableCell>
                      <TableColumnTitle field='labels' getter={({Labels}) => String(Object(Labels).length && Object(Labels[0]).name)} />
                    </TableCell>
                    <TableCell>
                      <TableColumnTitle field='createdAt' />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                    const assigned = n.Assigns.find(a => a.id === n.assigned)
                    const assignedUser = assigned && assigned.User
                    return (
                      <TableRow key={ n.id }>
                        <TableCell component='th' scope='row' style={ { padding: 10, position: 'relative' } }>
                          <div style={ { width: 350, display: 'flex', alignItems: 'center' } }>
                            <a style={ { cursor: 'pointer' } } onClick={ (e) => this.handleClickListItem(n) }>
                              { TextEllipsis(`${n.title || 'no title'}`, 42) }
                            </a>
                            <a target='_blank' href={ n.url }>
                              <Tooltip id='tooltip-fab' title={ `${this.props.intl.formatMessage(messages.onHoverTaskProvider)} ${n.provider}` } placement='top'>
                                <img width='24' src={ n.provider === 'github' ? logoGithub : logoBitbucket } style={ { borderRadius: '50%', padding: 3, backgroundColor: 'black', borderColor: 'black', borderWidth: 1, marginLeft: 10 } } />
                              </Tooltip>
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={ { width: 80 } }>
                            <Chip label={ this.props.intl.formatMessage(Constants.STATUSES[n.status]) } style={ { backgroundColor: `${Constants.STATUSES_COLORS[n.status]}`, color: 'white' } } />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Chip label={ n.Project ? n.Project.name : 'no project' } onClick={ (e) => this.goToProject(e, n.Project.id, n.Project.OrganizationId) } />
                          </div>
                        </TableCell>
                        <TableCell numeric style={ { padding: 5 } }>
                          <div style={ { width: 70, textAlign: 'center' } }>
                            { n.value ? (n.value === '0' ? this.props.intl.formatMessage(messages.noBounty) : `$ ${n.value}`) : this.props.intl.formatMessage(messages.noBounty) }
                          </div>
                        </TableCell>
                        <TableCell>
                          { n?.Labels?.length ? 
                          <div style={{width: 120}}>
                            {n?.Labels?.slice(0,3).map(
                              (label, index) => 
                                (
                                  <Chip 
                                    style={{marginRight: 5, marginBottom: 5}}
                                    size='small'
                                    label={
                                      TextEllipsis(`${label.name || ''}`, 20)
                                    } 
                                  />
                                )
                              )
                            } ...
                          </div> : <>-</>}  
                        </TableCell>
                        <TableCell>
                          <div style={ { width: 120 } }>
                            { n.createdAt ? MomentComponent(n.createdAt).fromNow() : this.props.intl.formatMessage(messages.noDefined) }
                          </div>
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
                      count={ data.length }
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
          : <div style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 } }>
            <FormattedMessage id='task.table.body.noTasks' defaultMessage='No tasks' />
          </div> }
      </Paper>
    )
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  tasks: PropTypes.object
}

const comparator = (a='', b='') => String(a).localeCompare(b, 'en', {numeric:true, sensitivity:'base', ignorePunctuation:true})
const swapFnArgs = fn => (a, b) => fn(b, a)
const getRecordsComparator = (field='', direction = 'asc', getter = record => Object(record)[field]) => {
  const applyDirection = comparator => direction == 'desc' ? swapFnArgs(comparator) : comparator
  return (recA={}, recB={}) => applyDirection(comparator)(getter(recA), getter(recB))
}

function sortRecords(records = [], field = '', direction = 'asc', getter = Function()){
    if( records ){
      const compareRecords = getRecordsComparator(field, direction, getter)
      const sortedRecs = records.sort(compareRecords)
      return sortedRecs
    } else return records
}

export default injectIntl(withRouter(withStyles(styles)(CustomPaginationActionsTable)))
