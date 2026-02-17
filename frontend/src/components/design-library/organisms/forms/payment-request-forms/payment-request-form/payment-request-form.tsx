import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  useEffect
} from 'react'
import { Grid, Typography, TextField, Skeleton, Link } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Field from '../../../../atoms/inputs/fields/field/field'
import Alert from '../../../../atoms/alerts/alert/alert'
import Checkboxes from 'design-library/atoms/inputs/checkboxes/checkboxes'
import ConfirmTextDialog from 'design-library/molecules/dialogs/confirm-text-dialog/confirm-text-dialog'
import { AlertWrapper, EndAdornment } from './payment-request-form.styles'

type PaymentRquestFormData = {
  id?: number
  active?: boolean
  deactivate_after_payment?: boolean
  amount?: number
  custom_amount?: boolean
  currency?: string
  title?: string
  description?: string
  send_instructions_email?: boolean
  instructions_content?: string
}

type PaymentRequestFormProps = {
  onSubmit?: (e: any, data: any) => void
  completed?: boolean
  paymentRequest?: {
    completed: boolean
    data: PaymentRquestFormData
  }
}

type PaymentRequestFormHandle = {
  submit: () => void
}

const PaymentRequestForm = forwardRef<PaymentRequestFormHandle, PaymentRequestFormProps>(
  ({ onSubmit, paymentRequest, completed = true }, ref) => {
    const { data } = paymentRequest || {}
    const [error, setError] = useState<string | false>(false)
    const internalFormRef = useRef<HTMLFormElement>(null)
    const [customAmount, setCustomAmount] = useState(false)
    const [sendInstructionsEmailChecked, setSendInstructionsEmailChecked] = useState(false)
    const [instructionsContent, setInstructionsContent] = useState('')
    const [instructionsDialogOpen, setInstructionsDialogOpen] = useState(false)
    const [pendingEnableSendInstructionsEmail, setPendingEnableSendInstructionsEmail] =
      useState(false)
    const editMode = !!data?.id

    useEffect(() => {
      setSendInstructionsEmailChecked(!!data?.send_instructions_email)
      setInstructionsContent(data?.instructions_content || '')
    }, [data?.send_instructions_email, data?.instructions_content])

    // Expose `submit` method to parent
    useImperativeHandle(ref, () => ({
      submit: () => {
        internalFormRef.current?.requestSubmit() // Triggers native submit event
      }
    }))

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const data = Object.fromEntries(formData.entries())
      const fieldsToValidate = !data.title || !data.description || (!customAmount && !data.amount)

      if (fieldsToValidate && !editMode) {
        setError('All fields are required.')
        return
      }

      setError(false)
      if (editMode) {
        onSubmit?.(event, {
          ...data,
          active: formData.get('active') || false,
          send_instructions_email: formData.get('send_instructions_email') || false
        })
        return
      }
      onSubmit?.(event, data)
    }

    const handleCustomAmountChange = useCallback((selected: boolean) => {
      setCustomAmount(selected)
    }, [])

    const handleSendEmailChange = useCallback(
      (selected: boolean) => {
        if (selected) {
          const isFirstEnable = !sendInstructionsEmailChecked
          setSendInstructionsEmailChecked(true)
          setPendingEnableSendInstructionsEmail(isFirstEnable)
          setInstructionsDialogOpen(true)
          return
        }
        setSendInstructionsEmailChecked(false)
        setInstructionsContent('')
        setPendingEnableSendInstructionsEmail(false)
      },
      [sendInstructionsEmailChecked]
    )

    const hasInstructions = instructionsContent.trim().length > 0

    const checkboxes = useMemo(() => {
      const items = [
        {
          label: (
            <FormattedMessage
              id="paymentRequest.form.customAmount"
              defaultMessage="Custom Amount"
            />
          ),
          name: 'custom_amount',
          value: true,
          defaultChecked: data?.custom_amount,
          disabled: editMode,
          alignment: editMode ? 'flex-start' : 'center',
          onChange: handleCustomAmountChange
        },
        {
          label: (
            <FormattedMessage
              id="paymentRequest.form.deactivateAfterPayment"
              defaultMessage="Deactivate after payment"
            />
          ),
          alignment: 'flex-start',
          name: 'deactivate_after_payment',
          value: true,
          defaultChecked: data?.deactivate_after_payment
        },
        {
          label: (
            <>
              <FormattedMessage
                id="paymentRequest.form.sendEmail"
                defaultMessage="Send e-mail notification with instructions on payment"
              />
              {sendInstructionsEmailChecked && hasInstructions && (
                <>
                  {' '}
                  <Link
                    component="button"
                    type="button"
                    style={{ margin: '4px 0' }}
                    variant="caption"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setPendingEnableSendInstructionsEmail(false)
                      setInstructionsDialogOpen(true)
                    }}
                  >
                    <FormattedMessage
                      id="paymentRequest.form.instructions.change"
                      defaultMessage="Change instructions"
                    />
                  </Link>
                </>
              )}
            </>
          ),
          name: 'send_instructions_email',
          value: true,
          defaultChecked: data?.send_instructions_email,
          alignment: 'flex-start',
          checked: sendInstructionsEmailChecked,
          onChange: handleSendEmailChange
        }
      ]

      if (data?.active !== undefined) {
        items.unshift({
          label: <FormattedMessage id="paymentRequest.form.active" defaultMessage="Active" />,
          name: 'active',
          value: true,
          defaultChecked: data?.active
        } as any)
      }

      return items
    }, [
      editMode,
      data?.custom_amount,
      data?.deactivate_after_payment,
      data?.active,
      data?.send_instructions_email,
      handleCustomAmountChange,
      sendInstructionsEmailChecked,
      handleSendEmailChange,
      hasInstructions
    ])

    return (
      <form onSubmit={handleSubmit} ref={internalFormRef}>
        <input type="hidden" name="instructions_content" value={instructionsContent} />
        <ConfirmTextDialog
          open={instructionsDialogOpen}
          handleClose={() => {
            setInstructionsDialogOpen(false)
            setPendingEnableSendInstructionsEmail(false)
          }}
          title={
            <FormattedMessage
              id="paymentRequest.form.instructions.title"
              defaultMessage="Instructions"
            />
          }
          subtitle={
            <FormattedMessage
              id="paymentRequest.form.instructions.subtitle"
              defaultMessage="Add instructions to be included in the payment notification e-mail."
            />
          }
          textAreaName="instructions_content"
          textAreaLabel={
            <FormattedMessage
              id="paymentRequest.form.instructions.label"
              defaultMessage="Instructions"
            />
          }
          actionLabel={
            hasInstructions ? (
              <FormattedMessage
                id="paymentRequest.form.instructions.update"
                defaultMessage="Update"
              />
            ) : (
              <FormattedMessage id="paymentRequest.form.instructions.save" defaultMessage="Save" />
            )
          }
          cancelLabel={<FormattedMessage id="common.cancel" defaultMessage="Cancel" />}
          initialValue={instructionsContent}
          onConfirm={(value) => {
            setInstructionsContent(value)
            setPendingEnableSendInstructionsEmail(false)
          }}
          onCancel={() => {
            if (pendingEnableSendInstructionsEmail) {
              setSendInstructionsEmailChecked(false)
              setInstructionsContent('')
            }
            setPendingEnableSendInstructionsEmail(false)
          }}
        />
        {error && (
          <Alert severity="error" completed={completed}>
            <AlertWrapper>
              <FormattedMessage
                id="paymentRequest.create.error"
                defaultMessage="An error occurred while creating a Payment Request:"
              />
            </AlertWrapper>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field
              label={<FormattedMessage id="form.label.title" defaultMessage="Title" />}
              name="title"
              type="text"
              placeholder="Title of your service"
              defaultValue={data?.title}
              completed={completed}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            {!completed ? (
              <Skeleton variant="rectangular" animation="wave" width="100%" height={120} />
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                label={
                  <FormattedMessage id="form.label.description" defaultMessage="Description" />
                }
                name="description"
                placeholder="Describe your service"
                multiline
                defaultValue={data?.description}
                rows={4}
              />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field
              label={<FormattedMessage id="form.label.amount" defaultMessage="Amount" />}
              name="amount"
              type="number"
              placeholder="Enter the amount"
              inputProps={{ min: 0, step: '0.01' }}
              completed={completed}
              value={data?.amount}
              endAdornment={
                <EndAdornment>
                  <i>
                    <FormattedMessage id="currency" defaultMessage="USD" />
                  </i>
                </EndAdornment>
              }
              disabled={customAmount || !!data?.amount || data?.custom_amount}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Checkboxes completed={completed} checkboxes={checkboxes} includeSelectAll={false} />
          </Grid>
        </Grid>
      </form>
    )
  }
)

export default PaymentRequestForm
