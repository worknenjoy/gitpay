import { Toolbar } from '@mui/material'
import { styled } from '@mui/material/styles'

export const FiltersToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  placeContent: 'space-around',
  flexDirection: 'row',
  flexWrap: 'wrap',
  paddingLeft: 0,
  paddingRight: 0,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    paddingLeft: 0,
    paddingRight: 0
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: 0,
    paddingRight: 12
  }
}))

const commonWrapper = (width: string) =>
  styled('div')(({ theme }) => ({
    width,
    margin: 0,
    padding: 0,
    marginRight: 2,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginRight: 0
    }
  }))

export const IssueFilterWrapper = commonWrapper('25%')
export const IssueStatusFilterWrapper = commonWrapper('15%')
export const LabelsFilterWrapper = commonWrapper('30%')
export const LanguageFilterWrapper = commonWrapper('28%')
