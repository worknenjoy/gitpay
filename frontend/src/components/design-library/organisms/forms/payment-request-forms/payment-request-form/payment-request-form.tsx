import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo
} from 'react'
import { Grid, Typography, TextField, Skeleton } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Field from '../../../../atoms/inputs/fields/field/field'
import Alert from '../../../../atoms/alerts/alert/alert'
import Checkboxes from 'design-library/atoms/inputs/checkboxes/checkboxes'
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
    const editMode = !!data?.id

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
          active: formData.get('active') || false
        })
        return
      }
      onSubmit?.(event, data)
    }

    const handleCustomAmountChange = useCallback((selected: boolean) => {
      setCustomAmount(selected)
    }, [])

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
          onChange: handleCustomAmountChange
        },
        {
          label: (
            <FormattedMessage
              id="paymentRequest.form.deactivateAfterPayment"
              defaultMessage="Deactivate after payment"
            />
          ),
          name: 'deactivate_after_payment',
          value: true,
          defaultChecked: data?.deactivate_after_payment
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
      handleCustomAmountChange
    ])

    return (
      <form onSubmit={handleSubmit} ref={internalFormRef}>
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
              label="Title"
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
                label="Description"
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
              label="Amount"
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
