// Styles for Solution Input component
// Using MUI sx style object so it can be passed directly via the `sx` prop.
// Keep minimal to preserve existing appearance while centralizing styles.
import { SxProps, Theme } from '@mui/material/styles'

export const solutionInputSx: SxProps<Theme> = {
  '& .MuiFilledInput-input': {
    padding: '12px 14px'
  }
}
