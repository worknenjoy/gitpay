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
import moment from 'moment'

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
      sortedBy: null,
      sortDirection: 'asc',
      sortedData: this.props.tasks.data
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.tasks!== this.props.tasks) {
      this.setState({
        sortedData: this.props.tasks.data
      })
      if (this.state.sortedBy) {
        this.handleSort(this.state.sortedBy)
      }
    }
  }


  sortData = (property, direction) => {
    const data = [...this.props.tasks.data]; // shallow copy to avoid mutating state directly
  
    const getProperty = (obj, property) => {
      return property.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    };
  
    data.sort((a, b) => {
      const propertyA = getProperty(a, property);
      const propertyB = getProperty(b, property);
  
      if (propertyA === undefined || propertyB === undefined) {
        // cases where the property might not exist
        return 0;
      }
  
      let comparison = 0;
      if (moment(propertyA).isValid() && moment(propertyB).isValid()) {
        const unixA = moment(propertyA).unix();
        const unixB = moment(propertyB).unix();
        comparison = unixA - unixB;
      } else {
        comparison = propertyA.localeCompare(propertyB);
      }
  
      return (direction === 'desc' ? -1 : 1) * comparison;
    });
  
    return data; // Return the sorted data
  };
  
  handleSort = (property) => {
    this.setState((prevState) => {
      const { sortedBy, sortDirection } = prevState;
      const isAsc = sortedBy === property && sortDirection === 'asc';
      const newSortDirection = isAsc ? 'desc' : 'asc';
      const newSortedData = this.sortData(property, newSortDirection);
  
      return {
        sortedBy: property,
        sortDirection: newSortDirection,
        sortedData: newSortedData,
      };
    });
  };
  

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
    const  { rowsPerPage, page, sortedBy, sortDirection, sortedData  } = this.state;

    const emptyRows = sortedData.length ? rowsPerPage - Math.min(rowsPerPage, sortedData.length - page * rowsPerPage) : 0

    return (
      <Paper className={ classes.root }>
        { tasks.completed && sortedData.length
          ? <ReactPlaceholder style={ { marginBottom: 20, padding: 20 } } showLoadingAnimation type='text' rows={ 5 } ready={ tasks.completed }>
            <div className={ classes.tableWrapper }>
              <Table className={ classes.table }>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                      active={ sortedBy === 'title' }
                      direction={ sortedBy === 'title'? sortDirection : 'asc' }
                      onClick={() => this.handleSort('title')}
                      >
                      <FormattedMessage id='task.table.head.task' defaultMessage='Task' />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                      active={ sortedBy === 'status' }
                      direction={ sortedBy === 'status'? sortDirection : 'asc' }
                      onClick={() => this.handleSort('status')}
                      >
                      <FormattedMessage id='task.table.head.status' defaultMessage='Status' />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                      active={ sortedBy === 'project.name' }
                      direction={ sortedBy === 'project.name'? sortDirection : 'asc' }
                      onClick={() => this.handleSort('project.name')}
                      >
                      <FormattedMessage id='task.table.head.project' defaultMessage='Project' />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                      active={ sortedBy === 'value' }
                      direction={ sortedBy === 'value'? sortDirection : 'asc' }
                      onClick={() => this.handleSort('value')}
                      >
                      <FormattedMessage id='task.table.head.value' defaultMessage='Value' />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id='task.table.head.labels' defaultMessage='Labels' />
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                      active={ sortedBy === 'createdAt' }
                      direction={ sortedBy === 'createdAt'? sortDirection : 'asc' }
                      onClick={() => this.handleSort('createdAt')}
                      >
                      <FormattedMessage id='task.table.head.createdAt' defaultMessage='Created' />
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
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
                      count={ sortedData.length }
                      rowsPerPage={ rowsPerPage }
                      page={ page }
                      onPageChange={ (e, page) => this.handleChangePage(e, page) }
                      onRowsPerPageChange={ (e, page) => this.handleChangeRowsPerPage(e, page) }
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
