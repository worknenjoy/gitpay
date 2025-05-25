import React from 'react';
import Chip from '@material-ui/core/Chip';
import { Tooltip } from '@material-ui/core';
import { HelpOutline as QuestionInfoIcon } from '@material-ui/icons';
import ReactPlaceholder from 'react-placeholder';

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

  const currentStatus = statusList.find((item) => item.status === status)

  const { label = '', color, icon, message } = currentStatus;
  
  // Custom delete icon with tooltip
  const deleteIconWithTooltip = (
    <Tooltip
      title={message || 'Click for more information'}
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

  const extraProps = status === 'active' ? {} : { 
    deleteIcon: deleteIconWithTooltip,
    onDelete: () => setTooltipOpen(true)
  };

  return (
    <ReactPlaceholder
      type="text"
      rows={1}
      ready={completed}
      showLoadingAnimation
      style={{ width: 100, height: 32, display: 'inline-block' }}
    >
      <Chip 
        size="small"
        label={label}
        className={classes[color]}
        icon={icon}
        {...extraProps}
      />
    </ReactPlaceholder>
  );
}

export default BaseStatus;