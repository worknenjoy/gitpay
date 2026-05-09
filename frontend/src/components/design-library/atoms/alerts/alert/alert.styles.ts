import { styled } from '@mui/material/styles'
import { Alert } from '@mui/material'

const variantStyles = (palette) => ({
  '&.MuiAlert-standardWarning': {
    backgroundColor: '#FFF8F0',
    borderLeft: `4px solid ${palette.warning.main}`,
    '& .MuiAlert-icon': { color: palette.warning.main }
  },
  '&.MuiAlert-standardInfo': {
    backgroundColor: '#F0F7FF',
    borderLeft: `4px solid ${palette.info.main}`,
    '& .MuiAlert-icon': { color: palette.info.main }
  },
  '&.MuiAlert-standardError': {
    backgroundColor: '#FFF0F0',
    borderLeft: `4px solid ${palette.error.main}`,
    '& .MuiAlert-icon': { color: palette.error.main }
  },
  '&.MuiAlert-standardSuccess': {
    backgroundColor: '#F0FFF4',
    borderLeft: `4px solid ${palette.success.main}`,
    '& .MuiAlert-icon': { color: palette.success.main }
  }
})

export const CustomAlertStyled = styled(Alert)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.primary,
  '& .MuiAlertTitle-root': {
    fontWeight: 600,
    color: theme.palette.text.primary
  },
  ...variantStyles(theme.palette),
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
}))
