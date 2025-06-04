import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { TextareaAutosize, FormControl } from '@material-ui/core';
import useStyles from './input-comment.styles';

const InputComment = ({ placeholder, onChange }) => {
  const intl = useIntl()
  const [interestedComment, setInterestedComment] = useState('')
  const [charactersCount, setCharactersCount] = useState(0)
  const classes = useStyles()

  const handleInputInterestedCommentChange = (e) => {
    setInterestedComment(e.target.value)
    setCharactersCount(e.target.value.length)
    onChange(e)
  }
  return (
    <FormControl fullWidth>
      <TextareaAutosize
        id='interested-comment'
        placeholder={intl.formatMessage({ id: 'issue.bounties.offer.comment.placeholder', defaultMessage: 'Leave a comment' })}
        minRows={8}
        maxLength={1000}
        value={interestedComment}
        onChange={handleInputInterestedCommentChange}
      />
      <small className={classes.counter}>{charactersCount + '/1000'}</small>
    </FormControl >
  );
};

export default InputComment;