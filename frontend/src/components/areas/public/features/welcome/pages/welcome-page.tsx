import React from 'react';
import About from '../../../../../design-library/pages/public/about/about';
import useCommonActions from '../../../../../../hooks/use-common-actions'

const WelcomePage = (props) => {

  const commonProps = useCommonActions(props);

  return (
    <About
      { ...commonProps }
    />
  );
}

export default WelcomePage;