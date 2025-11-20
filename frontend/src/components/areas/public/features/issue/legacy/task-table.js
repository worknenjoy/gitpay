import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import Link from '@mui/material/Link'
import MomentComponent from 'moment'
import TextEllipsis from 'text-ellipsis'
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
  Tooltip,
  Chip,
  Paper,
  IconButton,
  Skeleton,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@mui/icons-material'
import slugify from '@sindresorhus/slugify'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'
import Constants from '../../../../../../consts'
import messages from '../../../../../../messages/messages'

const ActionsRoot = styled('div')(({ theme }) => ({
  flexShrink: 0,
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(2.5),
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
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
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
  theme: PropTypes.object.isRequired,
}

const TablePaginationActionsWrapped = injectIntl((props) => <TablePaginationActions {...props} />)

const RootPaper = styled(Paper)(({ theme }) => ({ width: '100%', marginTop: theme.spacing(3) }))
const TableWrapper = styled('div')(({ theme }) => ({ overflowX: 'auto' }))

class CustomPaginationActionsTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 0,
      rowsPerPage: 10,
      sortedBy: null,
      sortDirection: 'asc',
      sortedData: this.props.tasks.data,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tasks !== this.props.tasks) {
      const { sortedBy, sortDirection } = this.state
      const newSortedData = this.sortData(this.props.tasks.data, sortedBy, sortDirection)
      this.setState({
        sortedData: newSortedData,
      })
    }
  }

  sortData = (data, sortedBy, sortDirection) => {
    if (sortDirection === 'none') return data
    if (!sortedBy) return data

    return [...data].sort((a, b) => {
      let aValue = this.getSortingValue(a, sortedBy)
      let bValue = this.getSortingValue(b, sortedBy)

      // Handle null values
      if (aValue === null || bValue === null) {
        return aValue === null
          ? sortDirection === 'asc'
            ? -1
            : 1
          : sortDirection === 'asc'
            ? 1
            : -1
      }

      // Handle date sorting
      if (sortedBy === 'task.table.head.createdAt') {
        let aDate = new Date(aValue).getTime()
        let bDate = new Date(bValue).getTime()
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate
      }

      // Handle labels array sorting
      if (sortedBy === 'task.table.head.labels') {
        aValue = aValue.map((label) => label.name).join('')
        bValue = bValue.map((label) => label.name).join('')
      }

      // Handle string sorting
      let comparator = String(aValue).localeCompare(String(bValue), 'en', {
        numeric: true,
        sensitivity: 'base',
        ignorePunctuation: true,
      })
      return sortDirection === 'asc' ? comparator : -comparator
    })
  }

  getSortingValue = (item, fieldId) => {
    const { tableHeaderMetadata } = this.props
    const getValue = (item, dataBaseKey) => {
      const keys = dataBaseKey.split('.')
      return keys.reduce(
        (obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined),
        item,
      )
    }

    const metadata = tableHeaderMetadata[fieldId]
    if (!metadata) {
      console.error(`No metadata found for fieldId: ${fieldId}`)
      return null
    }

    const { numeric, dataBaseKey } = metadata

    const value = getValue(item, dataBaseKey)

    if (value === undefined) {
      console.error(`Failed to get value for fieldId: ${fieldId}`)
      return null
    }

    if (numeric) {
      const parsedValue = parseFloat(value)
      if (isNaN(parsedValue)) {
        console.error(`Failed to parse numeric value for fieldId: ${fieldId}`)
        return null
      }
      return parsedValue
    }
    return value
  }

  handleSort = (fieldId, sortDirection) => {
    const newSortedData = this.sortData(this.props.tasks.data, fieldId, sortDirection)

    return {
      sortedBy: fieldId,
      sortDirection,
      sortedData: newSortedData,
    }
  }

  sortHandler = (fieldId) => {
    this.setState((prevState) => {
      const { sortedBy, sortDirection } = prevState
      const newSortDirection =
        sortedBy === fieldId
          ? sortDirection === 'asc'
            ? 'desc'
            : sortDirection === 'desc'
              ? 'none'
              : 'asc'
          : 'asc'
      return this.handleSort(fieldId, newSortDirection)
    })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value })
  }

  handleClickListItem = (task) => {
    const url = this.props.user?.id
      ? `/profile/task/${task.id}/${slugify(task.title)}`
      : `/task/${task.id}/${slugify(task.title)}`
    this.props.history.push(url)
  }

  renderProjectLink = (project) => {
    if (!project?.id) return <Typography variant="caption">no project</Typography>
    const { id, name, OrganizationId } = project
    const url = this.props.user?.id
      ? '/profile/organizations/' + OrganizationId + '/projects/' + id
      : '/organizations/' + OrganizationId + '/projects/' + id
    return (
      <Chip label={project ? name : 'no project'} component={Link} href={'/#' + url} clickable />
    )
  }

  render() {
    const { tasks, tableHeaderMetadata, intl } = this.props
    const { rowsPerPage, page, sortedBy, sortDirection, sortedData } = this.state

    const emptyRows = sortedData.length
      ? rowsPerPage - Math.min(rowsPerPage, sortedData.length - page * rowsPerPage)
      : 0
    const TableCellWithSortLogic = ({ fieldId, defaultMessage, sortHandler }) => {
      return (
        <TableSortLabel
          active={fieldId === sortedBy && sortDirection !== 'none'}
          direction={sortDirection}
          onClick={() => {
            return sortHandler(fieldId)
          }}
        >
          {defaultMessage}
        </TableSortLabel>
      )
    }

    const TableHeadCustom = () => {
      return (
        <TableHead>
          <TableRow>
            {Object.entries(tableHeaderMetadata).map(([fieldId, metadata]) => (
              <TableCell key={fieldId}>
                <TableCellWithSortLogic
                  sortHandler={this.sortHandler}
                  fieldId={fieldId}
                  defaultMessage={metadata.label}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      )
    }

    if (tasks.completed && tasks.data.length === 0) {
      return (
        <RootPaper>
          <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}
          >
            <Typography variant="caption">
              <FormattedMessage id="task.table.body.noIssues" defaultMessage="No issues" />
            </Typography>
          </div>
        </RootPaper>
      )
    }

    const TableRowPlaceholder = [0, 1, 2, 3, 4, 5].map((_, rIdx) => (
      <TableRow key={`ph-${rIdx}`}>
        {[0, 1, 2, 3, 4, 5].map((_, cIdx) => (
          <TableCell key={`phc-${cIdx}`} sx={{ p: 0.625 }}>
            <div style={{ width: 80, padding: '8px 4px' }}>
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
            <TableHeadCustom />
            <TableBody>
              {!tasks.completed ? (
                <>{TableRowPlaceholder}</>
              ) : (
                <>
                  {sortedData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((n) => {
                      return (
                        <TableRow key={n.id}>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ p: 0.625 }}
                            style={{ position: 'relative' }}
                          >
                            <div style={{ width: 350, display: 'flex', alignItems: 'center' }}>
                              <a
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => this.handleClickListItem(n)}
                              >
                                {TextEllipsis(`${n.title || 'no title'}`, 42)}
                              </a>
                              <a target="_blank" href={n.url} rel="noreferrer">
                                <Tooltip
                                  id="tooltip-fab"
                                  title={`${this.props.intl.formatMessage(messages.onHoverTaskProvider)} ${n.provider}`}
                                  placement="top"
                                >
                                  <img
                                    width="24"
                                    src={n.provider === 'github' ? logoGithub : logoBitbucket}
                                    style={{
                                      borderRadius: '50%',
                                      padding: 3,
                                      backgroundColor: 'black',
                                      borderColor: 'black',
                                      borderWidth: 1,
                                      marginLeft: 10,
                                    }}
                                  />
                                </Tooltip>
                              </a>
                            </div>
                          </TableCell>
                          <TableCell sx={{ p: 0.625 }}>
                            <div style={{ width: 100 }}>
                              <Chip
                                label={this.props.intl.formatMessage(Constants.STATUSES[n.status])}
                                avatar={
                                  <Avatar
                                    sx={{
                                      width: 12,
                                      height: 12,
                                      bgcolor:
                                        n.status === 'closed' ? 'error.main' : 'success.main',
                                    }}
                                  >
                                    {' '}
                                  </Avatar>
                                }
                                variant="outlined"
                                color={n.status === 'closed' ? 'error' : 'success'}
                              />
                            </div>
                          </TableCell>
                          {tableHeaderMetadata['project'] && (
                            <TableCell sx={{ p: 0.625 }}>
                              {this.renderProjectLink(n?.Project)}
                            </TableCell>
                          )}
                          <TableCell numeric sx={{ p: 0.625 }}>
                            <div style={{ width: 70, textAlign: 'center' }}>
                              {n.value
                                ? n.value === '0'
                                  ? this.props.intl.formatMessage(messages.noBounty)
                                  : `$ ${n.value}`
                                : this.props.intl.formatMessage(messages.noBounty)}
                            </div>
                          </TableCell>
                          <TableCell sx={{ p: 0.625 }}>
                            {n?.Labels?.length ? (
                              <div>
                                {n?.Labels?.slice(0, 2).map((label, index) => (
                                  <Chip
                                    style={{ marginRight: 5, marginBottom: 5 }}
                                    size="small"
                                    label={TextEllipsis(`${label.name || ''}`, 10)}
                                  />
                                ))}{' '}
                                ...
                              </div>
                            ) : (
                              <>-</>
                            )}
                          </TableCell>
                          <TableCell sx={{ p: 0.625 }}>
                            {n?.Project?.ProgrammingLanguages?.length ? (
                              <div>
                                {n?.Project?.ProgrammingLanguages?.slice(0, 2).map(
                                  (language, index) => (
                                    <Chip
                                      style={{ marginRight: 5, marginBottom: 5 }}
                                      size="small"
                                      label={TextEllipsis(`${language.name || ''}`, 10)}
                                    />
                                  ),
                                )}{' '}
                                ...
                              </div>
                            ) : (
                              <>-</>
                            )}
                          </TableCell>
                          <TableCell sx={{ p: 0.625 }}>
                            <div style={{ width: 120 }}>
                              {n.createdAt
                                ? MomentComponent(n.createdAt).fromNow()
                                : this.props.intl.formatMessage(messages.noDefined)}
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
                </>
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
        </TableWrapper>
      </RootPaper>
    )
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  tasks: PropTypes.object,
  user: PropTypes.object,
}

export default injectIntl(withRouter(CustomPaginationActionsTable))
