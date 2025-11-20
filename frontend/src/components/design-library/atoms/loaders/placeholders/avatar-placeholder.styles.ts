import { styled } from '@mui/material/styles'
import { Skeleton } from '@mui/material'

export const Placeholder = styled(Skeleton)(() => ({
  width: 40,
  height: 40,
  margin: 10,
}))

export default {
  Placeholder,
}
