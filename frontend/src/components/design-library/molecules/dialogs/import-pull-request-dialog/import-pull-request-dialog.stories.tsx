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
  state: 'merged' as const
}

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

export const Empty = {
  render: StatefulTemplate,
  args: {
    open: true,
    onClose: () => {},
    initialStep: 'form',
    pullRequestUrl: '',
    mode: 'fixed',
    price: '0.00',
    viewerUsername: 'alexanmtz',
    comment: '',
    shareUrl: ''
  }
}

export const Form = {
  render: StatefulTemplate,
  args: {
    ...Empty.args,
    pullRequestUrl: 'https://github.com/worknenjoy/gitpay/pull/1301',
    resolvedPullRequest,
    price: '240.00'
  }
}

export const FormResolving = {
  render: StatefulTemplate,
  args: {
    ...Empty.args,
    pullRequestUrl: 'https://github.com/worknenjoy/gitpay/pull/1301',
    resolvingPullRequest: true
  }
}

export const FormCustomAmount = {
  render: StatefulTemplate,
  args: {
    ...Form.args,
    mode: 'custom'
  }
}

export const Review = {
  render: StatefulTemplate,
  args: {
    ...Form.args,
    initialStep: 'review',
    previewComment:
      "If you'd like to support the work on this pull request, I'm asking **240.00 USD** — totally optional.\n\n**[Pay here](your payment link)**\n\n_[Gitpay](https://gitpay.me) lets you send payments directly to contributors for work delivered on GitHub._"
  }
}

export const DoneNotPosted = {
  render: StatefulTemplate,
  args: {
    ...Form.args,
    initialStep: 'done',
    posted: false,
    comment:
      "If you'd like to support the work on this pull request, I'm asking **240.00 USD** — totally optional.\n\n**[Pay here](https://gitpay.me/pr/1301)**\n\n_[Gitpay](https://gitpay.me) lets you send payments directly to contributors for work delivered on GitHub._",
    shareUrl: 'https://gitpay.me/pr/1301'
  }
}

export const DonePosted = {
  render: StatefulTemplate,
  args: {
    ...DoneNotPosted.args,
    posted: true
  }
}
