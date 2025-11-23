import React from 'react'
import { FormattedMessage } from 'react-intl'
// removed withStyles
import { Button, Paper } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { Field } from 'design-library/atoms/inputs/fields/field/field'

const fieldsetStyle = { border: '1px solid #ddd', marginBottom: 20 } as const
const legendStyle = { fontSize: 18, fontWeight: 500 } as const

const WalletForm = ({ value, onChange, onCreate }) => {
  const handleCreateWallet = (e) => {
    e.preventDefault()
    onCreate()
  }

  return (
    <Paper elevation={1} style={{ padding: 20 }}>
      <form>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>
                <Typography>
                  <FormattedMessage id="wallet.new.fieldset.title" defaultMessage="New wallet" />
                </Typography>
              </legend>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <FormattedMessage id="account.basic.name" defaultMessage="name">
                    {(msg) => (
                      <Field
                        onChange={(e) => onChange(e.target.value)}
                        name="name"
                        label={msg}
                        value={value}
                      />
                    )}
                  </FormattedMessage>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <div style={{ float: 'right' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      onClick={handleCreateWallet}
                    >
                      <FormattedMessage
                        id="account.wallet.actions.create"
                        defaultMessage="Create Wallet"
                      />
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </fieldset>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default WalletForm
