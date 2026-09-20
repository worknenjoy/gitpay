import { styled } from '@mui/material/styles'
import { Typography as MuiTypography } from '@mui/material'

export type CheckListItemState = 'checked' | 'failed' | 'warning' | 'loading' | 'empty'

// See list-card.styles.ts — this app's real text colors, not palette.text.primary/secondary.
const TEXT_SECONDARY = '#6e6e6e'

export const Row = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 10
})

export const Badge = styled('span', {
  shouldForwardProp: (prop) => prop !== 'state'
})<{ state: Exclude<CheckListItemState, 'loading'> }>(({ theme, state }) => {
  const base = {
    flexShrink: 0,
    width: 18,
    height: 18,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    '& svg': { fontSize: 12 }
  }

  switch (state) {
    case 'checked':
      return {
        ...base,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      }
    case 'failed':
      return {
        ...base,
        backgroundColor: 'transparent',
        borderColor: theme.palette.error.main,
        color: theme.palette.error.main
      }
    case 'warning':
      return {
        ...base,
        backgroundColor: 'transparent',
        borderColor: theme.palette.warning.main,
        color: theme.palette.warning.main
      }
    case 'empty':
    default:
      return {
        ...base,
        backgroundColor: 'transparent',
        borderColor: theme.palette.divider,
        color: 'transparent'
      }
  }
})

export const Label = styled(MuiTypography, {
  shouldForwardProp: (prop) => prop !== 'checked' && prop !== 'linked'
})<{ checked?: boolean; linked?: boolean }>(({ theme, checked, linked }) => ({
  fontSize: 13.5,
  fontWeight: linked ? 500 : 400,
  color: linked ? theme.palette.primary.main : TEXT_SECONDARY,
  textDecoration: checked ? 'line-through' : linked ? 'underline' : 'none',
  textDecorationColor: checked ? '#e0dcd4' : undefined,
  cursor: linked ? 'pointer' : 'inherit'
}))
