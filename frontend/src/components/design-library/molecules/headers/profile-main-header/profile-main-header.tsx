import React from 'react';
import ProfileHeaderStatus from '../../../atoms/status/account-status/account-holder-status/account-holder-status';
import MainTitle from '../../../atoms/typography/main-title/main-title';

type ProfileMainHeaderProps = {
  title: string | React.ReactNode; // Allow title to be a string or a React node
  subtitle: string | React.ReactNode; // Allow subtitle to be a string or a React node
  status?: string; // Optional status prop
  completed?: boolean; // Optional prop to indicate if the status is completed
};

const ProfileMainHeader = ({ title, subtitle, status, completed }:ProfileMainHeaderProps) => {
  return (
    <div style={{marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
      <MainTitle
        title={title}
        subtitle={subtitle}
      />
      {status && (
        <ProfileHeaderStatus status={status} completed={completed} />
      )}
    </div>
  );
}

export default ProfileMainHeader;