import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Checkbox } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

import SelectChoicesPlaceholder from './select-choices.placeholder'

import {
  SelectChoicesContainer,
  SelectChoicesHeader,
  SelectChoicesGrid,
  SelectChoicesItem,
  SelectChoicesCard,
  SelectChoicesMedia,
  SelectChoicesLabel,
  SelectChoicesActionBar
} from './select-choices.styles'

type SelectChoicesProps<TItem> = {
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  items: TItem[]
  loading?: boolean
  placeholderCount?: number
  getKey?: (item: TItem, index: number) => React.Key
  getImageSrc: (item: TItem) => string
  getImageAlt?: (item: TItem) => string
  getTitle: (item: TItem) => React.ReactNode
  getDescription?: (item: TItem) => React.ReactNode
  isSelected: (item: TItem) => boolean
  onToggle: (item: TItem) => void
  itemSize?: { xs?: number; sm?: number; md?: number; lg?: number }
}

const defaultGetKey = (item: any, index: number) => item?.id ?? item?.name ?? index

const SelectChoices = <TItem,>({
  title,
  description,
  children,
  items,
  loading = false,
  placeholderCount = 3,
  getKey = defaultGetKey,
  getImageSrc,
  getImageAlt,
  getTitle,
  getDescription,
  isSelected,
  onToggle,
  itemSize = { xs: 12, sm: 6, md: 3 }
}: SelectChoicesProps<TItem>) => {
  const shouldRenderHeader = Boolean(title) || Boolean(description)
  const renderTitle =
    typeof title === 'string' || typeof title === 'number' ? (
      <Typography variant="h5">{title}</Typography>
    ) : (
      title
    )

  return (
    <SelectChoicesContainer elevation={1}>
      {shouldRenderHeader ? (
        <SelectChoicesHeader>
          {renderTitle}
          {description && (
            <Typography variant="body2" color="textSecondary" component="p">
              {description}
            </Typography>
          )}
        </SelectChoicesHeader>
      ) : null}

      <SelectChoicesGrid container spacing={2} alignItems="stretch" justifyContent="space-around">
        {loading ? (
          <SelectChoicesPlaceholder count={placeholderCount} itemSize={itemSize} />
        ) : (
          <>
            {items.map((item, index) => {
              const imageSrc = getImageSrc(item)
              const imageAlt = getImageAlt?.(item) ?? ''
              const itemDescription = getDescription?.(item)

              return (
                <SelectChoicesItem key={getKey(item, index)} size={itemSize}>
                  <SelectChoicesCard variant="outlined">
                    <SelectChoicesMedia>
                      <img src={imageSrc} alt={imageAlt} />
                    </SelectChoicesMedia>
                    <SelectChoicesLabel>
                      <Typography variant="subtitle1">{getTitle(item)}</Typography>
                    </SelectChoicesLabel>
                    <SelectChoicesActionBar>
                      {itemDescription && (
                        <Typography variant="body2" component="p">
                          {itemDescription}
                        </Typography>
                      )}
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                        checkedIcon={<CheckBoxIcon fontSize="large" />}
                        color="primary"
                        inputProps={{ 'aria-label': imageAlt }}
                        checked={isSelected(item)}
                        onChange={() => onToggle(item)}
                      />
                    </SelectChoicesActionBar>
                  </SelectChoicesCard>
                </SelectChoicesItem>
              )
            })}
          </>
        )}
      </SelectChoicesGrid>

      {children}
    </SelectChoicesContainer>
  )
}

SelectChoices.propTypes = {
  title: PropTypes.any.isRequired,
  description: PropTypes.any,
  children: PropTypes.any,
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  placeholderCount: PropTypes.number,
  getKey: PropTypes.func,
  getImageSrc: PropTypes.func.isRequired,
  getImageAlt: PropTypes.func,
  getTitle: PropTypes.func.isRequired,
  getDescription: PropTypes.func,
  isSelected: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  itemSize: PropTypes.object
}

export default SelectChoices
