import React from 'react';
import About from 'design-library/pages/public-pages/about-public-page/about-public-page';
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