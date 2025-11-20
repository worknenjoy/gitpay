import React from 'react'
import { TableRow } from '@mui/material'
import { Skeleton } from '@mui/material'
import { StyledTableCell } from './section-table.styles'

const TablePlaceholder: React.FC<{ size: number; completed: boolean }> = ({ size, completed }) => (
  <React.Fragment>
    {[...Array(size)].map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {[...Array(size)].map((_, cellIndex) => (
          <StyledTableCell key={cellIndex}>
            <div style={{ width: 80, padding: '8px 4px' }}>
              {!completed ? <Skeleton variant="text" animation="wave" /> : <div />}
            </div>
          </StyledTableCell>
        ))}
      </TableRow>
    ))}
  </React.Fragment>
)

export default TablePlaceholder
