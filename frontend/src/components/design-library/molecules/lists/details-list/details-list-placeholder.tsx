import React from 'react';
import { Skeleton } from '@mui/material';

type DetailsListPlaceholderProps = {
  count?: number;
};

const DetailsListPlaceholder: React.FC<DetailsListPlaceholderProps> = ({ count = 4 }) => {
  return (
    Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ marginBottom: 20, width: '30%', marginRight: 20 }}>
        <Skeleton variant="text" height={24} />
        <Skeleton variant="text" height={32} />
      </div>
    ))
  );
};

export default DetailsListPlaceholder;
