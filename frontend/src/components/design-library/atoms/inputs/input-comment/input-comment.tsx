import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { TextareaAutosize, FormControl } from '@mui/material'
import getInputCommentStyles from './input-comment.styles'
import { useTheme } from '@mui/material/styles'

const InputComment = ({ placeholder, onChange }) => {
  const intl = useIntl()
  const [interestedComment, setInterestedComment] = useState('')
  const [charactersCount, setCharactersCount] = useState(0)
  const theme = useTheme()
  const styles = getInputCommentStyles(theme)

  const handleInputInterestedCommentChange = (e) => {
    setInterestedComment(e.target.value)
    setCharactersCount(e.target.value.length)
    onChange(e)
  }
  return (
    <FormControl fullWidth>
      <TextareaAutosize
        id="interested-comment"
        placeholder={intl.formatMessage({
          id: 'issue.bounties.offer.comment.placeholder',
          defaultMessage: 'Leave a comment'
        })}
        minRows={8}
        maxLength={1000}
        value={interestedComment}
        onChange={handleInputInterestedCommentChange}
      />
      <small style={styles.counter as React.CSSProperties}>{charactersCount + '/1000'}</small>
    </FormControl>
  )
}

export default InputComment
