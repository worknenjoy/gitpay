import React from 'react'
import { Button as MaterialButton } from '@mui/material'
import type { ButtonProps as MUIButtonProps } from '@mui/material/Button'
import styles from './button.styles'

export type ButtonProps = MUIButtonProps & {
  label?: React.ReactNode
  completed?: boolean
}

const Button = ({ label, completed = true, children, disabled, component, ...rest }: ButtonProps) => {
  const { Progress } = styles as any
  const isDisabled = !completed ? true : disabled

  const Component = component || MaterialButton

  return (
    <Component disabled={isDisabled} {...rest}>
      <>
        {children ?? label}
        {!completed && <Progress size={24} color="inherit" />}
      </>
    </Component>
  )
}
export default Button
