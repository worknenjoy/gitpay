import React from 'react';
import TextEllipsis from 'text-ellipsis';
import slugify from '@sindresorhus/slugify';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Tooltip, Typography } from '@mui/material';

import logoGithub from 'images/github-logo.png';
import logoBitbucket from 'images/bitbucket-logo.png';
import messages from '../../../../../../../areas/public/features/task/messages/task-messages';

const IssueLinkField = ({ issue }) => {
  const history = useHistory();
  const intl = useIntl();
  const isProfile = history.location.pathname.includes('/profile');
  const isExplore = history.location.pathname.includes('/profile/explore');
  const profile = isProfile ? '/profile' : '';
  const explore = isExplore ? '/explore' : '';
  
  const handleClickListItem = (issue) => {
    const url = `${profile}${explore}/task/${issue.id}/${slugify(issue.title)}`;
    history.push(url);
  };

  return (
    <div style={{ width: 350, display: 'flex', alignItems: 'center' }}>
      <a style={{ cursor: 'pointer' }} onClick={() => handleClickListItem(issue)}>
        <Typography variant="subtitle2">
          {TextEllipsis(`${issue?.title || 'no title'}`, 42)}
        </Typography>
      </a>
      { issue?.url &&
        <a target="_blank" href={issue.url} rel="noreferrer">
          <Tooltip
            id="tooltip-fab"
            title={`${intl.formatMessage(messages.onHoverTaskProvider)} ${issue.provider}`}
            placement="top"
          >
            <img
              width="18"
              src={issue.provider === 'github' ? logoGithub : logoBitbucket}
              style={{
                borderRadius: '50%',
                padding: 3,
                backgroundColor: 'black',
                borderColor: 'black',
                borderWidth: 1,
                marginLeft: 10
              }}
            />
          </Tooltip>
        </a>
      }
    </div>
  );
};

export default IssueLinkField;
