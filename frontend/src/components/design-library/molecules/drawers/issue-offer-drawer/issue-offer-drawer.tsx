import React from 'react'
import { FormattedMessage } from 'react-intl'
import OfferDrawer from 'design-library/molecules/drawers/offer-drawer/offer-drawer'
import { Typography } from '@mui/material'
import { SpanText } from './issue-offer-drawer.styles'
import TaskOrderInvoiceConfirm from '../../../../areas/public/features/issue/legacy/task-order-invoice-confirm'
import MessageAssignment from '../../../../areas/public/features/issue/legacy/assignment/messageAssignment'
import taskCover from 'images/task-cover.png'

type TaskOfferDrawerProps = {
  issue: any
  open: boolean
  onClose: any
  onMessage: any
  assigned?: boolean
  updateTask: any
  offerUpdate: any
  loggedUser: any
  createOrder: any
  assignTask: any
  assigns: any
}

const IssueOfferDrawer = ({
  issue,
  open,
  onClose,
  onMessage,
  assigned,
  updateTask,
  offerUpdate,
  loggedUser,
  createOrder,
  assignTask,
  assigns
}: TaskOfferDrawerProps) => {
  const { data } = issue
  const allOffers = data?.Offers || []
  const userOffers = allOffers.filter((offer) => offer.User.id === loggedUser?.user?.id) || []
  const isOwner = data?.User?.id === loggedUser?.user?.id

  const [interestedSuggestedDate, setInterestedSuggestedDate] = React.useState(null)
  const [currentPrice, setCurrentPrice] = React.useState(null)
  const [interestedComment, setInterestedComment] = React.useState('')
  const [interestedLearn, setInterestedLearn] = React.useState(false)
  const [termsAgreed, setTermsAgreed] = React.useState(false)
  const [confirmOffer, setConfirmOffer] = React.useState(false)
  const [confirmOrderDialog, setConfirmOrderDialog] = React.useState(false)
  const [currentOffer, setCurrentOffer] = React.useState(null)
  const [messageDialog, setMessageDialog] = React.useState(false)
  const [interested, setInterested] = React.useState(null)

  const confirmAssignTaskAndCreateOrder = async (event, offer) => {
    event.preventDefault()
    setConfirmOrderDialog(true)
    setCurrentOffer(offer)
  }

  const onReject = async (event, offer) => {
    event.preventDefault()
    offerUpdate(data.id, offer.id, { status: 'rejected' })
  }

  const assignTaskAndCreateOrder = async (event, offer) => {
    event.preventDefault()

    const assign = assigns.filter((item) => item.userId === offer.userId)[0]

    ;(await data.id) &&
      loggedUser.logged &&
      (await createOrder({
        provider: 'stripe',
        amount: offer.value,
        userId: loggedUser?.user?.id,
        email: loggedUser?.user?.email,
        taskId: data.id,
        currency: 'usd',
        status: 'open',
        source_type: 'invoice-item',
        customer_id: loggedUser?.user?.customer_id,
        metadata: {
          offer_id: data.id
        }
      }))
    await assignTask(data.id, assign.id)
    await offerUpdate(data.id, offer.id, { status: 'accepted' })
    setConfirmOrderDialog(false)
    setCurrentOffer(null)
  }

  const openMessageDialog = (id) => {
    setMessageDialog(true)
    setInterested(id)
  }

  const handleOfferTask = () => {
    updateTask({
      id: data.id,
      Offer: {
        userId: loggedUser?.user?.id,
        suggestedDate: interestedSuggestedDate,
        value: currentPrice,
        learn: interestedLearn,
        comment: interestedComment
      }
    })
    onClose()
  }

  return (
    <>
      <MessageAssignment
        visible={messageDialog}
        onClose={() => setMessageDialog(false)}
        id={data.id}
        to={interested}
        messageAction={onMessage}
      />
      <TaskOrderInvoiceConfirm
        visible={confirmOrderDialog}
        onClose={() => setConfirmOrderDialog(false)}
        onConfirm={(event) => assignTaskAndCreateOrder(event, currentOffer)}
        offer={currentOffer}
      />
      <OfferDrawer
        offerCheckboxes={true}
        title={<FormattedMessage id="issue.offer.drawer.title" defaultMessage="Make an offer" />}
        introTitle={
          <FormattedMessage
            id="task.solve.title"
            defaultMessage="Are you interested to solve this issue and earn bounties?"
          />
        }
        introMessage={
          <FormattedMessage
            id="task.bounties.interested.warningMessage"
            defaultMessage={
              "Please apply only if you're able to do it and if you're available and committed to finish in the deadline."
            }
          >
            {(msg) => <SpanText>{msg}</SpanText>}
          </FormattedMessage>
        }
        pickupTagListTitle={
          <Typography style={{ padding: 10 }} variant="body1">
            <FormattedMessage
              id="issues.bounties.interested.canSuggestBounty.title"
              defaultMessage="Suggest a bounty offer"
            />
          </Typography>
        }
        pickutTagListDescription={
          <Typography style={{ padding: 10 }} variant="body1">
            <FormattedMessage
              id="issues.bounties.interested.canSuggestBounty.headline"
              defaultMessage="You will suggest a bounty that will generate an order when the maintainer accept and you receive a payment when is merged"
            />
          </Typography>
        }
        simpleInfoText={
          <FormattedMessage
            id="task.bounties.interested.descritpion"
            defaultMessage="You may be assigned to this task and receive your bounty when your code is merged"
          >
            {(msg) => <SpanText>{msg}</SpanText>}
          </FormattedMessage>
        }
        commentAreaPlaceholder={
          <FormattedMessage
            id="task.bounties.interested.comment.value"
            defaultMessage="Tell about your interest in solve this task and any plan in mind"
          />
        }
        introImage={taskCover}
        issue={issue}
        open={open}
        onClose={onClose}
        actions={[
          {
            label: (
              <FormattedMessage id="task.bounties.interested.cancel" defaultMessage="Cancel" />
            ),
            onClick: onClose
          },
          {
            label: (
              <FormattedMessage
                id="task.bounties.interested.offer"
                defaultMessage="Make an offer"
              />
            ),
            onClick: handleOfferTask,
            variant: 'contained',
            color: 'secondary',
            disabled: !confirmOffer || !termsAgreed || !currentPrice || currentPrice === 0
          }
        ]}
        onDeliveryDateChange={(date) => setInterestedSuggestedDate(date)}
        onChangePrice={(price) => setCurrentPrice(price)}
        onLearnCheckboxChange={(checked) => setInterestedLearn(checked)}
        onTermsCheckboxChange={(checked) => setTermsAgreed(checked)}
        onConfirmOfferChange={(checked) => setConfirmOffer(checked)}
        onCommentChange={(e) => setInterestedComment(e.target.value)}
        tabs={isOwner ? !!allOffers.length : !!userOffers.length}
        offersProps={{
          offers: isOwner ? allOffers : userOffers,
          onMessage: (id) => openMessageDialog(id),
          assigned: assigned,
          onAccept: (event, offer) => confirmAssignTaskAndCreateOrder(event, offer),
          onReject: (event, offer) => onReject(event, offer),
          viewMode: data?.User?.id !== loggedUser?.user?.id
        }}
      />
    </>
  )
}

export default IssueOfferDrawer
