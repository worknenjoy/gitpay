import React, { useState } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import MomentComponent from 'moment'
import classNames from 'classnames'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Avatar,
  Card,
  CardHeader,
  Typography,
  Button,
  Tooltip,
  Paper,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Checkbox,
  Link,
  FormControlLabel,
  DialogContentText,
  TextareaAutosize,
} from '@mui/material'
import {
  DateRange as DateIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material'

import Drawer from 'design-library/molecules/drawers/drawer/drawer'
import Introduction from 'design-library/molecules/content/introduction/introduction'
import PickupTagList from 'design-library/molecules/lists/pickup-tag-list/pickup-tag-list'
import PricePlan from 'design-library/organisms/forms/price-plan-form/price-plan'

import LoginButton from '../../../../private/components/session/login-button'

import logoGithub from 'images/github-logo-black.png'
import logoBitbucket from 'images/bitbucket-logo-blue.png'

const TaskAssignment = (props) => {
  const { classes, task } = props

  const [currentTab, setCurrentTab] = useState(0)

  const taskAssignmentCheckboxes = () => {
    if (props.taskFundingDialog) {
      return (
        <Grid container spacing={3} style={{ fontFamily: 'Roboto', color: '#a9a9a9' }}>
          <Grid size={{ xs: 12 }} style={{ paddingTop: 0 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.termsAgreed}
                  onChange={props.handleCheckboxTerms}
                  color="primary"
                  style={{ paddingRight: 5 }}
                />
              }
              onClick={(e) => {
                if (e.target.parentElement.nodeName === 'A') {
                  e.preventDefault()
                }
              }}
              label={
                <Typography variant="caption">
                  <FormattedMessage
                    id="task.bounties.interested.termsOfUseLabel"
                    defaultMessage="I AGREE WITH THE {termsOfUseAnchor} AND THE CONFIDENTIALITY OF INFORMATION"
                    values={{
                      termsOfUseAnchor: (
                        <Link onClick={props.handleTermsDialog}>
                          <FormattedMessage
                            id="task.bounties.interested.termsOfUse"
                            defaultMessage="TERMS OF USE"
                          />
                        </Link>
                      ),
                    }}
                  />
                </Typography>
              }
            />
          </Grid>
        </Grid>
      )
    }
    if (props.assignDialog) {
      return (
        <Grid container spacing={3} style={{ fontFamily: 'Roboto', color: '#a9a9a9' }}>
          <Grid size={{ xs: 12, sm: 6 }} style={{ paddingBottom: 0 }}>
            <FormattedMessage
              id="task.bounties.interested.iWillDoFor"
              defaultMessage="I will do for"
            >
              {(msg) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={props.priceConfirmed}
                      onChange={props.handleCheckboxIwillDoFor}
                      color="primary"
                      style={{ paddingRight: 5 }}
                    />
                  }
                  label={
                    <Typography variant="caption">
                      {' '}
                      {msg} <span style={{ fontWeight: 'bold' }}>${props.currentPrice}</span>{' '}
                    </Typography>
                  }
                />
              )}
            </FormattedMessage>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 6 }}
            style={{ paddingBottom: 0 }}
            className={classes.starterCheckbox}
          >
            <FormattedMessage
              id="task.bounties.interested.iAmStarter"
              defaultMessage="I want to do for learning purposes"
            >
              {(msg) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={props.interestedLearn}
                      onChange={props.handleCheckboxLearn}
                      color="primary"
                      style={{ paddingRight: 5 }}
                    />
                  }
                  label={<Typography variant="caption"> {msg} </Typography>}
                />
              )}
            </FormattedMessage>
          </Grid>
          <Grid size={{ xs: 12 }} style={{ paddingTop: 0 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.termsAgreed}
                  onChange={props.handleCheckboxTerms}
                  color="primary"
                  style={{ paddingRight: 5 }}
                />
              }
              onClick={(e) => {
                if (e.target.parentElement.nodeName === 'A') {
                  e.preventDefault()
                }
              }}
              label={
                <Typography variant="caption">
                  <FormattedMessage
                    id="task.bounties.interested.termsOfUseLabel"
                    defaultMessage="I AGREE WITH THE {termsOfUseAnchor} AND THE CONFIDENTIALITY OF INFORMATION"
                    values={{
                      termsOfUseAnchor: (
                        <Link onClick={props.handleTermsDialog}>
                          <FormattedMessage
                            id="task.bounties.interested.termsOfUse"
                            defaultMessage="TERMS OF USE"
                          />
                        </Link>
                      ),
                    }}
                  />
                </Typography>
              }
            />
          </Grid>
        </Grid>
      )
    }
  }

  const actionButtonsTask = () => {
    if (props.taskFundingDialog) {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 10 }}>
          <Button
            onClick={props.handleAssignFundingDialogClose}
            color="primary"
            style={{ marginRight: 10 }}
          >
            <FormattedMessage id="task.bounties.actions.cancel" defaultMessage="Cancel" />
          </Button>
          <Button
            type="primary"
            htmlFor="submit"
            variant="contained"
            color="primary"
            disabled={
              !props.termsAgreed ||
              !props.currentPrice ||
              !props.fundingInvite.email ||
              !props.fundingInvite.comment
            }
          >
            <FormattedMessage id="task.funding.form.send" defaultMessage="Send Invite" />
          </Button>
        </div>
      )
    }
    if (props.assignDialog) {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 10 }}>
          <Button
            onClick={props.handleAssignFundingDialogClose}
            color="primary"
            style={{ marginRight: 10 }}
          >
            <FormattedMessage id="general.actions.cancel" defaultMessage="Cancel" />
          </Button>
          <Button
            variant="contained"
            type="primary"
            htmlFor="submit"
            color="primary"
            disabled={!props.priceConfirmed || !props.termsAgreed}
          >
            <FormattedMessage id="issues.bounties.actions.work" defaultMessage="Create Offer" />
          </Button>
        </div>
      )
    }
  }

  const emailInviteInput = () => {
    if (props.taskFundingDialog) {
      return (
        <FormControl fullWidth style={{ marginTop: 10, marginBottom: 10 }}>
          <InputLabel htmlFor="email-funding-invite">
            <FormattedMessage
              id="task.funding.email"
              defaultMessage="Please provide the invitee e-mail"
            />
          </InputLabel>
          <Input
            id="email"
            type="email"
            name="email-funding-invite"
            value={props.fundingInvite.email}
            onChange={props.handleFundingEmailInputChange}
          />
        </FormControl>
      )
    }
  }

  const dialogInputComment = () => {
    if (props.assignDialog) {
      return (
        <FormControl fullWidth>
          <FormattedMessage
            id="task.bounties.interested.comment.value"
            defaultMessage="Tell about your interest in solve this task and any plan in mind"
          >
            {(placeholder) => (
              <TextareaAutosize
                id="interested-comment"
                type="text"
                placeholder={placeholder}
                rowsMin={8}
                maxLength={1000}
                value={props.interestedComment}
                onChange={props.handleInputInterestedCommentChange}
              />
            )}
          </FormattedMessage>
          <small
            style={{
              fontFamily: 'Roboto',
              color: '#a9a9a9',
              marginTop: '10px',
              textAlign: 'right',
            }}
          >
            {props.charactersCount + '/1000'}
          </small>
        </FormControl>
      )
    }

    if (props.taskFundingDialog) {
      return (
        <FormControl fullWidth>
          <InputLabel htmlFor="funding-invite-comment">
            <FormattedMessage
              id="task.invite.text.label"
              defaultMessage="Write a text to be sent with the invite"
            />
          </InputLabel>
          <Input
            id="funding-invite-comment"
            type="text"
            inputProps={{ maxLength: '120' }}
            value={props.fundingInvite.comment}
            onChange={props.handleFundingInputMessageChange}
          />

          <small
            style={{
              fontFamily: 'Roboto',
              color: '#a9a9a9',
              marginTop: '10px',
              textAlign: 'right',
            }}
          >
            {props.charactersCount + '/120'}
          </small>
        </FormControl>
      )
    }
  }

  const dialogCoverInvite = () => {
    if (props.assignDialog) {
      return (
        <Introduction
          title={
            <FormattedMessage
              id="task.solve.title"
              defaultMessage="Are you interested to solve this issue and earn bounties?"
            />
          }
          image={props.taskCover}
        >
          <FormattedMessage
            id="task.bounties.interested.warningMessage"
            defaultMessage={
              "Please apply only if you're able to do it and if you're available and committed to finish in the deadline."
            }
          >
            {(msg) => <span className={classes.spanText}>{msg}</span>}
          </FormattedMessage>
        </Introduction>
      )
    }

    if (props.taskFundingDialog) {
      return (
        <React.Fragment>
          <Introduction
            title={
              <FormattedMessage
                id="task.funding.title"
                defaultMessage="Invite someone to add bounties to this issue"
              />
            }
            image={props.taskCover}
          >
            <FormattedMessage
              id="task.funding.description"
              defaultMessage={
                'You can invite a investor, sponsor, or the project owner to fund this issue and let them know your suggestions'
              }
            >
              {(msg) => <span className={classes.spanText}>{msg}</span>}
            </FormattedMessage>
          </Introduction>
        </React.Fragment>
      )
    }
  }

  const dialogTitleMessage = () => {
    if (props.taskFundingDialog) {
      return (
        <DialogTitle id="form-dialog-title">
          <FormattedMessage
            id="task.funding.logged.info"
            defaultMessage="You need to login to invite someone"
          />
        </DialogTitle>
      )
    }

    if (props.assignDialog) {
      return (
        <DialogTitle id="form-dialog-title">
          <FormattedMessage
            id="task.bounties.logged.info"
            defaultMessage="You need to login to be assigned to this task"
          />
        </DialogTitle>
      )
    }
  }

  const loginForm = () => {
    return (
      <div>
        {/* <DialogTitle id='form-dialog-title'> */}
        {dialogTitleMessage()}
        {/* </DialogTitle> */}
        <DialogContent>
          <div className={classes.mainBlock}>
            <LoginButton referer={props.location} includeForm />
          </div>
        </DialogContent>
      </div>
    )
  }

  return (
    <Drawer
      open={props.taskFundingDialog}
      onClose={props.handleAssignFundingDialogClose}
      aria-labelledby="form-dialog-title"
      title={<FormattedMessage id="issue.offer.drawer.title" defaultMessage="Make an offer" />}
    >
      {dialogCoverInvite()}
      {currentTab === 0 && (
        <React.Fragment>
          {!props.logged ? (
            loginForm()
          ) : (
            <div>
              <form onSubmit={props.assignDialog ? props.handleOfferTask : props.sendFundingInvite}>
                {emailInviteInput()}
                {task.data.metadata && (
                  <Card>
                    <CardHeader
                      className={classes.cardHeader}
                      classes={{ avatar: classes.cardAvatar }}
                      avatar={
                        <FormattedMessage
                          id="task.status.created.name"
                          defaultMessage="Created by {name}"
                          values={{
                            name: task.data.metadata
                              ? task.data.metadata.issue.user.login
                              : 'unknown',
                          }}
                        >
                          {(msg) => (
                            <Tooltip id="tooltip-github" title={msg} placement="bottom">
                              <a
                                href={`${task.data.metadata.issue.user.html_url}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Avatar
                                  src={task.data.metadata.issue.user.avatar_url}
                                  className={classNames(classes.avatar)}
                                />
                              </a>
                            </Tooltip>
                          )}
                        </FormattedMessage>
                      }
                      title={
                        <Typography variant="h6" color="primary">
                          <Link href={`${task.data.url}`} target="_blank" class={classes.taskTitle}>
                            {task.data.title}
                            <img
                              width="24"
                              height="24"
                              style={{ marginLeft: 10 }}
                              src={task.data.provider === 'github' ? logoGithub : logoBitbucket}
                            />
                          </Link>
                        </Typography>
                      }
                      subheader={
                        <Typography variant="body1" style={{ marginTop: 5 }} color="primary">
                          {props.renderIssueAuthorLink()}
                        </Typography>
                      }
                      action={props.timePlaceholder}
                    />
                  </Card>
                )}
                <div style={{ paddingBottom: 10, display: 'flex', alignItems: 'center' }}>
                  <div>
                    <InfoIcon className={classes.iconCenter} style={{ color: 'action' }} />
                  </div>
                  <div>
                    <Typography
                      type="subheading"
                      variants="body1"
                      gutterBottom
                      style={{ color: 'gray', marginTop: 5, fontSize: 11 }}
                    >
                      <FormattedMessage
                        id="task.bounties.interested.descritpion"
                        defaultMessage="You may be assigned to this task and receive your bounty when your code is merged"
                      >
                        {(msg) => <span className={classes.spanText}>{msg}</span>}
                      </FormattedMessage>
                    </Typography>
                  </div>
                </div>
                <Paper
                  style={{
                    background: '#F7F7F7',
                    borderColor: '#F0F0F0',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    boxShadow: 'none',
                    padding: 10,
                    paddingTop: 0,
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Typography type="title" variant="body1">
                      <FormattedMessage
                        id="task.bounties.interested.deliveryDateTitle"
                        defaultMessage="Review Delivery Dates"
                      />
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
                    <div style={{ width: 25, justifyContent: 'center', display: 'flex' }}>
                      <WarningIcon style={{ color: '#D7472F', fontSize: 18 }} />
                    </div>
                    <div style={{ paddingLeft: 5 }}>
                      <Typography
                        type="caption"
                        variant="caption"
                        gutterBottom
                        style={{ color: 'gray' }}
                      >
                        <FormattedMessage
                          id="task.bounties.interested.deliveryDateSuggest"
                          defaultMessage={'You can suggest other delivery date.'}
                        >
                          {(msg) => <span className={classes.spanText}>{msg}</span>}
                        </FormattedMessage>
                      </Typography>
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
                    <div
                      style={{
                        width: 25,
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <CalendarIcon style={{ color: 'gray' }} />
                    </div>
                    <div className={classes.deliveryDateSuggestion}>
                      <Typography type="caption" variant="caption" style={{ color: 'gray' }}>
                        <span className={classes.spanText}>
                          <FormattedMessage
                            id="task.bounties.interested.deliveryDate"
                            defaultMessage="Delivery date at {deliveryDate}"
                            values={{ deliveryDate: props.deliveryDate }}
                          />
                          {props.deadline ? (
                            <FormattedMessage
                              id="task.bounties.interested.deadline"
                              defaultMessage=" (in {deadline} days)"
                              values={{ deadline: props.deadline }}
                            />
                          ) : null}
                        </span>
                      </Typography>
                      <Link
                        onClick={props.handleSuggestAnotherDate}
                        variant="body1"
                        className={classes.dateSuggestionBtn}
                      >
                        <FormattedMessage
                          id="task.bounties.actions.sugggestAnotherDate"
                          defaultMessage="SUGGEST ANOTHER DATE"
                        />
                        &nbsp;
                      </Link>
                    </div>
                  </div>

                  {props.showSuggestAnotherDateField && (
                    <FormControl fullWidth>
                      <FormattedMessage id="task.status.deadline.day.label" defaultMessage="Day">
                        {(msg) => (
                          <InputLabel htmlFor="interested-date" shrink="true">
                            {msg}
                          </InputLabel>
                        )}
                      </FormattedMessage>
                      <FormattedMessage
                        id="task.status.deadline.day.insert.label"
                        defaultMessage="Choose a date"
                      >
                        {(msg) => (
                          <Input
                            id="interested-date"
                            startAdornment={
                              <InputAdornment position="start">
                                <DateIcon />
                              </InputAdornment>
                            }
                            placeholder={msg}
                            type="date"
                            value={
                              `${MomentComponent(props.interestedSuggestedDate).format('YYYY-MM-DD')}` ||
                              `${MomentComponent().format('YYYY-MM-DD')}`
                            }
                            onChange={props.handleInputChangeCalendar}
                          />
                        )}
                      </FormattedMessage>
                    </FormControl>
                  )}
                </Paper>
                <PickupTagList
                  primaryText={
                    <Typography type="heading" style={{ padding: 10 }} variant="body1">
                      <FormattedMessage
                        id="issues.bounties.interested.canSuggestBounty.title"
                        defaultMessage="Suggest a bounty offer"
                      />
                    </Typography>
                  }
                  secondaryText={
                    <Typography type="heading" style={{ padding: 10 }} variant="body1">
                      <FormattedMessage
                        id="issues.bounties.interested.canSuggestBounty.headline"
                        defaultMessage="You will suggest a bounty that will generate an order when the maintainer accept and you receive a payment when is merged"
                      />
                    </Typography>
                  }
                  onPickItem={(price) => props.pickTaskPrice(price)}
                />
                <PricePlan
                  plan={{
                    fee: 8,
                    category: (
                      <FormattedMessage
                        id="actions.task.payment.plan.opensource"
                        defaultMessage="Open Source"
                      />
                    ),
                    title: (
                      <FormattedMessage
                        id="actions.task.payment.plan.opensource.info"
                        defaultMessage="For Open Source Project"
                      />
                    ),
                    items: [
                      <FormattedMessage
                        id="actions.task.payment.plan.bullet.public"
                        defaultMessage="For Public Projects"
                      />,
                      <FormattedMessage
                        id="actions.task.payment.plan.bullet.basic"
                        defaultMessage="Basic Campaign"
                      />,
                    ],
                  }}
                  price={props.currentPrice}
                  onChange={() => {}}
                />

                {dialogInputComment()}
                {taskAssignmentCheckboxes()}
                {actionButtonsTask()}
              </form>

              <Dialog
                open={props.termsDialog}
                onClose={props.handleTermsDialogClose}
                aria-labelledby="terms-dialog-title"
                aria-describedby="terms-dialog-description"
              >
                <DialogTitle id="terms-dialog-title">
                  <FormattedMessage
                    id="task.bounties.interested.termsOfUse"
                    defaultMessage="TERMS OF USE"
                  />
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="terms-dialog-description">
                    <FormattedMessage
                      id="task.bounties.interested.termsOfUseText"
                      defaultMessage={
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                      }
                    />
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => props.handleTermsDialogClose(false)} color="primary">
                    <FormattedMessage
                      id="task.bounties.interested.disagree"
                      defaultMessage="DISAGREE"
                    />
                  </Button>
                  <Button
                    onClick={() => props.handleTermsDialogClose(true)}
                    color="primary"
                    autoFocus
                  >
                    <FormattedMessage id="task.bounties.interested.agree" defaultMessage="AGREE" />
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </React.Fragment>
      )}
    </Drawer>
  )
}

export default injectIntl(TaskAssignment)
