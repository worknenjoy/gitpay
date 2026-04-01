import React from 'react'
import { TableRow } from '@mui/material'
import { Skeleton } from '@mui/material'
import { StyledTableCell } from './section-table.styles'

const TablePlaceholder: React.FC<{ rowCount: number; columnCount: number }> = ({
  rowCount,
  columnCount
}) => (
  <React.Fragment>
    {[...Array(rowCount)].map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {[...Array(columnCount)].map((_, cellIndex) => (
          <StyledTableCell key={cellIndex}>
            <div style={{ width: 80, padding: '8px 4px' }}>
              <Skeleton variant="text" animation="wave" />
            </div>
          </StyledTableCell>
        ))}
      </TableRow>
    ))}
  </React.Fragment>
)

export default TablePlaceholder
