import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import funder from 'images/bounty.png'
import contributor from 'images/sharing.png'
import maintainer from 'images/notifications.png'

import { Paper, Typography, Checkbox, CardMedia, Skeleton } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import {
  RolesContainer,
  BigRow,
  RowGrid,
  RowListItem,
  RowCard,
  RootLabel,
  ActionBar,
  ButtonsRow,
  CancelButton,
  SaveButton
} from './user-roles.styles'

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

  const handleRoleClick = useCallback((event, item) => {
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

  const placeholders = Array(3).fill(null)

  const CardListPlaceholder = (
    <>
      {placeholders.map((_, index: number) => (
        <RowListItem key={index} size={{ xs: 12, md: 3 }} spacing={2}>
          <Paper>
            <RowCard variant="outlined">
              <CardMedia>
                <Skeleton variant="rectangular" height={270} />
              </CardMedia>
              <RootLabel>
                <Typography variant="h5">
                  <Skeleton variant="text" />
                </Typography>
              </RootLabel>
              <ActionBar>
                <Typography variant="body2" color="textSecondary" component="p">
                  <Skeleton variant="text" />
                </Typography>
              </ActionBar>
            </RowCard>
          </Paper>
        </RowListItem>
      ))}
    </>
  )

  return (
    <RolesContainer elevation={2}>
      <BigRow>
        <Typography variant="h4" noWrap>
          <FormattedMessage id="user.type.title" defaultMessage="What type of user are you?" />
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" noWrap>
          <FormattedMessage
            id="user.type.description"
            defaultMessage="Define how you will use Gitpay. You can choose multiple types of user roles you want."
          />
        </Typography>
      </BigRow>
      <RowGrid container direction="row" alignItems="stretch">
        {!completed ? (
          CardListPlaceholder
        ) : (
          <>
            {data.map((r) => (
              <RowListItem key={r.id} size={{ xs: 12, md: 3 }} spacing={2}>
                <Paper>
                  <RowCard variant="outlined">
                    <CardMedia>
                      <img src={imageMap[r.name]} alt={r.name} width={250} height={270} />
                    </CardMedia>
                    <RootLabel>
                      <Typography variant="h5">{r.label}</Typography>
                    </RootLabel>
                    <ActionBar>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {r.description}
                      </Typography>
                      <Checkbox
                        icon={
                          <CheckBoxOutlineBlankIcon
                            fontSize="large"
                            style={{ color: 'transparent' }}
                          />
                        }
                        checkedIcon={<CheckBoxIcon fontSize="large" />}
                        color="primary"
                        inputProps={{ 'aria-label': r.name }}
                        checked={shouldBeChecked(r)}
                        onChange={(e) => handleRoleClick(e, r)}
                      />
                    </ActionBar>
                  </RowCard>
                </Paper>
              </RowListItem>
            ))}
          </>
        )}
      </RowGrid>
      <ButtonsRow>
        <CancelButton onClick={handleCancelClick}>CANCEL</CancelButton>
        <SaveButton onClick={handleSaveClick}>SAVE</SaveButton>
      </ButtonsRow>
    </RolesContainer>
  )
}

Roles.propTypes = {
  updateUser: PropTypes.func,
  createRoles: PropTypes.func,
  deleteRoles: PropTypes.func,
  fetchRoles: PropTypes.func,
  roles: PropTypes.object,
  user: PropTypes.object,
  onClose: PropTypes.func,
  addNotification: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
}

export default Roles
