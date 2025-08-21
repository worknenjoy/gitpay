import React from 'react';
import Chip from '@mui/material/Chip';
import { Tooltip } from '@mui/material';
import { HelpOutline as QuestionInfoIcon } from '@mui/icons-material';
import { Skeleton } from '@mui/material';

type StatusListProps = {
  status: string; 
  label?: string;
  icon?: React.ReactElement;
  message?: string;
  color?: string; // Optional color for the status
}

type statusProps = {
  status: string;
  statusList: Array<StatusListProps>;
  classes: any;
  completed?: boolean; // Optional prop to indicate if the status is completed
}

const BaseStatus = ({ status, statusList, classes, completed = true }:statusProps) => {

  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const currentStatus = statusList.find((item) => item.status === status) || statusList.find((item) => item.status === 'unknown')

  const { label , color, icon, message } = currentStatus;
  
  // Custom delete icon with tooltip
  const deleteIconWithTooltip = (
    message && 
    <Tooltip
      title={message}
      open={tooltipOpen}
      onClose={() => setTooltipOpen(!tooltipOpen)}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      arrow
    > 
      <QuestionInfoIcon
        fontSize="small"
        className={classes[color]}
        onClick={e => {
          e.stopPropagation();
          setTooltipOpen(!tooltipOpen);
        }}
        style={{ cursor: 'pointer' }}
      />
    </Tooltip>
  );

  const extraProps = message && { 
    deleteIcon: deleteIconWithTooltip,
    onDelete: () => setTooltipOpen(true)
  };

  return (
    <>
      {
        !completed ? (
          <>
            <Skeleton variant="text" animation="wave" width="40%" />
          </>
        ) : (
          <>
            { status ? 
              <Chip 
                size="small"
                label={label}
                className={classes[color]}
                icon={icon}
                {...extraProps}
              /> 
              :
              <></>
            }
          </>
        )
      }
    </>
  );
}

export default BaseStatus;