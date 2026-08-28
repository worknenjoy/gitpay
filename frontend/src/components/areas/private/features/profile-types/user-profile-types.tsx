import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { Box, Button } from '@mui/material'

import SelectChoices from 'design-library/molecules/select-choices/select-choices'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import { profileTypeImages } from 'design-library/atoms/inputs/fields/user-profile-type-field/profile-type-images'

const messages = defineMessages({
  saveSuccess: {
    id: 'user.role.update.success',
    defaultMessage: 'Profile updated successfully'
  },
  saveError: {
    id: 'user.role.update.error',
    defaultMessage: 'We couldnt update your information properly'
  }
})

const ProfileTypes = ({
  profileTypes,
  user,
  fetchProfileTypes,
  updateUser,
  onClose,
  addNotification
}) => {
  const { data, completed } = profileTypes
  const intl = useIntl()
  const hasUserEditedRef = useRef(false)
  const [saving, setSaving] = useState(false)

  const normalizeIdsKey = (items) => {
    if (!Array.isArray(items)) return ''
    return items
      .map((i) => i?.id)
      .filter((id) => id !== null && id !== undefined)
      .sort((a, b) => Number(a) - Number(b))
      .join(',')
  }

  const serverProfileTypes = user?.Types || []
  const serverProfileTypesKey = useMemo(
    () => normalizeIdsKey(serverProfileTypes),
    [serverProfileTypes]
  )

  const [savedSnapshotKey, setSavedSnapshotKey] = useState(serverProfileTypesKey)
  const [selectedProfileTypes, setSelectedProfileTypes] = useState(serverProfileTypes)

  useEffect(() => {
    fetchProfileTypes().catch(console.log)
  }, [])

  useEffect(() => {
    if (hasUserEditedRef.current) return
    setSelectedProfileTypes(serverProfileTypes)
    setSavedSnapshotKey(serverProfileTypesKey)
  }, [serverProfileTypesKey])

  const handleProfileTypeToggle = useCallback((item) => {
    hasUserEditedRef.current = true
    setSelectedProfileTypes((prev) => {
      const exists = prev.find((i) => i.id === item.id)
      if (exists) {
        return prev.filter((i) => i.id !== item.id)
      } else {
        return [...prev, item]
      }
    })
  }, [])

  const shouldBeChecked = useCallback(
    (item) => {
      return selectedProfileTypes.some((s) => s.id === item.id)
    },
    [selectedProfileTypes]
  )

  const isDirty = useMemo(() => {
    return normalizeIdsKey(selectedProfileTypes) !== savedSnapshotKey
  }, [savedSnapshotKey, selectedProfileTypes])

  const handleSaveClick = async (e) => {
    e.preventDefault()
    if (!isDirty || saving) return

    setSaving(true)
    try {
      await updateUser({ Types: selectedProfileTypes })
      addNotification(intl.formatMessage(messages.saveSuccess))
      setSavedSnapshotKey(normalizeIdsKey(selectedProfileTypes))
      hasUserEditedRef.current = false
      onClose && onClose()
    } catch (e) {
      console.log(e)
      addNotification(intl.formatMessage(messages.saveError))
    } finally {
      setSaving(false)
    }
  }

  return (
    <SelectChoices
      title={
        <MainTitle
          title={
            <FormattedMessage id="user.type.title" defaultMessage="What type of user are you?" />
          }
          subtitle={
            <FormattedMessage
              id="user.type.description"
              defaultMessage="Define how you will use Gitpay. You can choose multiple types of user profiles you want."
            />
          }
        />
      }
      items={data}
      loading={!completed}
      getImageSrc={(r) => profileTypeImages[r.name]}
      getImageAlt={(r) => r.name}
      getTitle={(r) => r.label}
      getDescription={(r) => r.description}
      isSelected={shouldBeChecked}
      onToggle={handleProfileTypeToggle}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveClick}
          disabled={!isDirty || saving}
        >
          {saving ? (
            'Saving…'
          ) : (
            <FormattedMessage id="user.roles.actions.save" defaultMessage="Save" />
          )}
        </Button>
      </Box>
    </SelectChoices>
  )
}

ProfileTypes.propTypes = {
  updateUser: PropTypes.func,
  fetchProfileTypes: PropTypes.func,
  profileTypes: PropTypes.object,
  user: PropTypes.object,
  onClose: PropTypes.func,
  addNotification: PropTypes.func.isRequired
}

export default ProfileTypes
