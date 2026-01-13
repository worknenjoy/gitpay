import React, { useEffect } from 'react'
import { Skeleton } from '@mui/material'
import CountryPicker from '../../../../molecules/dialogs/country-picker-dialog/country-picker-dialog'
import BankAccountTabs from '../../../../molecules/tabs/bank-account-tabs/bank-account-tabs'
import EmptyBase from '../../../../molecules/content/empty/empty-base/empty-base'
import EmptyBankAccount from '../../../../molecules/content/empty/empty-bank-account/empty-bank-account'
import { FormattedMessage } from 'react-intl'

const PayoutSetingsBankAccount = ({ children, user, onSaveCountry }) => {
  const { completed, data } = user
  const [ savingCountry, setSavingCountry ] = React.useState(false)
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

  const getCountryImage = (image) => {
    const imageModule = require(`images/countries/${image}.png`)
    const countryImageSrc = imageModule.default || imageModule
    return countryImageSrc
  }

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
      {!data?.account_id ? (
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
        <BankAccountTabs>{children}</BankAccountTabs>
      )}
    </>
  ) : (
    <Skeleton variant="rectangular" width="100%" height={118} />
  )
}

export default PayoutSetingsBankAccount
