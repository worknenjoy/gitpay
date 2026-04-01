import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Skeleton } from '@mui/material'
import { DescriptionOutlined as NoDataIcon } from '@mui/icons-material'

import {
  Paper,
  TableHead,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  TableRow,
  TableSortLabel
} from '@mui/material'
import { RootPaper, TableWrapper, StyledTable, StyledTableCell } from './section-table.styles'

import TablePaginationActions from './section-table-pagination-actions/section-table-pagination-actions'
import TablePlaceholder from './section-table.placeholder'
import EmptyBase from 'design-library/molecules/content/empty/empty-base/empty-base'

type MetaDataProps = {
  numeric?: boolean
  dataBaseKey?: string
  label: string
  minWidth?: number
  width?: number
  align?: 'left' | 'right' | 'center'
}

interface ServerSidePaginationProps {
  enabled: boolean
  totalCount: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
}

interface SectionTableProps {
  tableData: { data: any[]; completed: boolean }
  tableHeaderMetadata: Record<string, MetaDataProps>
  customColumnRenderer?: Record<string, (item: any, rowData?: any) => React.ReactNode>
  serverSidePagination?: ServerSidePaginationProps
}

const SectionTable = ({
  tableData,
  tableHeaderMetadata,
  customColumnRenderer = {},
  serverSidePagination
}: SectionTableProps) => {
  const isServerSide = !!serverSidePagination?.enabled

  // Internal state — only active in client-side mode
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortedBy, setSortedBy] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [sortedData, setSortedData] = useState(tableData.data)

  useEffect(() => {
    const newSortedData = isServerSide
      ? tableData.data
      : sortData(tableData.data, sortedBy, sortDirection)
    setSortedData(newSortedData)
  }, [tableData, sortedBy, sortDirection])

  const sortData = (data, sortedBy, sortDirection) => {
    if (sortDirection === 'none') return data
    if (!sortedBy) return data

    return [...data].sort((a, b) => {
      let aValue = getSortingValue(a, sortedBy)
      let bValue = getSortingValue(b, sortedBy)

      if (aValue === null || bValue === null) {
        return aValue === null
          ? sortDirection === 'asc'
            ? -1
            : 1
          : sortDirection === 'asc'
            ? 1
            : -1
      }

      if (sortedBy === 'task.table.head.createdAt') {
        let aDate = new Date(aValue).getTime()
        let bDate = new Date(bValue).getTime()
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate
      }

      if (sortedBy === 'task.table.head.labels') {
        aValue = aValue.map((label) => label.name).join('')
        bValue = bValue.map((label) => label.name).join('')
      }

      let comparator = String(aValue).localeCompare(String(bValue), 'en', {
        numeric: true,
        sensitivity: 'base',
        ignorePunctuation: true
      })
      return sortDirection === 'asc' ? comparator : -comparator
    })
  }

  const getSortingValue = (item, fieldId) => {
    const getValue = (item, dataBaseKey) => {
      const keys = dataBaseKey.split('.')
      return keys.reduce(
        (obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined),
        item
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

  const handleSort = (fieldId, sortDirection) => {
    const newSortedData = sortData(tableData.data, fieldId, sortDirection)
    setSortedBy(fieldId)
    setSortDirection(sortDirection)
    setSortedData(newSortedData)
  }

  const sortHandler = (fieldId) => {
    setSortedBy((prevSortedBy) => {
      const newSortDirection =
        prevSortedBy === fieldId
          ? sortDirection === 'asc'
            ? 'desc'
            : sortDirection === 'desc'
              ? 'none'
              : 'asc'
          : 'asc'
      handleSort(fieldId, newSortDirection)
      return fieldId
    })
  }

  // Resolve active page and rowsPerPage
  const activePage = isServerSide ? (serverSidePagination.page ?? 0) : page
  const activeRowsPerPage = isServerSide ? (serverSidePagination.rowsPerPage ?? 10) : rowsPerPage

  const handleChangePage = (event, newPage) => {
    if (isServerSide) {
      serverSidePagination.onPageChange(newPage)
    } else {
      setPage(newPage)
    }
  }

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    if (isServerSide) {
      serverSidePagination.onRowsPerPageChange(newRowsPerPage)
    } else {
      setRowsPerPage(newRowsPerPage)
      setPage(0)
    }
  }

  // In server-side mode, all data returned is already the current page — no slicing needed
  const displayedRows = isServerSide
    ? sortedData
    : sortedData.slice(
        activePage * activeRowsPerPage,
        activePage * activeRowsPerPage + activeRowsPerPage
      )

  const emptyRows = isServerSide
    ? 0
    : sortedData.length
      ? activeRowsPerPage -
        Math.min(activeRowsPerPage, sortedData.length - activePage * activeRowsPerPage)
      : 0

  const paginationCount = isServerSide ? (serverSidePagination.totalCount ?? 0) : sortedData.length

  const TableCellWithSortLogic = ({ fieldId, defaultMessage, sortHandler }) => (
    <TableSortLabel
      active={!isServerSide && fieldId === sortedBy && sortDirection !== 'none'}
      direction={sortDirection as 'asc' | 'desc'}
      onClick={isServerSide ? undefined : () => sortHandler(fieldId)}
      hideSortIcon={isServerSide}
    >
      {defaultMessage}
    </TableSortLabel>
  )

  const TableHeadCustom = () => (
    <TableHead>
      <TableRow>
        {Object.entries(tableHeaderMetadata).map(([fieldId, metadata]: [string, MetaDataProps]) => (
          <TableCell key={fieldId}>
            <TableCellWithSortLogic
              sortHandler={sortHandler}
              fieldId={fieldId}
              defaultMessage={metadata.label}
            />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )

  if (tableData.completed && tableData.data.length === 0) {
    return (
      <RootPaper sx={{ p: 2 }}>
        <EmptyBase
          text={
            <FormattedMessage
              id="sectionTable.empty"
              defaultMessage="No records for this table yet"
            />
          }
          icon={<NoDataIcon fontSize="large" color="disabled" />}
        />
      </RootPaper>
    )
  }

  const handleCustomRenderer = (fieldId, item) => {
    return customColumnRenderer?.[fieldId] ? customColumnRenderer[fieldId](item) : item[fieldId]
  }

  return (
    <TableWrapper component={Paper}>
      <StyledTable>
        <TableHeadCustom />
        <TableBody>
          {!tableData.completed ? (
            <TablePlaceholder
              completed={tableData.completed}
              size={Object.entries(tableHeaderMetadata).length}
            />
          ) : (
            displayedRows.map((n) => (
              <TableRow key={n.id}>
                {Object.entries(tableHeaderMetadata).map(([fieldId]) => (
                  <StyledTableCell key={fieldId}>
                    {!tableData.completed ? (
                      <Skeleton variant="text" animation="wave" />
                    ) : (
                      <div>{handleCustomRenderer(fieldId, n) || '--'}</div>
                    )}
                  </StyledTableCell>
                ))}
              </TableRow>
            ))
          )}
          {emptyRows > 0 && (
            <TableRow style={{ height: 48 * emptyRows }}>
              <TableCell colSpan={Object.keys(tableHeaderMetadata).length} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={3}
              count={paginationCount}
              rowsPerPage={activeRowsPerPage}
              page={activePage}
              onPageChange={(e, page) => handleChangePage(e, page)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </StyledTable>
    </TableWrapper>
  )
}

export default SectionTable
