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
  Typography,
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

const tableHeaderMetadata = {
  "task.table.head.task": { sortable: true, numeric: false, dataBaseKey: "title" },
  "task.table.head.status": { sortable: true, numeric: false, dataBaseKey: "status" },
  "task.table.head.project": { sortable: true, numeric: false, dataBaseKey: "Project.name" },
  "task.table.head.value": { sortable: true, numeric: true, dataBaseKey: "value" },
  "task.table.head.labels": { sortable: true, numeric: false, dataBaseKey: "Labels" },
  "task.table.head.createdAt": { sortable: true, numeric: false, dataBaseKey: "createdAt" }
}

const getSortingValue = (item, fieldId) => {

  const getValue = (item, dataBaseKey) => {
    const keys = dataBaseKey.split(".");
    return keys.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, item);
  };

  const metadata = tableHeaderMetadata[fieldId];
  if (!metadata) {
    console.error(`No metadata found for fieldId: ${fieldId}`);
    return null;
  }

  const { numeric, dataBaseKey } = metadata;

  const value = getValue(item, dataBaseKey);

  if (value === undefined) {
    console.error(`Failed to get value for fieldId: ${fieldId}`);
    return null;
  }

  if (numeric) {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      console.error(`Failed to parse numeric value for fieldId: ${fieldId}`);
      return null;
    }
    return parsedValue;
  }
  return value;
};

const sortData = (data, sortedBy, sortDirection) => {
  if (sortDirection === 'none') return data;
  if (!sortedBy) return data;

  return [...data].sort((a, b) => {
    let aValue = getSortingValue(a, sortedBy);
    let bValue = getSortingValue(b, sortedBy);

    // Handle null values
    if (aValue === null || bValue === null) {
      return (aValue === null ? (sortDirection === 'asc' ? -1 : 1) : (sortDirection === 'asc' ? 1 : -1));
    }

    // Handle date sorting
    if (sortedBy === 'task.table.head.createdAt') {
      let aDate = new Date(aValue).getTime();
      let bDate = new Date(bValue).getTime();
      return (sortDirection === 'asc' ? aDate - bDate : bDate - aDate);
    }

    // Handle labels array sorting
    if (sortedBy === 'task.table.head.labels') {
      aValue = aValue.map(label => label.name).join('');
      bValue = bValue.map(label => label.name).join('');
    }

    // Handle string sorting
    let comparator = String(aValue).localeCompare(String(bValue), 'en', { numeric: true, sensitivity: 'base', ignorePunctuation: true });
    return (sortDirection === 'asc' ? comparator : -comparator);
  });
};

class CustomPaginationActionsTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 0,
      rowsPerPage: 10,
      sortedBy: null,
      sortDirection: 'asc',
      sortedData: this.props.tasks.data
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tasks !== this.props.tasks) {
      const { sortedBy, sortDirection } = this.state;
      const newSortedData = sortData(this.props.tasks.data, sortedBy, sortDirection);
      this.setState({
        sortedData: newSortedData
      });
    }
  }

  handleSort = (fieldId, sortDirection) => {
    const newSortedData = sortData(this.props.tasks.data, fieldId, sortDirection);

    return {
      sortedBy: fieldId,
      sortDirection,
      sortedData: newSortedData,
    };
  }

  sortHandler = (fieldId) => {
    this.setState((prevState) => {
      const { sortedBy, sortDirection } = prevState;
      const newSortDirection = sortedBy === fieldId ? (sortDirection === 'asc' ? 'desc' : (sortDirection === 'desc' ? 'none' : 'asc')) : 'asc';
      return this.handleSort(fieldId, newSortDirection);
    });
  };


  handleChangePage = (event, page) => {
    this.setState({ page })
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  };

  handleClickListItem = task => {
    const url = this.props.user?.id ? `/profile/task/${task.id}/${slugify(task.title)}` : `/task/${task.id}/${slugify(task.title)}`
    this.props.history.push(url)
  }

  goToProject = (e, id, organizationId) => {
    e.preventDefault()
    window.location.href = '/#/organizations/' + organizationId + '/projects/' + id
    window.location.reload()
  }

  render() {
    const { classes, tasks } = this.props
    const { rowsPerPage, page, sortedBy, sortDirection, sortedData } = this.state;

    const emptyRows = sortedData.length ? rowsPerPage - Math.min(rowsPerPage, sortedData.length - page * rowsPerPage) : 0
    const TableCellWithSortLogic = ({ fieldId, defineMessage, sortHandler }) => {
      return (
        <TableSortLabel
          active={fieldId === sortedBy && sortDirection !== 'none'}
          direction={sortDirection}
          onClick={
            () => {
              return sortHandler(fieldId)
            }
          }
        >
          <FormattedMessage id={fieldId} defineMessage={defineMessage} />
        </TableSortLabel>
      )
    }

    const TableHeadCustom = () => {
      return (
        <TableHead>
          <TableRow>
            {Object.entries(tableHeaderMetadata).map(([fieldId, metadata]) => (
              <TableCell key={fieldId}>
                <TableCellWithSortLogic sortHandler={this.sortHandler} fieldId={fieldId} defaultMessage={metadata.dataBaseKey} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      );
    };


    if (tasks.completed && tasks.data.length === 0) {
      return (<Paper className={classes.root}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <Typography variant='caption'>
            <FormattedMessage id='task.table.body.noIssues' defaultMessage='No issues' />
          </Typography>
        </div>
      </Paper>);
    }

    return (
      <Paper className={classes.root}>
        <ReactPlaceholder style={{ marginBottom: 20, padding: 20 }} showLoadingAnimation type='text' rows={12} ready={tasks.completed}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableHeadCustom />
              <TableBody>
                {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                  const assigned = n.Assigns.find(a => a.id === n.assigned)
                  const assignedUser = assigned && assigned.User
                  return (
                    <TableRow key={n.id}>
                      <TableCell component='th' scope='row' style={{ padding: 10, position: 'relative' }}>
                        <div style={{ width: 350, display: 'flex', alignItems: 'center' }}>
                          <a style={{ cursor: 'pointer' }} onClick={(e) => this.handleClickListItem(n)}>
                            {TextEllipsis(`${n.title || 'no title'}`, 42)}
                          </a>
                          <a target='_blank' href={n.url}>
                            <Tooltip id='tooltip-fab' title={`${this.props.intl.formatMessage(messages.onHoverTaskProvider)} ${n.provider}`} placement='top'>
                              <img width='24' src={n.provider === 'github' ? logoGithub : logoBitbucket} style={{ borderRadius: '50%', padding: 3, backgroundColor: 'black', borderColor: 'black', borderWidth: 1, marginLeft: 10 }} />
                            </Tooltip>
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ width: 80 }}>
                          <Chip label={this.props.intl.formatMessage(Constants.STATUSES[n.status])} style={{ backgroundColor: `${Constants.STATUSES_COLORS[n.status]}`, color: 'white' }} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Chip label={n.Project ? n.Project.name : 'no project'} onClick={(e) => this.goToProject(e, n.Project.id, n.Project.OrganizationId)} />
                        </div>
                      </TableCell>
                      <TableCell numeric style={{ padding: 5 }}>
                        <div style={{ width: 70, textAlign: 'center' }}>
                          {n.value ? (n.value === '0' ? this.props.intl.formatMessage(messages.noBounty) : `$ ${n.value}`) : this.props.intl.formatMessage(messages.noBounty)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {n?.Labels?.length ?
                          <div style={{ width: 120 }}>
                            {n?.Labels?.slice(0, 3).map(
                              (label, index) =>
                              (
                                <Chip
                                  style={{ marginRight: 5, marginBottom: 5 }}
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
                        <div style={{ width: 120 }}>
                          {n.createdAt ? MomentComponent(n.createdAt).fromNow() : this.props.intl.formatMessage(messages.noDefined)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={3}
                    count={sortedData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, page) => this.handleChangePage(e, page)}
                    onRowsPerPageChange={(e, page) => this.handleChangeRowsPerPage(e, page)}
                    Actions={TablePaginationActionsWrapped}
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
  tasks: PropTypes.object,
  user: PropTypes.object,
}

export default injectIntl(withRouter(withStyles(styles)(CustomPaginationActionsTable)))