import React from 'react'
import moment from 'moment'
import { useIntl, FormattedNumber } from 'react-intl'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'

export type SponsoredProjectRow = {
  id: number | string
  project: string
  amount: number
  bountiesCount: number
  lastFundedAt: string | Date
}

export const useSponsoredProjectsMetadata = () => {
  const intl = useIntl()

  return React.useMemo(
    () => ({
      project: {
        sortable: true,
        numeric: false,
        dataBaseKey: 'project',
        label: intl.formatMessage({
          id: 'sponsoredProjectsTable.project',
          defaultMessage: 'Project'
        })
      },
      amount: {
        sortable: true,
        numeric: true,
        dataBaseKey: 'amount',
        label: intl.formatMessage({
          id: 'sponsoredProjectsTable.amount',
          defaultMessage: 'Amount funded'
        })
      },
      bountiesCount: {
        sortable: true,
        numeric: true,
        dataBaseKey: 'bountiesCount',
        label: intl.formatMessage({
          id: 'sponsoredProjectsTable.bounties',
          defaultMessage: 'Bounties funded'
        })
      },
      lastFundedAt: {
        sortable: true,
        numeric: false,
        dataBaseKey: 'lastFundedAt',
        label: intl.formatMessage({
          id: 'sponsoredProjectsTable.lastFunded',
          defaultMessage: 'Last funded'
        })
      }
    }),
    [intl]
  )
}

export const sponsoredProjectsColumnRenderer = {
  project: (item: SponsoredProjectRow) => <b>{item.project}</b>,
  amount: (item: SponsoredProjectRow) => (
    <FormattedNumber value={item.amount} style="currency" currency="USD" />
  ),
  bountiesCount: (item: SponsoredProjectRow) => item.bountiesCount,
  lastFundedAt: (item: SponsoredProjectRow) => moment(item.lastFundedAt).fromNow()
}

type SponsoredProjectsTableProps = {
  rows: SponsoredProjectRow[]
  completed?: boolean
}

const SponsoredProjectsTable = ({ rows, completed = true }: SponsoredProjectsTableProps) => (
  <SectionTable
    transparent
    tableData={{ data: rows, completed }}
    tableHeaderMetadata={useSponsoredProjectsMetadata()}
    customColumnRenderer={sponsoredProjectsColumnRenderer}
  />
)

export default SponsoredProjectsTable
