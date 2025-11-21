import { Chip, Typography } from '@mui/material';
import React from 'react';
import DetailsListPlaceholder from './details-list-placeholder';

const DetailsList = ({ details, completed }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 10,
        justifyContent: 'space-between'
      }}
    >
      { completed ? details.map((detail, index) => (
        <div style={{ marginBottom: 20, width: '30%', marginRight: 20 }}>
          <Typography variant="body1">
            {detail.label}
          </Typography>
          {!detail.valueType && (
            <Typography variant="body1">
              {detail.value}
            </Typography>
          )}
          {detail.valueType === 'chip' && (
            <Chip label={detail.value} />
          )}
        </div>
      )) : <DetailsListPlaceholder />}
    </div>
  );
}

export default DetailsList;