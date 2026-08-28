import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Tooltip, Typography } from '@mui/material'
import { Help } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import SelectChoices from '../../../../molecules/select-choices/select-choices'
import type { TypographyProps } from '@mui/material/Typography'
import { profileTypeImages } from './profile-type-images'

type ProfileType = {
  id: string | number
  name: string
  label: string
  description?: string
}

type UserProfileTypeCardsProps = {
  profileTypes: { data: ProfileType[]; completed?: boolean }
  onChange?: (checked: Array<string | number>) => void
  compact?: boolean
  selected?: Array<string | number>
  itemSize?: { xs?: number; sm?: number; md?: number; lg?: number }
  includeSelectAll?: boolean
  titleVariant?: TypographyProps['variant']
  descriptionVariant?: TypographyProps['variant']
}

const UserProfileTypeCards = ({
  profileTypes,
  onChange,
  compact = false,
  selected,
  itemSize,
  includeSelectAll = true,
  titleVariant,
  descriptionVariant
}: UserProfileTypeCardsProps) => {
  const { data, completed } = profileTypes
  const hasUserEditedRef = useRef(false)
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>(selected ?? [])

  useEffect(() => {
    if (hasUserEditedRef.current) return
    if (selected) {
      setSelectedIds(selected)
    }
  }, [selected])

  useEffect(() => {
    onChange?.(selectedIds)
  }, [selectedIds])

  const handleToggle = (item: ProfileType) => {
    hasUserEditedRef.current = true
    setSelectedIds((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    )
  }

  const isSelected = useMemo(
    () => (item: ProfileType) => selectedIds.includes(item.id),
    [selectedIds]
  )

  const handleSelectAllChange = (checked: boolean) => {
    hasUserEditedRef.current = true
    setSelectedIds(checked ? data.map((item) => item.id) : [])
  }

  return (
    <SelectChoices
      title={
        <Typography
          variant="caption"
          color="textSecondary"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <FormattedMessage id="user.types.roles.select.label" defaultMessage="Signup as: " />
          <Tooltip
            style={{ marginLeft: 5 }}
            placement="right"
            title={
              <FormattedMessage
                id="user.types.roles.tooltip"
                defaultMessage="You can change this later."
              />
            }
          >
            <Help fontSize="small" />
          </Tooltip>
        </Typography>
      }
      items={data}
      loading={!completed}
      compact={compact}
      itemSize={itemSize}
      getImageSrc={(r) => profileTypeImages[r.name]}
      getImageAlt={(r) => r.name}
      getTitle={(r) => r.label}
      getDescription={compact ? undefined : (r) => r.description}
      isSelected={isSelected}
      onToggle={handleToggle}
      includeSelectAll={includeSelectAll}
      onSelectAllChange={handleSelectAllChange}
      titleVariant={titleVariant}
      descriptionVariant={descriptionVariant}
    />
  )
}

export default UserProfileTypeCards
