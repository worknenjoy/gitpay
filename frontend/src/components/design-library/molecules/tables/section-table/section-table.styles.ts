import { styled } from '@mui/material/styles'
import { Table, TableCell, TableContainer, TableContainerProps, TableProps } from '@mui/material'

export const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  textTransform: 'uppercase',
  fontSize: '0.7rem',
  letterSpacing: '0.08em',
  color: theme.palette.text.secondary,
  fontWeight: 600,
  padding: '8px 0 8px 16px'
}))

export const RootPaper = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3)
}))

export const TableWrapper = styled(TableContainer)<TableContainerProps>(() => ({
  overflowX: 'auto'
}))

export const StyledTable = styled(Table)<TableProps>(() => ({
  minWidth: 500
}))

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '12px 0 12px 16px',
  '& .MuiChip-root': {
    fontSize: '0.72rem',
    height: 24,
    '& .MuiChip-label': { paddingLeft: 8, paddingRight: 8 }
  },
  '& .MuiChip-outlined': {
    borderColor: theme.palette.divider,
    color: theme.palette.text.secondary
  }
}))
