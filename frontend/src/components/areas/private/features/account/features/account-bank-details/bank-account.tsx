import React, { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import Grid from '@mui/material/Grid'
import {
  Typography,
  Card,
  CardContent,
  Chip,
  CardActions,
  Button,
  FormControl,
  Input,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Avatar,
  Skeleton
} from '@mui/material'
import { Public as PublicIcon, Person as PersonIcon } from '@mui/icons-material'
import Alert from 'design-library/atoms/alerts/alert/alert'
import CountryPicker from '../../../../shared/country-picker'
import Const from '../../../../../../../consts'

import { countryCodes, countryCurrencies } from '../../../../shared/country-codes'

const cardSx = { width: '100%', mb: 2, p: 1 } as const
const cardEmptySx = { textAlign: 'center', mb: 5 } as const
const cardEmptyActionsSx = { display: 'flex', justifyContent: 'center', pt: 2, pb: 5 } as const
const cardEmptyActionsAltSx = { display: 'flex', justifyContent: 'center', pb: 2 } as const
const titleSx = { mb: 2, fontSize: 18, fontWeight: 'bold' } as const
const chipSx = { m: 1 } as const
const formControlSx = { m: 1, minWidth: 120 } as const

const BankAccount = ({
  account,
  bankAccount,
  createAccount,
  createBankAccount,
  updateBankAccount,
  getBankAccount,
  user
}) => {
  const intl = useIntl()

  const [ibanMode, setIbanMode] = React.useState(false)
  const [userId, setUserId] = React.useState('')
  const [bankAccountType, setBankAccountType] = React.useState('individual')
  const [bankAccountHolderName, setBankAccountHolderName] = React.useState('')
  const [selectedBank, setSelectedBank] = React.useState('')
  const [currentCountry, setCurrentCountry] = React.useState('')
  const [currentCurrency, setCurrentCurrency] = React.useState('')
  const [editBankAccount, setEditBankAccount] = React.useState(false)
  const [bankNumberError, setBankNumberError] = React.useState(false)
  const [AccountNumberError, setAccountNumberError] = React.useState(false)
  const [countryLabel, setCountryLabel] = React.useState('')
  const [countryCode, setCountryCode] = React.useState('')
  const [countryImage, setCountryImage] = React.useState('')
  const [countryPickerModal, setCountryPickerModal] = React.useState(false)
  const [canCreateAccount, setCanCreateAccount] = React.useState(false)

  const handleEditAccount = () => {
    setEditBankAccount(true)
  }

  const handleBankNumberSelect = (e) => {
    setSelectedBank(e.target.value)
    setBankNumberError(false)
  }

  const onChangeHolderName = (e) => {
    e.preventDefault()
    setBankAccountHolderName(e.target.value)
  }

  const handleIbanModeChange = (e) => {
    e.preventDefault()
    setIbanMode(e.target.checked)
  }

  const onChangeCountry = (e) => {
    e.preventDefault()
    setCurrentCountry(e.target.value)
  }

  const onChangeCurrency = (e) => {
    e.preventDefault()
    setCurrentCurrency(e.target.value)
  }

  const handleCountry = () => {
    setCountryPickerModal(true)
  }

  const handleCreateAccount = () => {
    createAccount(countryCode)
  }

  const handleCountryClose = (e, item) => {
    e.preventDefault()

    setCountryPickerModal(false)
    setCountryCode(item.code)
    setCountryLabel(item.country)
    setCountryImage(item.image)
    setCanCreateAccount(!!item.code)
  }

  const handleBankAccount = (e) => {
    e.preventDefault()
    const userCountry = currentCountry
    if (userCountry === 'BR' && !editBankAccount) {
      const bankNumber = e.target['bank_number'].value
      if (bankNumber) {
        const routingNumber = `${bankNumber}-${e.target.routing_number.value}`
        if (e.target.account_number.value.indexOf('-') > -1) {
          setAccountNumberError(true)
        } else {
          setAccountNumberError(false)
          const accountNumber = e.target.account_number.value.replace('-', '')
          if (editBankAccount) {
            updateBankAccount({
              account_holder_type: bankAccountType,
              account_holder_name: bankAccountHolderName
            })
          } else {
            createBankAccount(
              userId,
              ibanMode
                ? {
                    account_number: accountNumber,
                    country: userCountry
                  }
                : {
                    routing_number: routingNumber,
                    account_number: accountNumber,
                    country: userCountry
                  }
            )
          }
        }
      } else {
        setBankNumberError(true)
      }
    } else {
      let accountInfo = {}
      if (userCountry === 'DK' || userCountry === 'BE' || ibanMode) {
        accountInfo = {
          account_number: e.target.account_number.value,
          country: userCountry
        }
      } else {
        accountInfo = {
          routing_number: e.target.routing_number.value,
          account_number: e.target.account_number.value,
          account_holder_type: bankAccountType,
          country: userCountry,
          currency: currentCurrency,
          account_holder_name: bankAccountHolderName
        }
      }
      if (editBankAccount) {
        updateBankAccount({
          account_holder_type: bankAccountType,
          account_holder_name: bankAccountHolderName
        })
      } else {
        createBankAccount(userId, accountInfo)
      }
      setEditBankAccount(false)
    }
  }

  useEffect(() => {
    if (user) {
      setUserId(user.id)
      getBankAccount()
    }
  }, [user])

  useEffect(() => {
    if (bankAccount.data.account_holder_type) {
      setBankAccountType(bankAccount.data.account_holder_type)
    }
    if (bankAccount.data.account_holder_name) {
      setBankAccountHolderName(bankAccount.data.account_holder_name)
    }
    if (currentCountry === '') {
      setCurrentCountry(bankAccount.data.country || account.data.country)
    }

    if (currentCurrency === '') {
      setCurrentCurrency(bankAccount.data.currency || account.data.currency)
    }
  }, [bankAccount])

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 12 }}>
        {!bankAccount.completed ? (
          <div>
            <Skeleton variant="rectangular" height={200} animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
          </div>
        ) : (
          <div>
            {editBankAccount && (
              <Alert severity="info" variant="outlined">
                <Typography color="primary">
                  <FormattedMessage
                    id="account.active.info"
                    defaultMessage="You can edit only some information of your bank account"
                  />
                </Typography>
              </Alert>
            )}
            {account.data.id ? (
              <div>
                <form
                  onSubmit={handleBankAccount}
                  style={{ marginTop: 20, marginBottom: 20, width: '100%' }}
                >
                  <Card sx={cardSx} elevation={0}>
                    <CardContent>
                      <Typography variant="h6">
                        <FormattedMessage
                          id="account.register.bank.title"
                          defaultMessage="Activate bank account:"
                        />
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                          {bankAccount.data.routing_number ? (
                            <div style={{ marginBottom: 8, marginTop: 8 }}>
                              <Alert
                                severity="success"
                                variant="outlined"
                                action={
                                  !editBankAccount ? (
                                    <Button
                                      size="small"
                                      onClick={handleEditAccount}
                                      variant="contained"
                                      color="secondary"
                                    >
                                      <FormattedMessage
                                        id="bank.alert.button.edit"
                                        defaultMessage="Edit bank account"
                                      />
                                    </Button>
                                  ) : (
                                    <Button
                                      size="small"
                                      onClick={() => setEditBankAccount(false)}
                                      variant="contained"
                                      color="secondary"
                                    >
                                      <FormattedMessage
                                        id="bank.alert.button.cancel"
                                        defaultMessage="Cancel edit bank account"
                                      />
                                    </Button>
                                  )
                                }
                              >
                                <Typography color="primary">
                                  <FormattedMessage
                                    id="account.active.statement"
                                    defaultMessage="Your bank account is active"
                                  />
                                </Typography>
                              </Alert>
                            </div>
                          ) : (
                            <FormControl sx={formControlSx} error={bankNumberError}>
                              {user.country === 'BR' && (
                                <Select
                                  value={selectedBank}
                                  displayEmpty
                                  name="bank_number"
                                  onChange={handleBankNumberSelect}
                                >
                                  <MenuItem value="" disabled>
                                    <em>
                                      <FormattedMessage
                                        id="account.banks.list.title"
                                        defaultMessage="Select your bank"
                                      />
                                    </em>
                                  </MenuItem>
                                  {Object.keys(Const.BANK_NUMBERS).map((item, i) => {
                                    return (
                                      <MenuItem key={i} value={item}>
                                        {`${Const.BANK_NUMBERS[item]}`}
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                              )}
                              {bankNumberError && (
                                <FormHelperText>
                                  {' '}
                                  <FormattedMessage
                                    id="account.bank.select"
                                    defaultMessage="Please select your bank"
                                  />
                                </FormHelperText>
                              )}
                            </FormControl>
                          )}
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 3 }}>
                          <FormControl>
                            <div>
                              <Typography variant="caption" gutterBottom>
                                <FormattedMessage
                                  id="account.register.bank.account.country"
                                  defaultMessage="Country:"
                                />
                              </Typography>
                            </div>
                            <Select
                              native
                              name="country"
                              value={currentCountry}
                              input={<Input id="bank-country" />}
                              fullWidth
                              style={{ marginTop: 12, marginBottom: 12 }}
                              onChange={onChangeCountry}
                              disabled={!!bankAccount.data.routing_number}
                            >
                              <option value="">Select bank country</option>
                              {countryCodes.map((c, index) => (
                                <option
                                  key={index}
                                  value={c.code}
                                  selected={user.country === c.code}
                                >
                                  {c.country}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 9 }}>
                          <FormControl>
                            <div>
                              <Typography variant="caption" gutterBottom>
                                <FormattedMessage
                                  id="account.register.bank.account.currency"
                                  defaultMessage="Currency:"
                                />
                              </Typography>
                            </div>
                            <Select
                              native
                              name="currency"
                              value={currentCurrency}
                              input={<Input id="bank-currency" />}
                              fullWidth
                              style={{ marginTop: 12, marginBottom: 12 }}
                              onChange={onChangeCurrency}
                              disabled={!!bankAccount.data.routing_number}
                            >
                              <option value="">Select currency</option>
                              {countryCurrencies.map((c, index) => (
                                <option
                                  key={index}
                                  value={c.code}
                                  selected={c.countries.includes(currentCountry)}
                                >{`${c.currency} - ${c.symbol}`}</option>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                          <FormControl component="fieldset">
                            <Typography variant="caption" gutterBottom>
                              <FormattedMessage
                                id="account.register.type"
                                defaultMessage="Account Type:"
                              />
                            </Typography>
                            <RadioGroup
                              aria-label="bankAccountType"
                              name="bankAccountType"
                              value={bankAccountType}
                              onChange={(e) => setBankAccountType(e.target.value)}
                              row
                            >
                              <FormControlLabel
                                value="individual"
                                control={<Radio color="primary" />}
                                label={
                                  <FormattedMessage
                                    id="account.type.individual"
                                    defaultMessage="Individual"
                                  />
                                }
                                disabled={!!bankAccount.data.routing_number && !editBankAccount}
                              />
                              <FormControlLabel
                                value="company"
                                control={<Radio color="primary" />}
                                label={
                                  <FormattedMessage
                                    id="account.type.company"
                                    defaultMessage="Company"
                                  />
                                }
                                disabled={!!bankAccount.data.routing_number && !editBankAccount}
                              />
                            </RadioGroup>
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel htmlFor="adornment-password">
                              <FormattedMessage
                                id="account.register.bank.accountHolderName"
                                defaultMessage="Account holder name / company name"
                              />
                            </InputLabel>
                            <Input
                              name="account_holder_name"
                              id="account_holder_name"
                              disabled={!!bankAccount.data.routing_number && !editBankAccount}
                              value={bankAccountHolderName}
                              onChange={onChangeHolderName}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        {ibanMode ? (
                          <Grid size={{ xs: 12 }}>
                            <FormControl error={AccountNumberError}>
                              <Typography variant="caption" gutterBottom style={{ width: '100%' }}>
                                <FormattedMessage id="account.details.iban" defaultMessage="IBAN" />
                              </Typography>
                              <Input
                                id="bank-account-number"
                                name="account_number"
                                placeholder={intl.formatMessage({
                                  id: 'account.details.iban',
                                  defaultMessage: 'IBAN'
                                })}
                                disabled={!!bankAccount.data.routing_number}
                                defaultValue={
                                  bankAccount.data.last4 ? `*****${bankAccount.data.last4}` : ''
                                }
                              />
                              {AccountNumberError && (
                                <FormHelperText>
                                  {' '}
                                  <FormattedMessage
                                    id="account.details.numbersOnly"
                                    defaultMessage="Just numbers only"
                                  />
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        ) : (
                          <Grid size={{ xs: 12 }}>
                            {(user.country !== 'DK' || user.country !== 'BE') && (
                              <>
                                <FormControl>
                                  <Typography
                                    variant="caption"
                                    gutterBottom
                                    style={{ width: '100%' }}
                                  >
                                    <FormattedMessage
                                      id="account.register.bank.routing"
                                      defaultMessage="Routing number"
                                    />
                                  </Typography>
                                  <Input
                                    id="bank-routing-number"
                                    name="routing_number"
                                    placeholder={intl.formatMessage({
                                      id: 'account.details.rountingNumber',
                                      defaultMessage: 'Routing number'
                                    })}
                                    style={{ marginRight: 20 }}
                                    disabled={!!bankAccount.data.routing_number}
                                    defaultValue={bankAccount.data.routing_number}
                                  />
                                </FormControl>
                              </>
                            )}
                            <FormControl error={AccountNumberError}>
                              <Typography variant="caption" gutterBottom style={{ width: '100%' }}>
                                <FormattedMessage
                                  id="account.register.bank.accountNumber"
                                  defaultMessage="Account number"
                                />
                              </Typography>
                              <Input
                                id="bank-account-number"
                                name="account_number"
                                placeholder={intl.formatMessage({
                                  id: 'account.details.accountNumber',
                                  defaultMessage: 'Account number'
                                })}
                                disabled={!!bankAccount.data.routing_number}
                                defaultValue={
                                  bankAccount.data.last4 ? `*****${bankAccount.data.last4}` : ''
                                }
                              />

                              {AccountNumberError && (
                                <FormHelperText>
                                  {' '}
                                  <FormattedMessage
                                    id="account.details.numbersOnly"
                                    defaultMessage="Just numbers only"
                                  />
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        )}
                        <Grid size={{ xs: 12 }}>
                          {user.country !== 'BR' && !bankAccount.data.routing_number && (
                            <FormControl>
                              <FormattedMessage
                                id="account.details.bank.mode.iban"
                                defaultMessage="I want to provide my IBAN number instead"
                              >
                                {(msg) => (
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        name="iban"
                                        checked={ibanMode}
                                        onChange={handleIbanModeChange}
                                        value="iban"
                                        color="primary"
                                      />
                                    }
                                    label={msg}
                                  />
                                )}
                              </FormattedMessage>
                            </FormControl>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions style={{ justifyContent: 'flex-end' }}>
                      <Button
                        style={{ color: 'white' }}
                        size="large"
                        variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={!editBankAccount && bankAccount.data.routing_number}
                      >
                        {editBankAccount ? (
                          <FormattedMessage
                            id="account.details.update.action"
                            defaultMessage="Update bank account"
                          />
                        ) : (
                          <FormattedMessage
                            id="account.details.activate.action"
                            defaultMessage="Activate bank account"
                          />
                        )}
                      </Button>
                    </CardActions>
                  </Card>
                </form>
              </div>
            ) : (
              <div>
                {!account.data.id && (
                  <Card sx={cardEmptySx} elevation={0}>
                    <CardContent>
                      <Typography sx={titleSx} color="textSecondary">
                        <FormattedMessage
                          id="account.register.headline"
                          defaultMessage="There is no account registered to receive the payments"
                        />
                      </Typography>
                      {countryCode && (
                        <div>
                          <Typography component="p" color="textSecondary">
                            <FormattedMessage
                              id="account.register.country.label"
                              defaultMessage="The country you chose to create your account"
                            />
                          </Typography>
                          <Chip
                            avatar={
                              <Avatar>
                                <img
                                  width={72}
                                  src={require(`images/countries/${countryImage}.png`).default}
                                />
                              </Avatar>
                            }
                            label={countryLabel}
                            sx={chipSx}
                          />
                        </div>
                      )}
                    </CardContent>
                    <CardActions sx={cardEmptyActionsAltSx}>
                      <Button
                        style={{ color: 'white' }}
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={handleCountry}
                      >
                        <FormattedMessage
                          id="account.register.create.country"
                          defaultMessage="Choose your country to start"
                        />
                        <PublicIcon style={{ marginLeft: 10 }} />
                      </Button>
                    </CardActions>
                    <CardActions sx={cardEmptyActionsSx}>
                      <Button
                        style={{ color: 'white' }}
                        size="large"
                        variant="contained"
                        color="primary"
                        disabled={!canCreateAccount}
                        onClick={handleCreateAccount}
                      >
                        <FormattedMessage
                          id="account.register.create.action"
                          defaultMessage="Create account"
                        />
                        <PersonIcon style={{ marginLeft: 10 }} />
                      </Button>
                    </CardActions>
                  </Card>
                )}
                <CountryPicker open={countryPickerModal} onClose={handleCountryClose} />
              </div>
            )}
          </div>
        )}
      </Grid>
    </Grid>
  )
}

export default BankAccount
