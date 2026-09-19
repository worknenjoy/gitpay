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
  When
} from './list-card-row.styles'

export type ListCardRowProps = {
  meta?: React.ReactNode[]
  title: React.ReactNode
  chip?: { label: React.ReactNode; tone?: StatusChipTone }
  currency?: React.ReactNode
  amount?: React.ReactNode
  when?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
}

const ListCardRow = ({ meta, title, chip, currency, amount, when, onClick }: ListCardRowProps) => {
  const metaPieces = meta?.filter(Boolean)
  const RowComponent = onClick ? ClickableRow : Row

  return (
    <RowComponent onClick={onClick}>
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
      </Left>
      <Right>
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
