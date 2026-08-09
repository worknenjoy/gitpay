import React, { useEffect } from 'react'
import { Skeleton } from '@mui/material'
import CountryPicker from '../../../../molecules/dialogs/country-picker-dialog/country-picker-dialog'
import BankAccountTabs from '../../../../molecules/tabs/bank-account-tabs/bank-account-tabs'
import EmptyBase from '../../../../molecules/content/empty/empty-base/empty-base'
import EmptyBankAccount from '../../../../molecules/content/empty/empty-bank-account/empty-bank-account'
import { FormattedMessage } from 'react-intl'
import { getCountryFlagSrc } from '../../../../../areas/private/shared/country-flag'

const PayoutSetingsBankAccount = ({
  children,
  user,
  onSaveCountry,
  verificationStatus,
  verificationTabDisabled
}) => {
  const { completed, data } = user
  const paymentProvider = process.env.PAYMENT_PROVIDER || 'stripe'
  const hasPayoutAccount =
    paymentProvider === 'whop' ? Boolean(data?.whop_account_id) : Boolean(data?.account_id)
  const [savingCountry, setSavingCountry] = React.useState(false)
  const [openCountryPicker, setOpenCountryPicker] = React.useState(false)
  const [country, setCountry] = React.useState({
    label: null,
    code: null,
    image: null
  })

  const handleCountryPicker = (item) => {
    setOpenCountryPicker(true)
  }

  const handleCountryPickerClose = (e, country) => {
    setOpenCountryPicker(false)
  }

  const handleSelectCountry = (item) => {
    setCountry({
      code: item.code,
      label: item.label,
      image: item.image
    })
  }

  const getCountryImage = (image) => getCountryFlagSrc(image)

  const saveCountryAndContinue = async (country) => {
    setSavingCountry(true)
    await onSaveCountry(country)
    setSavingCountry(false)
  }

  const onSaveCountryAndContinue = () => {
    saveCountryAndContinue(country.code)
  }

  useEffect(() => {
    setCountry({
      code: null,
      label: null,
      image: null
    })
  }, [user])

  return completed ? (
    <>
      {!hasPayoutAccount ? (
        <>
          {!country?.code ? (
            <>
              <EmptyBankAccount onActionClick={handleCountryPicker} />
              <CountryPicker
                open={openCountryPicker}
                onClose={handleCountryPickerClose}
                onSelectCountry={handleSelectCountry}
              />
            </>
          ) : (
            <EmptyBase
              actionText={
                <FormattedMessage
                  id="payout.settings.choose.country"
                  defaultMessage="Choose country and continue"
                />
              }
              text={country.label}
              onActionClick={onSaveCountryAndContinue}
              icon={<img width={48} alt={country.label} src={getCountryImage(country.image)} />}
              completed={completed && !savingCountry}
            />
          )}
        </>
      ) : (
        <BankAccountTabs
          verificationStatus={verificationStatus}
          verificationTabDisabled={verificationTabDisabled}
        >
          {children}
        </BankAccountTabs>
      )}
    </>
  ) : (
    <Skeleton variant="rectangular" width="100%" height={118} />
  )
}

export default PayoutSetingsBankAccount
