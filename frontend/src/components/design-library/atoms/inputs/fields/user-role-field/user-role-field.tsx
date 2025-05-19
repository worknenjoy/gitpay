import React from 'react';
import { Grid, Tooltip, Typography } from '@material-ui/core';
import { Help } from '@material-ui/icons';
import Checkboxes from '../../checkboxes/checkboxes';
import { FormattedMessage } from 'react-intl';

const UserRoleField = ({ roles, onChange }) => {
  const { data, completed } = roles;

  const checkBoxes = data.map((role) => ({
    label: role.label,
    name: role.name,
    value: role.id
  }));

  return (
    <Grid container spacing={2} alignContent='center' alignItems='center'>
      <Grid item xs={12} md={2}>
        <Typography variant="caption" color="textSecondary" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <FormattedMessage id="user.types.roles.select.label" defaultMessage="Signup as: " />
          <Tooltip placement='right' title={<FormattedMessage id="user.types.roles.tooltip" defaultMessage="You can change this later." />}>
            <Help fontSize='small' />
          </Tooltip>
        </Typography>
      </Grid>
      <Grid item xs={12} md={10}>
        <Checkboxes
          checkboxes={checkBoxes}
          includeSelectAll={true}
          onChange={onChange}
        />
      </Grid>
    </Grid>
  );
}
export default UserRoleField;