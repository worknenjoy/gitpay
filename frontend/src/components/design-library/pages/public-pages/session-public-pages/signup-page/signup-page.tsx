import SpotCard from 'design-library/molecules/cards/spot-card/spot-card'
import LoginFormSignup from 'design-library/molecules/form-section/login-form/login-form-signup/login-form-signup'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'

const normalizeTypeValue = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')

const singularizeTypeValue = (value = '') => normalizeTypeValue(value).replace(/s$/, '')

const formatTypeLabel = (value = '') =>
  value
    .toString()
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

const getThemeVariant = (type = '') => {
  const normalizedType = normalizeTypeValue(type)

  if (normalizedType.includes('maintainer')) return 'primary'
  if (normalizedType.includes('sponsor')) return 'secondary'
  if (normalizedType.includes('contributor')) return 'success'
  if (normalizedType.includes('manager')) return 'warning'
  return 'info'
}

const resolveRoleByType = (rawType, rolesData = []) => {
  const normalizedType = normalizeTypeValue(rawType)
  const singularType = singularizeTypeValue(rawType)

  if (!normalizedType || !Array.isArray(rolesData) || rolesData.length === 0) {
    return null
  }

  return (
    rolesData.find((role) => {
      const candidates = [role?.name, role?.label, role?.id].filter(Boolean)
      return candidates.some((candidate) => {
        const normalizedCandidate = normalizeTypeValue(candidate)
        const singularCandidate = singularizeTypeValue(candidate)

        return (
          normalizedCandidate === normalizedType ||
          singularCandidate === singularType ||
          normalizedCandidate.includes(normalizedType) ||
          normalizedType.includes(normalizedCandidate) ||
          singularCandidate.includes(singularType) ||
          singularType.includes(singularCandidate)
        )
      })
    }) || null
  )
}

const SignupPage = ({ handleSignup, roles, fetchRoles }) => {
  const history = useHistory()
  const { type, status } = useParams<{ type?: string; status?: string }>()
  const routeType = type || status
  const resolvedRole = resolveRoleByType(routeType, roles?.data)
  const selectedTypeLabel = resolvedRole?.label || resolvedRole?.name || formatTypeLabel(routeType)
  const isTypedSignup = !!resolvedRole

  return (
    <SpotCard
      title={<FormattedMessage id="signup.welcome" defaultMessage="Welcome!" />}
      description={
        isTypedSignup ? (
          <FormattedMessage
            id="signup.asType"
            defaultMessage="Signup as a {type}"
            values={{ type: selectedTypeLabel }}
          />
        ) : (
          <FormattedMessage id="signup.description" defaultMessage="Create your account" />
        )
      }
      themeVariant={isTypedSignup ? getThemeVariant(resolvedRole?.name || routeType) : 'default'}
    >
      <LoginFormSignup
        onSignin={() => history.push('/signin')}
        onSubmit={handleSignup}
        roles={roles}
        fetchRoles={fetchRoles}
        noCancelButton
        hideRoleSelection={isTypedSignup}
        presetRoleId={resolvedRole?.id}
      />
    </SpotCard>
  )
}

export default SignupPage
