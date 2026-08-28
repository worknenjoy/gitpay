import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Checkbox, FormControlLabel } from '@mui/material'
import type { TypographyProps } from '@mui/material/Typography'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { FormattedMessage } from 'react-intl'

import SelectChoicesPlaceholder from './select-choices.placeholder'

import {
  SelectChoicesContainer,
  SelectChoicesHeader,
  SelectChoicesHeaderRow,
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
  compact?: boolean
  includeSelectAll?: boolean
  onSelectAllChange?: (checked: boolean) => void
  titleVariant?: TypographyProps['variant']
  descriptionVariant?: TypographyProps['variant']
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
  itemSize,
  compact = false,
  includeSelectAll = false,
  onSelectAllChange,
  titleVariant,
  descriptionVariant = 'body2'
}: SelectChoicesProps<TItem>) => {
  const effectiveItemSize =
    itemSize ?? (compact ? { xs: 12, sm: 6, md: 6 } : { xs: 12, sm: 12, md: 6 })
  const effectiveTitleVariant = titleVariant ?? (compact ? 'body2' : 'subtitle1')
  const shouldRenderHeader = Boolean(title) || Boolean(description) || includeSelectAll
  const renderTitle =
    typeof title === 'string' || typeof title === 'number' ? (
      <Typography variant="h5">{title}</Typography>
    ) : (
      title
    )
  const allSelected = items.length > 0 && items.every((item) => isSelected(item))

  return (
    <SelectChoicesContainer elevation={1}>
      {shouldRenderHeader ? (
        <SelectChoicesHeader>
          <SelectChoicesHeaderRow>
            <div>
              {renderTitle}
              {description && (
                <Typography variant="body2" color="textSecondary" component="p">
                  {description}
                </Typography>
              )}
            </div>
            {includeSelectAll && !loading && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allSelected}
                    onChange={(e) => onSelectAllChange?.(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="textSecondary">
                    <FormattedMessage
                      id="design.selectChoices.selectAll"
                      defaultMessage="Select all"
                    />
                  </Typography>
                }
              />
            )}
          </SelectChoicesHeaderRow>
        </SelectChoicesHeader>
      ) : null}

      <SelectChoicesGrid container spacing={2} alignItems="stretch" justifyContent="space-around">
        {loading ? (
          <SelectChoicesPlaceholder
            count={placeholderCount}
            itemSize={effectiveItemSize}
            compact={compact}
          />
        ) : (
          <>
            {items.map((item, index) => {
              const imageSrc = getImageSrc(item)
              const imageAlt = getImageAlt?.(item) ?? ''
              const itemDescription = getDescription?.(item)

              return (
                <SelectChoicesItem key={getKey(item, index)} size={effectiveItemSize}>
                  <SelectChoicesCard variant="outlined">
                    <SelectChoicesMedia compact={compact}>
                      <img src={imageSrc} alt={imageAlt} />
                    </SelectChoicesMedia>
                    <SelectChoicesLabel compact={compact}>
                      <Typography variant={effectiveTitleVariant} sx={{ fontWeight: 600 }}>
                        {getTitle(item)}
                      </Typography>
                    </SelectChoicesLabel>
                    <SelectChoicesActionBar compact={compact}>
                      {itemDescription && (
                        <Typography
                          variant={descriptionVariant}
                          color="textSecondary"
                          component="p"
                        >
                          {itemDescription}
                        </Typography>
                      )}
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize={compact ? 'small' : 'large'} />}
                        checkedIcon={<CheckBoxIcon fontSize={compact ? 'small' : 'large'} />}
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
  itemSize: PropTypes.object,
  compact: PropTypes.bool,
  includeSelectAll: PropTypes.bool,
  onSelectAllChange: PropTypes.func,
  titleVariant: PropTypes.string,
  descriptionVariant: PropTypes.string
}

export default SelectChoices
