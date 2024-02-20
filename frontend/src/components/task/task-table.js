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
import _ from 'lodash'

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

const tableHeaderMetadata ={
  "task.table.head.task": { sortable: true, numeric:false, dataBaseKey:"title" },
  "task.table.head.status" : {sortable: true,numeric:false, dataBaseKey:"status" },
  "task.table.head.project":{sortable: true,numeric:false, dataBaseKey:"Project.name" },
  "task.table.head.value" :{sortable: true,numeric:true, dataBaseKey:"value" },
  "task.table.head.labels":{sortable: true,numeric:false, dataBaseKey:"Labels" },
  "task.table.head.createdAt":{sortable: true,numeric:false, dataBaseKey:"createdAt" }
}

class CustomPaginationActionsTable extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 0,
      rowsPerPage: 10,
      sortByField:null,
      sortDirection:null, // at starting point of page load
      tasksData: props.tasks.data,
    }
  }
  
  sortHandler = (fieldId, direction) => {
    if (tableHeaderMetadata[fieldId].sortable){
      const sortedData = _.orderBy(
        this.state.tasksData,
        o =>{
          if (tableHeaderMetadata[fieldId].numeric) return +(_.get(o,(tableHeaderMetadata[fieldId].dataBaseKey).split("."))) 
          else return _.get(o,(tableHeaderMetadata[fieldId].dataBaseKey).split("."))
        },
        [direction]
      )
      this.setState({...this.state, sortByField:fieldId.split(".")[3], sortDirection:direction, tasksData:sortedData})
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
    const emptyRows = tasks.data.length ? rowsPerPage - Math.min(rowsPerPage, tasks.data.length - page * rowsPerPage) : 0;
    const TableCellWithSortLogic = ({fieldId ,defineMessage, sortHandler})=>{
      return (
            <TableSortLabel
              active= { fieldId.split(".")[3] === this.state.sortByField}
              direction={ this.state.sortDirection ==="asc" ? "desc" : "asc"  }
              onClick = {
                () => {
                  this.setState({sortByField : fieldId});
                  return sortHandler(fieldId, this.state.sortDirection ==="asc" ? "desc" : "asc" )
                }
              }
            >
              <FormattedMessage id={fieldId} defineMessage={defineMessage}/>
            </TableSortLabel>
      )
    }
    const TableHeadCustom = ()=> {
      return (
        <TableHead>
          <TableRow>
            <TableCell>
              <TableCellWithSortLogic sortHandler={this.sortHandler} fieldId='task.table.head.task' defaultMessage='Task' />
            </TableCell>
            <TableCell>
            <TableCellWithSortLogic sortHandler={this.sortHandler} fieldId='task.table.head.status' defaultMessage='Status' />
            </TableCell>
            <TableCell>
              <TableCellWithSortLogic sortHandler={this.sortHandler} fieldId='task.table.head.project' defaultMessage='Project' />
            </TableCell>
            <TableCell>
              <TableCellWithSortLogic sortHandler={this.sortHandler} fieldId='task.table.head.value' defaultMessage='Value' />
            </TableCell>
            <TableCell>
              <TableCellWithSortLogic sortHandler={this.sortHandler} fieldId='task.table.head.labels' defaultMessage='Labels' />
            </TableCell>
            <TableCell>
              <TableCellWithSortLogic sortHandler={this.sortHandler} fieldId='task.table.head.createdAt' defaultMessage='Created' />
            </TableCell>
          </TableRow>
        </TableHead>
      )
    }
    return (
      <Paper className={ classes.root }>
        { tasks.completed && tasks.data.length
          ? <ReactPlaceholder style={ { marginBottom: 20, padding: 20 } } showLoadingAnimation type='text' rows={ 5 } ready={ tasks.completed }>
            <div className={ classes.tableWrapper }>
              <Table className={ classes.table }>
              <TableHeadCustom />
                <TableBody>
                  { this.state.tasksData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
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

export default injectIntl(withRouter(withStyles(styles)(CustomPaginationActionsTable)))
