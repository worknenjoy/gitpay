import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Grid, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import Field from '../../../atoms/inputs/fields/field/field';
import Alert from '../../../atoms/alerts/alert/alert';
import ReactPlaceholder from 'react-placeholder';
import Checkboxes from 'design-library/atoms/inputs/checkboxes/checkboxes';

const useStyles = makeStyles((theme) => ({
  placholder: {
    margin: 10
  }
}));

interface PaymentRequestFormProps {
  onSubmit?: (e:any, data: any) => void;
  completed?: boolean;
}

type PaymentRequestFormHandle = {
  submit: () => void;
};

const PaymentRequestForm = forwardRef<PaymentRequestFormHandle, PaymentRequestFormProps>(({ onSubmit, completed = true }, ref) => {
  const classes = useStyles();
  const [error, setError] = useState<string | false>(false);
  const internalFormRef = useRef<HTMLFormElement>(null);

  // Expose `submit` method to parent
  useImperativeHandle(ref, () => ({
    submit: () => {
      internalFormRef.current?.requestSubmit(); // Triggers native submit event
    }
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Validate the form data
    if (!data.title || !data.description || !data.amount) {
      setError('All fields are required.');
      return;
    }

    setError(false);
    onSubmit?.(event, data);
  };

  return (
    <form onSubmit={handleSubmit} ref={internalFormRef}>
      {error && (
        <Alert
          severity="error"
          style={{ marginBottom: 20, marginTop: 20 }}
          completed={completed}
        >
          <div style={{ marginBottom: 20 }}>
            <FormattedMessage
              id="paymentRequest.create.error"
              defaultMessage="An error occurred while creating a Payment Request:"
            />
          </div>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Field
            label="Title"
            name="title"
            type="text"
            placeholder="Title of your service"
            completed={completed}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <ReactPlaceholder
            type="text"
            rows={4}
            ready={completed}
            showLoadingAnimation
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Description"
              name="description"
              placeholder="Describe your service"
              multiline
              rows={4}
            />
          </ReactPlaceholder>
        </Grid>
        <Grid item xs={12} md={12}>
          <Field
            label="Amount"
            name="amount"
            type="number"
            placeholder="Enter the amount"
            inputProps={{ min: 0, step: '0.01' }}
            completed={completed}
            endAdornment={
              <div style={{ marginLeft: 8 }}>
                <i>
                  <FormattedMessage id="currency" defaultMessage="USD" />
                </i>
              </div>
            }
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Checkboxes
            checkboxes={[
              { 
                label: <FormattedMessage id="paymentRequest.form.deactivateAfterPayment" defaultMessage="Deactivate after payment" />,
                name: 'deactivate_after_payment',
                value: true
              }
            ]}
            includeSelectAll={false}
          />
        </Grid>
      </Grid>
    </form>
  );
});

export default PaymentRequestForm;