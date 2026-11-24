import React from 'react'
import StatusChip, { StatusChipTone } from 'design-library/atoms/status/status-chip/status-chip'
import {
  Row,
  ClickableRow,
  Left,
  Meta,
  Title,
  Right,
  AmountWrap,
  CurrencyPrefix,
  Amount,
  When,
  Leading,
  Extra
} from './list-card-row.styles'

export type ListCardRowProps = {
  meta?: React.ReactNode[]
  title: React.ReactNode
  chip?: { label: React.ReactNode; tone?: StatusChipTone }
  currency?: React.ReactNode
  amount?: React.ReactNode
  when?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  /** Optional element before the text, e.g. an avatar. */
  leading?: React.ReactNode
  /** Optional content under the title, e.g. reputation chips. */
  extra?: React.ReactNode
  /** Optional status element (e.g. a specific status chip) — rendered where `chip` is. */
  status?: React.ReactNode
}

const ListCardRow = ({
  meta,
  title,
  chip,
  currency,
  amount,
  when,
  onClick,
  leading,
  extra,
  status
}: ListCardRowProps) => {
  const metaPieces = meta?.filter(Boolean)
  const RowComponent = onClick ? ClickableRow : Row

  return (
    <RowComponent onClick={onClick}>
      {leading && <Leading>{leading}</Leading>}
      <Left>
        {metaPieces && metaPieces.length > 0 && (
          <Meta>
            {metaPieces.map((piece, index) => (
              <React.Fragment key={index}>
                {index > 0 && ' · '}
                {piece}
              </React.Fragment>
            ))}
          </Meta>
        )}
        <Title>{title}</Title>
        {extra && <Extra>{extra}</Extra>}
      </Left>
      <Right>
        {status}
        {chip && <StatusChip label={chip.label} tone={chip.tone} />}
        {amount && (
          <AmountWrap>
            {currency && <CurrencyPrefix>{currency}</CurrencyPrefix>}
            <Amount>{amount}</Amount>
          </AmountWrap>
        )}
        {when && <When>{when}</When>}
      </Right>
    </RowComponent>
  )
}

export default ListCardRow
