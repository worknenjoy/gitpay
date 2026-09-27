import React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

const PullRequestIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 16 16">
    <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A3 3 0 0 1 14 5.5v5.628a2.251 2.251 0 1 1-1.5 0V5.5a1.5 1.5 0 0 0-1.5-1.5h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.75.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
  </SvgIcon>
)

export default PullRequestIcon
