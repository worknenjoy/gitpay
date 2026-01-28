import React, { useMemo } from 'react'
import { Grid, Tooltip, Typography } from '@mui/material'
import { Help } from '@mui/icons-material'
import Checkboxes from '../../checkboxes/checkboxes'
import { FormattedMessage } from 'react-intl'

const UserRoleField = ({ roles, onChange }) => {
  const { data, completed } = roles

  const checkBoxes = useMemo(
    () =>
      data.map((role) => ({
        label: role.label,
        name: role.name,
        value: role.id
      })),
    [data]
  )

  return (
    <Grid container spacing={2} alignContent="center" alignItems="center">
      <Grid size={{ xs: 12, md: 2 }}>
        <Typography
          variant="caption"
          color="textSecondary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <FormattedMessage id="user.types.roles.select.label" defaultMessage="Signup as: " />
          <Tooltip
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
      <Grid size={{ xs: 12, md: 10 }}>
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
export default UserRoleField
