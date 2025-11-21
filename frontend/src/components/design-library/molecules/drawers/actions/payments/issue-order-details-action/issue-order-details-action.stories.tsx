import type { Meta, StoryObj } from '@storybook/react';
import IssueOrderDetailsAction from './issue-order-details-action';

const meta: Meta<typeof IssueOrderDetailsAction> = {
  title: 'Design Library/Molecules/Drawers/Actions/Payments/IssueOrderDetailsAction',
  component: IssueOrderDetailsAction,
  parameters: {
    layout: 'centered',
  }
};

export default meta;
type Story = StoryObj<typeof IssueOrderDetailsAction>;

export const Default: Story = {
  args: {
    open: true,
    order: {
      completed: true,
      data: {
        status: 'completed',
        provider: 'stripe',
        amount: '100.00',
        currency: 'USD',
        createdAt: '2024-01-01T12:00:00Z',
      },
    },
    onClose: () => { },
    onCancel: () => { },
  },
};

export const PayPalProvider: Story = {
  args: {
    open: true,
    order: {
      completed: true,
      data: {
        id: 866,
        source_id: "test_source_id_123",
        provider: "paypal",
        currency: "USD",
        amount: "50",
        description: null,
        source_type: null,
        source: null,
        payment_url: "https://www.paypal.com/checkoutnow?token=test_token_123",
        payer_id: null,
        token: "test_token_123",
        authorization_id: null,
        transfer_id: null,
        transfer_group: null,
        status: "open",
        capture: false,
        ordered_in: null,
        destination: null,
        paid: false,
        createdAt: "2025-05-22T13:42:55.044Z",
        updatedAt: "2025-05-22T13:42:55.772Z",
        couponId: null,
        userId: 1,
        TaskId: 1146,
        User: {
          id: 1,
          login_strategy: "github",
          provider: "github",
          provider_id: "12345",
          provider_username: "testuser",
          provider_email: "test@example.com",
          email: "test@example.com",
          email_verified: null,
          password: "$2a$08$test_hashed_password",
          name: "Test User",
          username: "testuser",
          website: "http://test.example.com",
          repos: "30",
          language: "en",
          country: null,
          profile_url: "https://github.com/testuser",
          picture_url: "https://avatars.githubusercontent.com/u/12345?v=4",
          customer_id: "cus_test_customer_id",
          account_id: null,
          paypal_id: "test@example.com",
          os: "Mac",
          skills: "Python,Design,React Native,Testing,Continuous Integration,CSS,Ruby",
          languages: "",
          recover_password_token: null,
          activation_token: null,
          receiveNotifications: false,
          openForJobs: true,
          active: true,
          createdAt: "2018-06-03T14:54:13.682Z",
          updatedAt: "2025-11-11T22:43:35.452Z"
        },
        Task: {
          id: 1146,
          private: false,
          not_listed: false,
          provider: "github",
          description: "Test task description for PayPal payment scenario",
          type: null,
          level: null,
          status: "open",
          deadline: null,
          url: "https://github.com/test/repo/issues/123",
          title: "Test Task Title",
          value: "0",
          paid: false,
          notified: false,
          transfer_id: null,
          assigned: null,
          TransferId: null,
          ProjectId: 651,
          createdAt: "2025-05-19T17:40:34.868Z",
          updatedAt: "2025-11-20T19:43:50.112Z",
          userId: 5122
        }
      },
    },
    onClose: () => { },
    onCancel: () => { },
  },
};

export const Loading: Story = {
  args: {
    open: true,
    order: {
      completed: false,
      data: {},
    },
    onClose: () => { },
    onCancel: () => { },
  },
};

export const EmptyData: Story = {
  args: {
    open: true,
    order: {
      completed: true,
      data: {},
    },
    onClose: () => { },
    onCancel: () => { },
  },
};

export const NoData: Story = {
  args: {
    open: true,
    order: {
      completed: true,
    },
    onClose: () => { },
    onCancel: () => { },
  },
};