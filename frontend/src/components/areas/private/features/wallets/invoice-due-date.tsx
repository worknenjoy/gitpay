import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Skeleton } from '@mui/material'

export const InvoiceDueDate = ({ walletOrderId, fetchWalletOrder }) => {
  const [invoiceDueDate, setInvoiceDueDate] = useState(0)

  useEffect(() => {
    const getFetchWalletOrder = async () => {
      const fetchedOrder = await fetchWalletOrder(walletOrderId)
      setInvoiceDueDate(fetchedOrder?.walletOrder?.invoice?.due_date || 0)
    }

    getFetchWalletOrder()
  }, [walletOrderId])

  return (
    <div>
      {!invoiceDueDate ? (
        <Skeleton variant="text" animation="wave" width={120} />
      ) : (
        moment.unix(invoiceDueDate).fromNow()
      )}
    </div>
  )
}

export default InvoiceDueDate
