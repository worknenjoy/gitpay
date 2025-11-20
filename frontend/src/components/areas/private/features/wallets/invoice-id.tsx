import React, { useEffect, useState } from 'react'
import { Skeleton } from '@mui/material'

export const InvoiceId = ({ walletOrderId, fetchWalletOrder }) => {
  const [invoiceNumber, setInvoiceNumber] = useState(0)

  useEffect(() => {
    const getFetchWalletOrder = async () => {
      const fetchedOrder = await fetchWalletOrder(walletOrderId)
      setInvoiceNumber(fetchedOrder?.walletOrder?.invoice?.number || 0)
    }

    getFetchWalletOrder()
  }, [walletOrderId, fetchWalletOrder])

  return (
    <div>
      {!invoiceNumber ? <Skeleton variant="text" animation="wave" width={120} /> : invoiceNumber}
    </div>
  )
}

export default InvoiceId
