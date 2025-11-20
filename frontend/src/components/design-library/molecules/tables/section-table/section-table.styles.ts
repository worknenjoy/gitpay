import { styled } from '@mui/material/styles'
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableContainerProps,
  TableProps,
} from '@mui/material'

export const RootPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
}))

export const TableWrapper = styled(TableContainer)<TableContainerProps>(() => ({
  overflowX: 'auto',
}))

export const StyledTable = styled(Table)<TableProps>(() => ({
  minWidth: 500,
}))

export const StyledTableCell = styled(TableCell)(() => ({
  padding: '5px 0 5px 16px',
}))
