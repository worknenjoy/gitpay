import React from 'react'
import { FormattedMessage } from 'react-intl'

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '../../molecules/drawer/drawer'

import Introduction from '../../molecules/introduction/introduction';
import IssueCard from '../../organisms/issue-card/issue-card';
import SimpleInfo from '../../molecules/simple-info/simple-info';
import DeliveryDate from '../../organisms/delivery-date/delivery-date';
import PickupTagList from '../../molecules/pickup-tag-list/pickup-tag-list';
import { Typography } from '@material-ui/core';
import PricePlan from '../../organisms/price-plan/price-plan';
import InputComment from '../../molecules/input-comment/input-comment';
import OfferDrawerCheckboxes from './components/offer/offer-drawer-checkboxes';
import OfferDrawerActions from './components/offer/offer-drawer-actions';


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
}

const OfferDrawer = ({ title, introTitle, introMessage, introImage, open, onClose, issue }: OfferDrawerProps) => {
  const [ currentPrice, setCurrentPrice ] = React.useState(0);

  const classes = useStyles();

  return (
    <Drawer
      open={open}
      onClose={onClose}

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
        <FormattedMessage id='task.bounties.interested.descritpion' defaultMessage='You may be assigned to this task and receive your bounty when your code is merged'>
          {(msg) => (
            <span className={classes.spanText}>
              {msg}
            </span>
          )}
        </FormattedMessage>
      } />
      <DeliveryDate date={issue.data.deadline} />
      <PickupTagList
        primaryText={
          <Typography style={{ padding: 10 }} variant='body1'>
            <FormattedMessage id='issues.bounties.interested.canSuggestBounty.title' defaultMessage='Suggest a bounty offer' />
          </Typography>
        }
        secondaryText={
          <Typography style={{ padding: 10 }} variant='body1'>
            <FormattedMessage id='issues.bounties.interested.canSuggestBounty.headline' defaultMessage='You will suggest a bounty that will generate an order when the maintainer accept and you receive a payment when is merged' />
          </Typography>
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
        placeholder='Write a comment'
        value=''
        onChange={(e) => console.log(e.target.value)}
      />
      <OfferDrawerCheckboxes
        priceConfirmed={true}
        currentPrice={currentPrice}
        handleCheckboxIwillDoFor={(e) => console.log(e.target.checked)}
        interestedLearn={false}
        handleCheckboxLearn={(e) => console.log(e.target.checked)}
        termsAgreed={true}
        handleCheckboxTerms={(e) => console.log(e.target.checked)}
      />
      <OfferDrawerActions
        priceConfirmed={true}
        termsAgreed={true}
        onClose={() => console.log('cancel')}
      />
    </Drawer>
  )
}

export default OfferDrawer
