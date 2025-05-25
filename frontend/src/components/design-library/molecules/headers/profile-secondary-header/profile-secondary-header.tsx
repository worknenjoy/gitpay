import React from 'react';
import AccountHolderStatus from '../../../atoms/status/account-status/account-holder-status/account-holder-status';
import SecondaryTitle from '../../../atoms/typography/secondary-title/secondary-title';

type ProfileSecondaryHeaderProps = {
  title: string | React.ReactNode; // Allow title to be a string or a React node
  subtitle: string | React.ReactNode; // Allow subtitle to be a string or a React node
  aside?: React.ReactNode; // Optional prop for additional content on the right side
};

const ProfileSecondaryHeader = ({ title, subtitle, aside }:ProfileSecondaryHeaderProps) => {
  return (
    <div style={{marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
      <SecondaryTitle
        title={title}
        subtitle={subtitle}
      />
      {aside && aside}
    </div>
  );
}

export default ProfileSecondaryHeader;