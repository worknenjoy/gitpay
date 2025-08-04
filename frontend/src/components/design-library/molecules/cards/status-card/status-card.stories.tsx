import React from 'react';
import StatusCard from './status-card';

const meta = {
  title: 'Design Library/Molecules/Cards/StatusCard',
  component: StatusCard,
  args: {
    status: 'Done',
    name: 'Available Balance',
    completed: true
  },
};

export default meta;

export const Default = {};

export const Loading = {
  completed: false
}