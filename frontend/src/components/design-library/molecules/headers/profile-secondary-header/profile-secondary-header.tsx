import React from 'react';
import ProfileHeaderStatus from '../../../atoms/status/account-status/account-holder-status/account-holder-status';
import SecondaryTitle from '../../../atoms/typography/secondary-title/secondary-title';

type ProfileSecondaryHeaderProps = {
  title: string | React.ReactNode; // Allow title to be a string or a React node
  subtitle: string | React.ReactNode; // Allow subtitle to be a string or a React node
  status?: string; // Optional status prop
  completed?: boolean; // Optional prop to indicate if the status is completed
};

const ProfileSecondaryHeader = ({ title, subtitle, status, completed }:ProfileSecondaryHeaderProps) => {
  return (
    <div style={{marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
      <SecondaryTitle
        title={title}
        subtitle={subtitle}
      />
      {status && (
        <ProfileHeaderStatus status={status} completed={completed} />
      )}
    </div>
  );
}

export default ProfileSecondaryHeader;