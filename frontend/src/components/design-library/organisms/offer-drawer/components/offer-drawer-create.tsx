import React from 'react';
import { FormattedMessage } from 'react-intl';
import Introduction from '../../../molecules/introduction/introduction';
import IssueCard from '../../issue-card/issue-card';
import SimpleInfo from '../../../molecules/simple-info/simple-info';
import DeliveryDate from '../../delivery-date/delivery-date';
import PickupTagList from '../../../molecules/pickup-tag-list/pickup-tag-list';
import PricePlan from '../../price-plan/price-plan';
import InputComment from '../../../molecules/input-comment/input-comment';
import OfferDrawerCheckboxes from './offer/offer-drawer-checkboxes';
import InviteInput from './invite/invite-input';
import { makeStyles } from '@material-ui/core';
import CheckboxTerms from '../../../molecules/checkbox-terms/checkbox-terms';

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

interface OfferDrawerCreateProps {
  introTitle: any;
  introMessage: any;
  introImage: any;
  issue: any;
  simpleInfoText: any;
  commentAreaPlaceholder: any;
  onDeliveryDateChange: any;
  pickupTagListTitle: any;
  pickutTagListDescription: any;
  setCurrentPrice: any;
  currentPrice: any;
  onCommentChange: any;
  offerCheckboxes: boolean;
  onLearnCheckboxChange: any;
  onConfirmOfferChange: any;
  onTermsCheckboxChange: any;
  onEmailInviteChange: any;
  hasEmailInput?: boolean;
}

const OfferDrawerCreate: React.FC<OfferDrawerCreateProps> = ({
  introTitle,
  introMessage,
  introImage,
  issue,
  simpleInfoText,
  commentAreaPlaceholder,
  onDeliveryDateChange,
  pickupTagListTitle,
  pickutTagListDescription,
  setCurrentPrice,
  currentPrice,
  onCommentChange,
  offerCheckboxes,
  onLearnCheckboxChange,
  onConfirmOfferChange,
  onTermsCheckboxChange,
  onEmailInviteChange,
  hasEmailInput = false
}) => {

  const classes = useStyles();

  return (
    <>
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
      {hasEmailInput && <InviteInput onEmailInviteChange={onEmailInviteChange} />}
      <DeliveryDate
        date={issue.data.deadline}
        onDateChange={onDeliveryDateChange}
      />
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
        onChange={onCommentChange}
      />
      {offerCheckboxes &&
        <OfferDrawerCheckboxes
          currentPrice={currentPrice}
          onLearnCheckboxChange={onLearnCheckboxChange}
          onConfirmOfferChange={onConfirmOfferChange}
        />
      }
      <CheckboxTerms
        onAccept={onTermsCheckboxChange}
      />
    </>
  );
};

export default OfferDrawerCreate;