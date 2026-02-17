import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import ConfirmTextDialog from '../confirm-text-dialog/confirm-text-dialog'

const Container = styled.div`
  display: inline-block;
  margin-right: 1rem;
`

const IssueMessageAuthor = ({ open = false, userId, taskId, name, onClose, onSend }) => {
  const [message, setMessage] = React.useState('')

  const sendMessage = (value: string) => {
    onSend(userId, taskId, value)
  }

  return (
    <Container>
      <ConfirmTextDialog
        open={open}
        handleClose={onClose}
        title={
          <FormattedMessage id="task.message.title" defaultMessage="Send a message to the author" />
        }
        subtitle={
          <>
            <FormattedMessage
              id="task.message.author.label"
              defaultMessage="Write a message to the author of this issue"
            />
            {name ? `: ${name}` : ''}
          </>
        }
        textAreaName="message"
        actionLabel={<FormattedMessage id="task.message.form.send" defaultMessage="Send" />}
        cancelLabel={<FormattedMessage id="task.message.form.cancel" defaultMessage="Cancel" />}
        initialValue={message}
        onValueChange={setMessage}
        onConfirm={(value) => sendMessage(value)}
        onCancel={() => {
          // keep message draft for next open
        }}
      />
    </Container>
  )
}

export default IssueMessageAuthor
