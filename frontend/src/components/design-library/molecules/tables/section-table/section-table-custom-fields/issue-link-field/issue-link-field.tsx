import React from 'react';
import TextEllipsis from 'text-ellipsis';
import slugify from '@sindresorhus/slugify';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Tooltip, Typography } from '@material-ui/core';

import logoGithub from 'images/github-logo.png';
import logoBitbucket from 'images/bitbucket-logo.png';
import messages from '../../../../../../areas/public/features/task/messages/task-messages';

const IssueLinkField = ({ issue }) => {
  const history = useHistory();
  const intl = useIntl();
  
  const handleClickListItem = (issue) => {
    const url = `/task/${issue.id}/${slugify(issue.title)}`;
    history.push(url);
  };

  return (
    <div style={{ width: 350, display: 'flex', alignItems: 'center' }}>
      <a style={{ cursor: 'pointer' }} onClick={() => handleClickListItem(issue)}>
        <Typography variant="body1" style={{ color: 'black', fontWeight: 'bold' }}>
          {TextEllipsis(`${issue.title || 'no title'}`, 42)}
        </Typography>
      </a>
      <a target="_blank" href={issue.url} rel="noreferrer">
        <Tooltip
          id="tooltip-fab"
          title={`${intl.formatMessage(messages.onHoverTaskProvider)} ${issue.provider}`}
          placement="top"
        >
          <img
            width="24"
            src={issue.provider === 'github' ? logoGithub : logoBitbucket}
            style={{
              borderRadius: '50%',
              padding: 3,
              backgroundColor: 'black',
              borderColor: 'black',
              borderWidth: 1,
              marginLeft: 10,
            }}
          />
        </Tooltip>
      </a>
    </div>
  );
};

export default IssueLinkField;
