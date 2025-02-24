import React from 'react';
import Home from '../../../../../design-library/templates/home/home';
import useCommonActions from '../../../../../../hooks/use-common-actions'

const HomePage = (props) => {
  const commonProps = useCommonActions(props);

  return (
    <Home
      { ...commonProps }
    />
  );
};

export default HomePage;
