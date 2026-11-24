import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import ConfirmTextDialog from '../confirm-text-dialog/confirm-text-dialog'
import AvatarStack from 'design-library/atoms/data-display/avatar-stack/avatar-stack'

const Recipient = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 16px;
  b {
    display: block;
    font-size: 14px;
    font-weight: 500;
  }
  em {
    display: block;
    font-style: normal;
    font-size: 12.5px;
    color: #6e6e6e;
  }
`

const Topics = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`

const Topic = styled.button`
  font: inherit;
  height: 30px;
  padding: 0 12px;
  border: 1px solid #e0e0e0;
  border-radius: 15px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  &[data-on='true'] {
    border-color: #2c5c46;
    background: rgba(44, 92, 70, 0.08);
    color: #2c5c46;
  }
`

type IssueMessageAuthorProps = {
  open?: boolean
  userId: any
  taskId: any
  name?: string
  avatarUrl?: string
  /** e.g. "Imported this issue a month ago". */
  recipientNote?: React.ReactNode
  /** Optional topics; the chosen one is prefixed to the message. Omit → no topics. */
  topics?: string[]
  onClose: () => void
  onSend: (userId: any, taskId: any, message: string) => void
}

const IssueMessageAuthor = ({
  open = false,
  userId,
  taskId,
  name,
  avatarUrl,
  recipientNote,
  topics,
  onClose,
  onSend
}: IssueMessageAuthorProps) => {
  const [message, setMessage] = React.useState('')
  const [topic, setTopic] = React.useState(topics?.[0])

  const sendMessage = (value: string) => {
    onSend(userId, taskId, topic ? `[${topic}] ${value}` : value)
  }

  const header = (
    <>
      {name && (
        <Recipient>
          <AvatarStack people={[{ name, avatarUrl }]} size="lg" withTooltip={false} />
          <span>
            <b>{name}</b>
            {recipientNote && <em>{recipientNote}</em>}
          </span>
        </Recipient>
      )}
      {topics && topics.length > 0 && (
        <Topics role="radiogroup">
          {topics.map((item) => (
            <Topic
              key={item}
              type="button"
              role="radio"
              aria-checked={topic === item}
              data-on={topic === item}
              onClick={() => setTopic(item)}
            >
              {item}
            </Topic>
          ))}
        </Topics>
      )}
    </>
  )

  return (
    <ConfirmTextDialog
      open={open}
      handleClose={onClose}
      title={
        name ? (
          <FormattedMessage
            id="task.message.title.name"
            defaultMessage="Message {name}"
            values={{ name }}
          />
        ) : (
          <FormattedMessage id="task.message.title" defaultMessage="Send a message to the author" />
        )
      }
      header={header}
      actionsNote={
        <FormattedMessage
          id="task.message.privacy"
          defaultMessage="Sent by email · your address stays hidden"
        />
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
  )
}

export default IssueMessageAuthor
