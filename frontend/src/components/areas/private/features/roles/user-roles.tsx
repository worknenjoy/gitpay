import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import funder from 'images/bounty.png'
import contributor from 'images/sharing.png'
import maintainer from 'images/notifications.png'

import SelectChoices from 'design-library/molecules/select-choices/select-choices'
import { ButtonsRow, CancelButton, SaveButton } from './user-roles.styles'

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
  maintainer: maintainer
}

const Roles = ({ roles, user, fetchRoles, updateUser, onClose, addNotification }) => {
  const { data, completed } = roles
  const intl = useIntl()
  const [selectedRoles, setSelectedRoles] = useState([])

  useEffect(() => {
    fetchRoles().catch(console.log)
  }, [])

  useEffect(() => {
    setSelectedRoles(user.Types || [])
  }, [user.Types])

  const handleRoleToggle = useCallback((item) => {
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
      return selectedRoles.some((s) => s.name === item.name)
    },
    [selectedRoles]
  )

  const handleCancelClick = useCallback(() => {
    onClose && onClose()
  }, [onClose])

  const handleSaveClick = async (e) => {
    e.preventDefault()
    try {
      await updateUser({ Types: selectedRoles })
      addNotification(intl.formatMessage(messages.saveSuccess))
      onClose && onClose()
    } catch (e) {
      console.log(e)
      addNotification(intl.formatMessage(messages.saveError))
    }
  }

  return (
    <SelectChoices
      title={<FormattedMessage id="user.type.title" defaultMessage="What type of user are you?" />}
      description={
        <FormattedMessage
          id="user.type.description"
          defaultMessage="Define how you will use Gitpay. You can choose multiple types of user roles you want."
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
      <ButtonsRow>
        <CancelButton onClick={handleCancelClick}>CANCEL</CancelButton>
        <SaveButton color="secondary" onClick={handleSaveClick}>
          SAVE
        </SaveButton>
      </ButtonsRow>
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
