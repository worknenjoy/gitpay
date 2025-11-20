import React from 'react'
import { Tooltip, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { Root, ChipContainer, SpacedChip } from './pickup-tag-list.styles'

const tags = [
  {
    id: 1,
    name: '$ 20',
    value: 20
  },
  {
    id: 2,
    name: '$ 50',
    value: 50
  },
  {
    id: 3,
    name: '$ 100',
    value: 100
  },
  {
    id: 4,
    name: '$ 150',
    value: 150
  },
  {
    id: 5,
    name: '$ 300',
    value: 300
  },
  {
    id: 5,
    name: '$ 500',
    value: 500
  },
  {
    id: 6,
    name: '$ 1000',
    value: 1000
  },
  {
    id: 7,
    name: '$ 2000',
    value: 2000
  },
  {
    id: 8,
    name: '$ 5000',
    value: 5000,
    info: 'No fee for Open Source projects with a bounty equal or higher than $5000'
  }
]

type PickupTagListProps = {
  onPickItem: (value: number) => void
  primaryText: React.ReactNode
  secondaryText: React.ReactNode
}

const PickupTagList = ({ onPickItem, primaryText, secondaryText }: PickupTagListProps) => {
  return (
    <Root>
      <ChipContainer>
        <Typography variant="subtitle2">{primaryText}</Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {secondaryText}
        </Typography>
        <ChipContainer>
          {tags.map((tag) => (
            <SpacedChip
              key={tag.id}
              label={tag.name}
              onClick={() => onPickItem(tag.value)}
              icon={
                tag?.info && (
                  <Tooltip title={tag.info}>
                    <InfoIcon fontSize="small" />
                  </Tooltip>
                )
              }
            />
          ))}
        </ChipContainer>
      </ChipContainer>
    </Root>
  )
}

export default PickupTagList
