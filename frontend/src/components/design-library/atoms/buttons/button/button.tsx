import React from 'react'
import { Button as MaterialButton } from '@mui/material'
import type { ButtonProps as MUIButtonProps } from '@mui/material/Button'
import styles from './button.styles'

export type ButtonProps = MUIButtonProps & {
  label?: React.ReactNode
  completed?: boolean
}

const Button = ({
  label,
  completed = true,
  children,
  disabled,
  component,
  ...rest
}: ButtonProps) => {
  const { Progress } = styles as any
  const isDisabled = !completed ? true : disabled

  // `component` must be forwarded to MaterialButton's polymorphic `component` prop, not used
  // to swap out the element MaterialButton itself renders as — doing the latter (e.g. for
  // component="a") skipped MUI's Button styling entirely and rendered a bare, unstyled <a>.
  return (
    <MaterialButton disabled={isDisabled} component={component} {...rest}>
      <>
        {children ?? label}
        {!completed && <Progress size={24} color="inherit" />}
      </>
    </MaterialButton>
  )
}
export default Button
