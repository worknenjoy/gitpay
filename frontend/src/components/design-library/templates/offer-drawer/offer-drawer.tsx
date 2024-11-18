import React from 'react'
import { FormattedMessage } from 'react-intl'

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '../../molecules/drawer/drawer'

import Introduction from '../../molecules/introduction/introduction';
import IssueCard from '../../organisms/issue-card/issue-card';
import SimpleInfo from '../../molecules/simple-info/simple-info';
import DeliveryDate from '../../organisms/delivery-date/delivery-date';
import PickupTagList from '../../molecules/pickup-tag-list/pickup-tag-list';
import { FormControl, Input, InputLabel, Typography } from '@material-ui/core';
import PricePlan from '../../organisms/price-plan/price-plan';
import InputComment from '../../molecules/input-comment/input-comment';
import OfferDrawerCheckboxes from './components/offer/offer-drawer-checkboxes';
import OfferDrawerActions from './components/offer/offer-drawer-actions';
import CheckboxTerms from '../../molecules/checkbox-terms/checkbox-terms';


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
}: OfferDrawerProps) => {
  const [ currentPrice, setCurrentPrice ] = React.useState(0);

  const classes = useStyles();

  const emailInviteInput = () => {
    if (hasEmailInput) {
      return (
        <FormControl fullWidth style={{marginTop: 10, marginBottom: 10}}>
          <InputLabel htmlFor='email-funding-invite'>
            <FormattedMessage id='task.funding.email' defaultMessage='Please provide the invitee e-mail' />
          </InputLabel>
          <Input
            id='email'
            type='email'
            name='email-funding-invite'
            value={''}
            onChange={() => {}}
          />
        </FormControl>
      )
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      actions={actions}
      title={title}
    >
      <Introduction
        title={introTitle}
        image={introImage}
      >
        <span className={classes.spanText}>
          {introMessage}
        </span>
      </Introduction>
      <IssueCard issue={issue} />
      <SimpleInfo text={
        simpleInfoText
      } />
      { emailInviteInput() }
      <DeliveryDate date={issue.data.deadline} />
      <PickupTagList
        primaryText={
          pickupTagListTitle
        }
        secondaryText={
          pickutTagListDescription
        }
        onPickItem={(price) => setCurrentPrice(price)}
      />
      <PricePlan plan={
        {
          fee: 8,
          category: <FormattedMessage id='actions.task.payment.plan.opensource' defaultMessage='Open Source' />,
          title: <FormattedMessage id='actions.task.payment.plan.opensource.info' defaultMessage='For Open Source Project' />,
          items: [
            <FormattedMessage id='actions.task.payment.plan.bullet.public' defaultMessage='For Public Projects' />,
            <FormattedMessage id='actions.task.payment.plan.bullet.basic' defaultMessage='Basic Campaign' />,
          ],
        }
      } price={currentPrice} onChange={(price) => setCurrentPrice(price)} />
      <InputComment 
        placeholder={commentAreaPlaceholder}
        value=''
        onChange={(e) => console.log(e.target.value)}
      />
      { offerCheckboxes &&
        <OfferDrawerCheckboxes
          priceConfirmed={true}
          currentPrice={currentPrice}
          handleCheckboxIwillDoFor={(e) => console.log(e.target.checked)}
          interestedLearn={false}
          handleCheckboxLearn={(e) => console.log(e.target.checked)}
          termsAgreed={true}
          handleCheckboxTerms={(e) => console.log(e.target.checked)}
        />
      }
      <CheckboxTerms
        onAccept={() => console.log('accept')}
       />
    </Drawer>
  )
}

export default OfferDrawer
