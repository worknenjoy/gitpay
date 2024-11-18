import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TextareaAutosize, FormControl } from '@material-ui/core';

const InputComment = ({ placeholder, value, onChange }) => {
  const [ interestedComment, setInterestedComment ] = useState(value)
  const [ charactersCount, setCharactersCount ] = useState(value.length)
  
  const handleInputInterestedCommentChange = (e) => {
    setInterestedComment(e.target.value)
    setCharactersCount(e.target.value.length)
  }
  return (
    <FormControl fullWidth>
      <FormattedMessage id='issue.bounties.offer.comment.placeholder' defaultMessage='Leave a comment'>
        {p => (
          <TextareaAutosize
            id='interested-comment'
            placeholder={p}
            minRows={8}
            maxLength={1000}
            value={interestedComment}
            onChange={handleInputInterestedCommentChange}

          />
        )}
      </FormattedMessage>
      <small style={{ fontFamily: 'Roboto', color: '#a9a9a9', marginTop: '10px', textAlign: 'right' }}>{charactersCount + '/1000'}</small>
    </FormControl>
  );
};

export default InputComment;