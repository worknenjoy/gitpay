import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { Box, Button } from '@mui/material'
import funder from 'images/roles/bounty.png'
import contributor from 'images/roles/sharing.png'
import maintainer from 'images/roles/notifications.png'
import serviceProvider from 'images/roles/payment-cycle.png'

import SelectChoices from 'design-library/molecules/select-choices/select-choices'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'

const messages = defineMessages({
  saveSuccess: {
    id: 'user.role.update.success',
    defaultMessage: 'Role updated successfully'
  },
  saveError: {
    id: 'user.role.update.error',
    defaultMessage: 'We couldnt update your information properly'
  }
})

const imageMap = {
  funding: funder,
  contributor: contributor,
  maintainer: maintainer,
  'service_provider': serviceProvider
}

const Roles = ({ roles, user, fetchRoles, updateUser, onClose, addNotification }) => {
  const { data, completed } = roles
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

  const serverRoles = user?.Types || []
  const serverRolesKey = useMemo(() => normalizeIdsKey(serverRoles), [serverRoles])

  const [savedSnapshotKey, setSavedSnapshotKey] = useState(serverRolesKey)
  const [selectedRoles, setSelectedRoles] = useState(serverRoles)

  useEffect(() => {
    fetchRoles().catch(console.log)
  }, [])

  useEffect(() => {
    if (hasUserEditedRef.current) return
    setSelectedRoles(serverRoles)
    setSavedSnapshotKey(serverRolesKey)
  }, [serverRolesKey])

  const handleRoleToggle = useCallback((item) => {
    hasUserEditedRef.current = true
    setSelectedRoles((prev) => {
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
      return selectedRoles.some((s) => s.id === item.id)
    },
    [selectedRoles]
  )

  const isDirty = useMemo(() => {
    return normalizeIdsKey(selectedRoles) !== savedSnapshotKey
  }, [savedSnapshotKey, selectedRoles])

  const handleSaveClick = async (e) => {
    e.preventDefault()
    if (!isDirty || saving) return

    setSaving(true)
    try {
      await updateUser({ Types: selectedRoles })
      addNotification(intl.formatMessage(messages.saveSuccess))
      setSavedSnapshotKey(normalizeIdsKey(selectedRoles))
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
              defaultMessage="Define how you will use Gitpay. You can choose multiple types of user roles you want."
            />
          }
        />
      }
      items={data}
      loading={!completed}
      getImageSrc={(r) => imageMap[r.name]}
      getImageAlt={(r) => r.name}
      getTitle={(r) => r.label}
      getDescription={(r) => r.description}
      isSelected={shouldBeChecked}
      onToggle={handleRoleToggle}
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

Roles.propTypes = {
  updateUser: PropTypes.func,
  fetchRoles: PropTypes.func,
  roles: PropTypes.object,
  user: PropTypes.object,
  onClose: PropTypes.func,
  addNotification: PropTypes.func.isRequired
}

export default Roles
