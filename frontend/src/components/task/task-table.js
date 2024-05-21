import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import Link from '@material-ui/core/Link'
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
import messages from './messages/task-messages'

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
  tableCell: {
    root: {
      padding: 5
    }
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  chipStatusSuccess: {
    marginBottom: theme.spacing(1),
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    color: theme.palette.primary.success
  },
  chipStatusClosed: {
    marginBottom: theme.spacing(1),
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    color: theme.palette.error.main
  },
  avatarStatusSuccess: {
    width: theme.spacing(0),
    height: theme.spacing(0),
    backgroundColor: theme.palette.primary.success,
  },
  avatarStatusClosed: {
    width: theme.spacing(0),
    height: theme.spacing(0),
    backgroundColor: theme.palette.error.main,
  },
})

const getSortingValue = (item, fieldId, tableHeaderMetadata = {}) => {

  const getValue = (item, dataBaseKey) => {
    const keys = dataBaseKey.split(".");
    return keys.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, item);
  };

  const metadata = tableHeaderMetadata[fieldId]
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

const sortData = (data, sortedBy, sortDirection, tableHeaderMetadata) => {
  if (sortDirection === 'none') return data;
  if (!sortedBy) return data;

  return [...data].sort((a, b) => {
    let aValue = getSortingValue(a, sortedBy, tableHeaderMetadata);
    let bValue = getSortingValue(b, sortedBy, tableHeaderMetadata);

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
      const newSortedData = sortData(this.props.tasks.data, sortedBy, sortDirection, this.props.tableHeaderMetadata);
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

  renderProjectLink = ( project ) => {
    if(!project?.id) return <Typography variant='caption'>no project</Typography>
    const { id, name, OrganizationId } = project
    const url = this.props.user?.id ? '/profile/organizations/' + OrganizationId + '/projects/' + id : '/organizations/' + OrganizationId + '/projects/' + id
    return(
      <Chip label={project ? name : 'no project'} component={Link} href={'/#' + url} clickable />
    )
  }

  render() {
    const { classes, tasks, tableHeaderMetadata, intl } = this.props
    const { rowsPerPage, page, sortedBy, sortDirection, sortedData } = this.state;

    const emptyRows = sortedData.length ? rowsPerPage - Math.min(rowsPerPage, sortedData.length - page * rowsPerPage) : 0
    const TableCellWithSortLogic = ({ fieldId, defaultMessage, sortHandler }) => {
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
          {defaultMessage}
        </TableSortLabel>
      )
    }

    const TableHeadCustom = () => {
      const tableHead = tableHeaderMetadata || [];
      return (
        <TableHead>
          <TableRow>
            {Object.entries(tableHead).map(([fieldId, metadata]) => (
              <TableCell key={fieldId}>
                <TableCellWithSortLogic sortHandler={this.sortHandler} fieldId={fieldId} defaultMessage={metadata.label} />
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

    const TableRowPlaceholder = (
      [0,1,2,3,4,5].map(() => (
      <TableRow>
        { [0,1,2,3,4,5].map(() => (
          <TableCell classes={classes.tableCell}>
            <div style={{ width: 80, padding: '8px 4px' }}>
              <ReactPlaceholder showLoadingAnimation type='text' rows={1} ready={tasks.completed} />
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
              <TableHeadCustom />
              <TableBody>
              <ReactPlaceholder style={{ marginBottom: 20, padding: 20 }} showLoadingAnimation  customPlaceholder={TableRowPlaceholder} rows={10}  ready={tasks.completed}>
                {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                  return (
                    <TableRow key={n.id}>
                      <TableCell component='th' scope='row' classes={{
                        root: classes.tableCell.root
                      }} style={{ position: 'relative' }}>
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
                      <TableCell classes={classes.tableCell}>
                        <div style={{ width: 80 }}>
                          <Chip 
                            label={this.props.intl.formatMessage(Constants.STATUSES[n.status])}
                            avatar={<Avatar className={n.status === 'closed' ? classes.avatarStatusClosed : classes.avatarStatusSuccess} style={{ width: 12, height: 12 }}>{' '}</Avatar>}
                            className={n.status === 'closed' ? classes.chipStatusClosed : classes.chipStatusSuccess}
                          />
                        </div>
                      </TableCell>
                      { tableHeaderMetadata['task.table.head.project'] &&
                      <TableCell classes={classes.tableCell}>
                        {this.renderProjectLink(n?.Project)}
                      </TableCell>}
                      <TableCell numeric classes={classes.tableCell} style={{ padding: 5 }}>
                        <div style={{ width: 70, textAlign: 'center' }}>
                          {n.value ? (n.value === '0' ? this.props.intl.formatMessage(messages.noBounty) : `$ ${n.value}`) : this.props.intl.formatMessage(messages.noBounty)}
                        </div>
                      </TableCell>
                      <TableCell classes={classes.tableCell}>
                        {n?.Labels?.length ?
                          <div>
                            {n?.Labels?.slice(0, 2).map(
                              (label, index) =>
                              (
                                <Chip
                                  style={{ marginRight: 5, marginBottom: 5 }}
                                  size='small'
                                  label={
                                    TextEllipsis(`${label.name || ''}`, 10)
                                  }
                                />
                              )
                            )
                            } ...
                          </div> : <>-</>}
                      </TableCell>
                      <TableCell classes={classes.tableCell}>
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
                </ReactPlaceholder>
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