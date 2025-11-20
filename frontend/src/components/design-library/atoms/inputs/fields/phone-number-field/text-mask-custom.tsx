import React from 'react'
import MaskedInput from 'react-text-mask'
import type { InputBaseComponentProps } from '@mui/material/InputBase'

type TextMaskCustomProps = InputBaseComponentProps & {
  inputRef?:
    | ((instance: HTMLInputElement | null) => void)
    | React.MutableRefObject<HTMLInputElement | null>
}

function TextMaskCustom(props: TextMaskCustomProps) {
  const { inputRef, ...other } = props

  const handlerRef = (ref) => {
    const node = ref ? ref.inputElement : null
    if (typeof inputRef === 'function') {
      inputRef(node)
    } else if (inputRef && typeof inputRef === 'object') {
      // Support ref objects (React.MutableRefObject)
      inputRef.current = node
    }
  }

  return (
    <MaskedInput
      {...other}
      ref={handlerRef}
      mask={[
        '(',
        '+',
        /[1-9]/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      guide={false}
    />
  )
}

export default TextMaskCustom
