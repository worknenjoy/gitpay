import SectionTable from 'design-library/molecules/tables/section-table/section-table';
import { method } from 'lodash';
import React from 'react';

const PayoutsTable = ({ payouts }) => {

  const tableHeaderMetadata = {
    status: { sortable: true, numeric: false, dataBaseKey: 'status', label: 'Status' },
    method: { sortable: true, numeric: false, dataBaseKey: 'transfer_method', label: 'Transfer Method' },
    amount: { sortable: true, numeric: true, dataBaseKey: 'amount', label: 'Amount' },
    createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: 'Created At' }
  }

  const customColumnRenderer = {
    status: (item: any) => (
      <span>{item.status}</span>
    ),
    method: (item: any) => (
      <span>{item.transfer_method}</span>
    ),
    amount: (item: any) => (
      <span>{item.amount}</span>
    ),
    createdAt: (item: any) => (
      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
    )
  }

  return (
    <SectionTable
      tableData={payouts}
      tableHeaderMetadata={tableHeaderMetadata}
      customColumnRenderer={customColumnRenderer}
    />
  );
}

export default PayoutsTable;