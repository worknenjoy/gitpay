import React from 'react'
import { List, Step, Number, Text } from './numbered-steps.styles'

export type NumberedStepsProps = {
  steps: React.ReactNode[]
}

/** A short ordered list with numbered bubbles. Bold text in a step reads as its action. */
const NumberedSteps = ({ steps }: NumberedStepsProps) => {
  if (!steps || steps.length === 0) return null
  return (
    <List>
      {steps.map((step, index) => (
        <Step key={index}>
          <Number aria-hidden>{index + 1}</Number>
          <Text>{step}</Text>
        </Step>
      ))}
    </List>
  )
}

export default NumberedSteps
