import React from 'react'
import OffersList from './offers-list'

export default {
  title: 'Design Library/Molecules/Lists/OffersList',
  component: OffersList
}

const Template = (args) => <OffersList {...args} />

export const Default = Template.bind({})
Default.args = {
  offers: [
    {
      User: {
        username: 'username',
        picture_url: 'https://via.placeholder.com/150',
        name: 'name'
      },
      status: 'status',
      value: 100,
      suggestedDate: new Date()
    }
  ],
  onMessage: (id) => console.error('onMessage', id),
  assigned: false,
  onAccept: (id) => console.error('onAccept', id),
  onReject: (id) => console.error('onReject', id)
}
