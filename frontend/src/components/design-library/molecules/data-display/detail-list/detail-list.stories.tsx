import React from 'react'
import DetailList from './detail-list'
import DetailRow from '../../../atoms/data-display/detail-row/detail-row'

const meta = {
  title: 'Design Library/Molecules/DataDisplay/DetailList',
  component: DetailList
}

export default meta

export const IdentityAndBusiness = {
  render: () => (
    <DetailList
      title="Identity & business"
      subtitle="Who gets paid. Whop verifies this against your documents; Gitpay only reads the result."
      action={{ label: 'Edit identity on Whop', href: '#' }}
      footnote="Managed on Whop · last synced 2 minutes ago"
    >
      <DetailRow label="Legal name" value="Alexandre Magno" />
      <DetailRow label="Account type" value="Individual" hint="sole contributor" />
      <DetailRow label="Whop company" value="Alexandre Magno" hint="biz_Wxa5ogScCxL2n3" />
      <DetailRow label="Email" value="alexanmtz@gmail.com" />
      <DetailRow label="Country of residence" value="Brazil" />
      <DetailRow label="Identity check" status="VERIFIED" statusColor="success" />
      <DetailRow label="Tax form" value="W-8BEN" hint="accepted 12 Aug 2026" />
    </DetailList>
  )
}

export const Loading = {
  render: () => (
    <DetailList title="Identity & business" completed={false}>
      <DetailRow label="Legal name" completed={false} />
      <DetailRow label="Email" completed={false} />
    </DetailList>
  )
}
