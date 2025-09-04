import { styled } from '@mui/material/styles'
import { Paper, Table, TableCell } from '@mui/material'

export const RootPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3)
}))

export const TableWrapper = styled('div')(() => ({
  overflowX: 'auto'
}))

export const StyledTable = styled(Table)(() => ({
  minWidth: 500
}))

export const StyledTableCell = styled(TableCell)(() => ({
  padding: 5
}))

export const ChipStatusSuccess = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(1),
  verticalAlign: 'middle',
  backgroundColor: 'transparent',
  color: theme.palette.primary.main
}))

export const ChipStatusClosed = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(1),
  verticalAlign: 'middle',
  backgroundColor: 'transparent',
  color: theme.palette.error.main
}))

export const AvatarStatusSuccess = styled('div')(({ theme }) => ({
  width: theme.spacing(0),
  height: theme.spacing(0),
  backgroundColor: theme.palette.primary.main
}))

export const AvatarStatusClosed = styled('div')(({ theme }) => ({
  width: theme.spacing(0),
  height: theme.spacing(0),
  backgroundColor: theme.palette.error.main
}))

export default {
  RootPaper,
  TableWrapper,
  StyledTable,
  StyledTableCell,
  ChipStatusSuccess,
  ChipStatusClosed,
  AvatarStatusSuccess,
  AvatarStatusClosed
}
