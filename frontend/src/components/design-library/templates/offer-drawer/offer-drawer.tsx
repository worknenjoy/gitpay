import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '../../molecules/drawer/drawer'
import OfferDrawerCreate from './components/offer-drawer-create';
import OfferDrawerTabs from './components/offer-drawer-tabs';
import OffersList from '../../molecules/offers-list/offers-list';


const useStyles = makeStyles(theme => ({
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  spanText: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },
}));

type OfferDrawerProps = {
  title: any;
  introTitle: any;
  introMessage: any;
  introImage: any;
  open: boolean;
  onClose: any;
  issue: any;
  actions?: Array<any>;
  offerCheckboxes?: boolean;
  pickupTagListTitle: any;
  pickutTagListDescription: any;
  simpleInfoText: any;
  commentAreaPlaceholder: any;
  hasEmailInput?: boolean;
  onDeliveryDateChange?: any;
  onChangePrice?: any;
  onLearnCheckboxChange?: any;
  onCommentChange?: any;
  onTermsCheckboxChange?: any;
  onConfirmOfferChange: any;
  onEmailInviteChange?: any;
  tabs?: any;
  offersProps?: any;
}

const OfferDrawer = ({ 
  title,
  introTitle,
  introMessage,
  introImage,
  open,
  onClose,
  issue,
  actions,
  offerCheckboxes,
  pickupTagListTitle,
  pickutTagListDescription,
  simpleInfoText,
  commentAreaPlaceholder,
  hasEmailInput = false,
  onDeliveryDateChange,
  onChangePrice,
  onLearnCheckboxChange,
  onCommentChange,
  onTermsCheckboxChange,
  onConfirmOfferChange,
  onEmailInviteChange,
  tabs,
  offersProps
}: OfferDrawerProps) => {
  const [ currentPrice, setCurrentPrice ] = React.useState(0);

  const classes = useStyles();

  const createSection =
    <OfferDrawerCreate
      introTitle={introTitle}
      introMessage={introMessage}
      introImage={introImage}
      issue={issue}
      simpleInfoText={simpleInfoText}
      commentAreaPlaceholder={commentAreaPlaceholder}
      onDeliveryDateChange={onDeliveryDateChange}
      pickupTagListTitle={pickupTagListTitle}
      pickutTagListDescription={pickutTagListDescription}
      setCurrentPrice={setCurrentPrice}
      currentPrice={currentPrice}
      onCommentChange={onCommentChange}
      offerCheckboxes={offerCheckboxes}
      onLearnCheckboxChange={onLearnCheckboxChange}
      onConfirmOfferChange={onConfirmOfferChange}
      onTermsCheckboxChange={onTermsCheckboxChange}
      onEmailInviteChange={onEmailInviteChange}
      hasEmailInput={hasEmailInput}
    />

  const drawerTabs = [
    {
      value: 0,
      label: 'Your existing offers',
      default: true,
      component: <OffersList {...offersProps} />
    },
    {
      value: 1,
      label: 'Make a new offer',
      component: createSection
    }
  ]

  useEffect(() => {
    onChangePrice?.(currentPrice)
  }, [currentPrice])

  return (
    <Drawer
      open={open}
      onClose={onClose}
      actions={actions}
      title={title}
    >
      {tabs ? 
      <div>
        <OfferDrawerTabs tabs={drawerTabs} />
      </div>
      : <div>
          {createSection}
        </div>
      }
    </Drawer>
  )
}

export default OfferDrawer
