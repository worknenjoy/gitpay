import React, { useEffect, useState } from "react";
import moment from "moment";
import ReactPlaceholder from 'react-placeholder';

export const InvoiceDueDate = ({ walletOrderId, fetchWalletOrder }) => {
  const [ invoiceDueDate, setInvoiceDueDate ] = useState(0);

  useEffect(() => {
    const getFetchWalletOrder = async () => {
      const fetchedOrder = await fetchWalletOrder(walletOrderId);
      setInvoiceDueDate(fetchedOrder?.walletOrder?.invoice?.due_date || 0);
    };
    
    getFetchWalletOrder()
  }, [walletOrderId])

  return (
    <div>
      <ReactPlaceholder type="text" ready={!!invoiceDueDate} rows={1} color="#E0E0E0">
        {moment.unix(invoiceDueDate).fromNow()}
      </ReactPlaceholder>
    </div>
  );
}

export default InvoiceDueDate;