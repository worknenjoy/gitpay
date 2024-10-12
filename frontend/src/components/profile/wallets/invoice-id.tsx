import React, { useEffect, useState } from 'react';
import ReactPlaceholder from 'react-placeholder';

export const InvoiceId = ({ walletOrderId, fetchWalletOrder }) => {
  const [invoiceNumber, setInvoiceNumber] = useState(0);

  useEffect(() => {
    const getFetchWalletOrder = async () => {
      const fetchedOrder = await fetchWalletOrder(walletOrderId);
      setInvoiceNumber(fetchedOrder?.walletOrder?.invoice?.number || 0);
    };
    
    getFetchWalletOrder();
  }, [walletOrderId, fetchWalletOrder]);

  return (
    <div>
      <ReactPlaceholder type='text' ready={!!invoiceNumber} rows={1} color='#E0E0E0'>
        {invoiceNumber}
      </ReactPlaceholder>
    </div>
  );
};

export default InvoiceId;
