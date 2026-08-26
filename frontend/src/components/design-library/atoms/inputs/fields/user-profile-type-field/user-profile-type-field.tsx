import React, { useMemo } from 'react'
import { Grid, Tooltip, Typography } from '@mui/material'
import { Help } from '@mui/icons-material'
import Checkboxes from '../../checkboxes/checkboxes'
import { FormattedMessage } from 'react-intl'

const UserProfileTypeField = ({ profileTypes, onChange }) => {
  const { data, completed } = profileTypes

  const checkBoxes = useMemo(
    () =>
      data.map((profileType) => ({
        label: profileType.label,
        name: profileType.name,
        value: profileType.id
      })),
    [data]
  )

  return (
    <Grid container spacing={2} alignContent="center" alignItems="center" style={{ marginTop: 20 }}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Typography
          variant="caption"
          color="textSecondary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <FormattedMessage id="user.types.roles.select.label" defaultMessage="Signup as: " />
          <Tooltip
            style={{ marginLeft: 5 }}
            placement="right"
            title={
              <FormattedMessage
                id="user.types.roles.tooltip"
                defaultMessage="You can change this later."
              />
            }
          >
            <Help fontSize="small" />
          </Tooltip>
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <Checkboxes
          checkboxes={checkBoxes}
          includeSelectAll={true}
          onChange={onChange}
          completed={completed}
        />
      </Grid>
    </Grid>
  )
}
export default UserProfileTypeField
