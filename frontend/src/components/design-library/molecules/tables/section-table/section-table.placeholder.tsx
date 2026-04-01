import React from 'react'
import { TableRow } from '@mui/material'
import { Skeleton } from '@mui/material'
import { StyledTableCell } from './section-table.styles'

const ROW_HEIGHT = 53

const TablePlaceholder: React.FC<{ rowCount: number; columnCount: number }> = ({
  rowCount,
  columnCount
}) => (
  <React.Fragment>
    {[...Array(rowCount)].map((_, rowIndex) => (
      <TableRow key={rowIndex} style={{ height: ROW_HEIGHT }}>
        {[...Array(columnCount)].map((_, cellIndex) => (
          <StyledTableCell key={cellIndex}>
            <Skeleton variant="text" animation="wave" />
          </StyledTableCell>
        ))}
      </TableRow>
    ))}
  </React.Fragment>
)

export default TablePlaceholder
