import React from 'react'
import type { Meta } from '@storybook/react'
import ImportPullRequestDialog from './import-pull-request-dialog'

const meta: Meta<typeof ImportPullRequestDialog> = {
  title: 'Design Library/Molecules/Dialogs/ImportPullRequestDialog',
  component: ImportPullRequestDialog,
  parameters: { layout: 'fullscreen' }
}

export default meta

const resolvedPullRequest = {
  repo: 'worknenjoy/gitpay',
  number: 1301,
  title: 'Add Whop payout provider to the payout settings screen',
  state: 'open' as const
}

const samplePullRequests = [
  {
    repo: 'worknenjoy/gitpay',
    number: 1301,
    title: 'Add Whop payout provider to the payout settings screen',
    when: '2 days ago',
    state: 'open' as const
  },
  {
    repo: 'worknenjoy/gitpay',
    number: 1288,
    title: 'Fix currency rounding on payout summary',
    when: '1 week ago',
    state: 'open' as const
  },
  {
    repo: 'vercel/next.js',
    number: 70412,
    title: 'Docs: clarify revalidate option for fetch',
    when: '2 weeks ago',
    state: 'open' as const
  }
]

const sampleOwners = [
  { id: 'alexanmtz', kind: 'User' },
  { id: 'worknenjoy', kind: 'Organization' },
  { id: 'vercel', kind: 'Organization' }
]

const StatefulTemplate = (args: any) => {
  const [mode, setMode] = React.useState(args.mode)
  const [price, setPrice] = React.useState(args.price)
  const [url, setUrl] = React.useState(args.pullRequestUrl)
  const [comment, setComment] = React.useState(args.comment)

  return (
    <ImportPullRequestDialog
      {...args}
      mode={mode}
      onModeChange={setMode}
      price={price}
      onPriceChange={setPrice}
      pullRequestUrl={url}
      onPullRequestUrlChange={setUrl}
      comment={comment}
      onCommentChange={setComment}
    />
  )
}

export const Form = {
  render: StatefulTemplate,
  args: {
    open: true,
    onClose: () => {},
    initialStep: 'form',
    pullRequestUrl: 'https://github.com/worknenjoy/gitpay/pull/1301',
    resolvedPullRequest,
    mode: 'fixed',
    price: '240.00',
    viewerUsername: 'alexanmtz',
    comment:
      'Requesting payment of $240.00 USD for this pull request.\n\nPay here: https://gitpay.me/pr/1301',
    shareUrl: 'gitpay.me/pr/1301'
  }
}

export const FormResolving = {
  render: StatefulTemplate,
  args: {
    ...Form.args,
    resolvedPullRequest: undefined,
    resolvingPullRequest: true
  }
}

export const FormConnected = {
  render: StatefulTemplate,
  args: {
    ...Form.args,
    connected: true,
    pullRequests: samplePullRequests,
    owners: sampleOwners,
    pickedPullRequestNumber: 1301,
    onPickedPullRequestChange: () => {}
  }
}

export const FormConnectedLoading = {
  render: StatefulTemplate,
  args: {
    ...FormConnected.args,
    loadingPullRequests: true
  }
}

export const FormConnectedEmpty = {
  render: StatefulTemplate,
  args: {
    ...FormConnected.args,
    pullRequests: [],
    pickedPullRequestNumber: undefined
  }
}

export const FormCustomAmount = {
  render: StatefulTemplate,
  args: {
    ...Form.args,
    mode: 'custom'
  }
}

export const Preview = {
  render: StatefulTemplate,
  args: {
    ...Form.args,
    initialStep: 'preview'
  }
}

export const Posted = {
  render: StatefulTemplate,
  args: {
    ...Form.args,
    initialStep: 'posted'
  }
}
