import { styled } from '@mui/material/styles'

export const Wrapper = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  alignItems: 'start',
  gap: 16
}))
