// CardSection.js
import React from 'react';
import { CardElement } from 'react-stripe-elements';

class CardSection extends React.Component {
  render() {
    return (
      <label>
        <CardElement style={{base: {fontSize: '22px', marginTop: 20, marginBottom: 20, display: 'block'}}} />
      </label>
    );
  }
};

export default CardSection;
