import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Grid, Link, Typography } from '@mui/material'
import { StyledCheckbox, StyledFormControlLabel } from './checkbox-terms.styles'
import TermsDialog from './terms-dialog'
// import { on } from 'events';

const CheckboxTerms = ({ onAccept }) => {
  const [checked, setChecked] = useState(false)
  const [openTerms, setOpenTerms] = useState(false)

  const handleChange = () => {
    setChecked(!checked)
  }

  useEffect(() => {
    onAccept?.(checked)
  }, [checked])

  return (
    <Grid size={{ xs: 12 }}>
      <StyledFormControlLabel
        control={<StyledCheckbox checked={checked} onChange={handleChange} color="primary" />}
        onClick={handleChange}
        label={
          <Typography variant="caption">
            <FormattedMessage
              id="task.bounties.interested.termsOfUseLabel"
              defaultMessage="I AGREE WITH THE {termsOfUseAnchor} AND THE CONFIDENTIALITY OF INFORMATION"
              values={{
                termsOfUseAnchor: (
                  <Link onClick={() => setOpenTerms(true)}>
                    <FormattedMessage
                      id="task.bounties.interested.termsOfUse"
                      defaultMessage="TERMS OF USE"
                    />
                  </Link>
                )
              }}
            />
          </Typography>
        }
      />
      <TermsDialog
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        onAccept={() => setChecked(true)}
        onDisagree={() => setChecked(false)}
      />
    </Grid>
  )
}

export default CheckboxTerms
