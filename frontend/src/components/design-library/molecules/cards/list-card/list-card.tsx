import React from 'react'
import { Button, Divider, Skeleton } from '@mui/material'
import ListCardRow, { ListCardRowProps } from './list-card-row'
import {
  RootCard,
  Header,
  HeaderText,
  Title,
  Subtitle,
  HeaderLink,
  Body,
  Footer,
  FooterLink,
  EmptyRoot,
  EmptyIconBadge,
  EmptyText,
  SkeletonRow,
  SkeletonRowRight
} from './list-card.styles'

export type ListCardItem = ListCardRowProps & { id?: string | number }

type ListCardProps = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  link?: React.ReactNode
  footer?: React.ReactNode
  onFooterClick?: (e: any) => void
  items: ListCardItem[]
  emptyIcon?: React.ReactElement
  emptyText?: React.ReactNode
  emptyActionText?: React.ReactNode
  onEmptyActionClick?: (e: any) => void
  completed?: boolean
  loadingRows?: number
}

const RowSkeleton = () => (
  <SkeletonRow>
    <div>
      <Skeleton
        variant="text"
        animation="wave"
        width={180}
        height={9}
        style={{ marginBottom: 4 }}
      />
      <Skeleton variant="text" animation="wave" width="72%" height={13} />
    </div>
    <SkeletonRowRight>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={64}
        height={20}
        style={{ borderRadius: 11 }}
      />
      <Skeleton variant="text" animation="wave" width={58} height={12} />
    </SkeletonRowRight>
  </SkeletonRow>
)

const ListCard = ({
  title,
  subtitle,
  link,
  footer,
  onFooterClick,
  items,
  emptyIcon,
  emptyText,
  emptyActionText,
  onEmptyActionClick,
  completed,
  loadingRows = 3
}: ListCardProps) => {
  const isLoading = completed === false

  return (
    <RootCard>
      <Header>
        <HeaderText>
          {isLoading ? (
            <>
              <Skeleton variant="text" animation="wave" width={150} height={20} />
              <Skeleton variant="text" animation="wave" width={210} height={14} />
            </>
          ) : (
            <>
              <Title>{title}</Title>
              {subtitle && <Subtitle>{subtitle}</Subtitle>}
            </>
          )}
        </HeaderText>
        {!isLoading && link && <HeaderLink>{link}</HeaderLink>}
      </Header>
      <Body>
        {isLoading ? (
          Array.from({ length: loadingRows }).map((_, index) => <RowSkeleton key={index} />)
        ) : items.length === 0 ? (
          <EmptyRoot>
            {emptyIcon && <EmptyIconBadge>{emptyIcon}</EmptyIconBadge>}
            {emptyText && <EmptyText>{emptyText}</EmptyText>}
            {emptyActionText && onEmptyActionClick && (
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={onEmptyActionClick}
                sx={{ mt: 0.5 }}
              >
                {emptyActionText}
              </Button>
            )}
          </EmptyRoot>
        ) : (
          items.map(({ id, ...row }, index) => <ListCardRow key={id ?? index} {...row} />)
        )}
      </Body>
      {footer && (
        <>
          <Divider />
          <Footer>
            <FooterLink onClick={onFooterClick}>{footer}</FooterLink>
          </Footer>
        </>
      )}
    </RootCard>
  )
}

export default ListCard
