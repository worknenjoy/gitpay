import React, { useEffect } from 'react'
import InvoiceSettings from 'design-library/pages/private-pages/settings-pages/invoice-settings/invoice-settings'

const InvoiceSettingsPage = ({ customer, fetchCustomer, createCustomer, updateCustomer, user }) => {
  const { data } = user
  const [customerData, setCustomerData] = React.useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!e.target) return false
    let formData = {
      name: e.target['name'].value,
      email: data.email,
      address: {
        city: e.target['address[city]'].value,
        country: e.target['address[country]'].value,
        line1: e.target['address[line1]'].value,
        line2: e.target['address[line2]'].value,
        postal_code: e.target['address[postal_code]'].value,
        state: e.target['address[state]'].value
      },
      metadata: {
        user_id: data.id
        //customer_type: e.target['customer_type'].value
      }
    }
    setCustomerData(formData)
    if (!data.customer_id) {
      await createCustomer(formData)
    } else {
      await updateCustomer(formData)
    }
  }

  const onChange = (e) => {
    e.preventDefault()
    if (!e.target) return false
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value || e.target.options?.[e.target.selectedIndex]?.value
    })
  }

  useEffect(() => {
    fetchCustomer()
  }, [])

  return (
    <InvoiceSettings
      customer={customer}
      customerData={customerData}
      user={user}
      handleSubmit={handleSubmit}
      onChange={onChange}
    />
  )
}
export default InvoiceSettingsPage
