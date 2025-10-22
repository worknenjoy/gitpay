import React from 'react'
import {
  Edit as EditIcon,
  Link as LinkIcon
} from '@mui/icons-material'
import TextField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/text-field/text-field'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import LinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/link-field/link-field'
import PaymentRequestStatusField from 'design-library/molecules/tables/section-table/section-table-custom-fields/payment-request/payment-request-status-field/payment-request-status-field'
import PaymentRequestActiveField from 'design-library/molecules/tables/section-table/section-table-custom-fields/payment-request/payment-request-active-field/payment-request-active-field'
import PaymentRequestTransferStatusField from 'design-library/molecules/tables/section-table/section-table-custom-fields/payment-request/payment-request-transfer-status-field/payment-request-transfer-status-field'
import ActionField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/action-field/action-field'
import PaymentRequestDrawer from 'design-library/molecules/drawers/payment-request-drawer/payment-request-drawer'

const paymentRequestMetadata = {
  "active": { sortable: true, numeric: false, dataBaseKey: "active", label: 'Is active?', width: 100 },
  "title": { sortable: true, numeric: false, dataBaseKey: "title", label: 'Title' },
  "description": { sortable: true, numeric: false, dataBaseKey: "description", label: 'Description' },
  "amount": { sortable: true, numeric: true, dataBaseKey: "amount", label: 'Amount' },
  "status": { sortable: true, numeric: false, dataBaseKey: "description", label: 'Payment Status'},
  "transfer_status": { sortable: true, numeric: false, dataBaseKey: "transfer_status", label: 'Transfer Status' },
  "paymentLink": { sortable: true, numeric: false, dataBaseKey: "payment_url", label: 'Payment Link' },
  "createdAt": { sortable: true, numeric: false, dataBaseKey: "createdAt", label: 'Created At' },
  "actions": { sortable: false, numeric: false, label: 'Actions' }
}

export const PaymentRequestsTable = ({ paymentRequests }) => {
  const [openPaymentRequestDrawer, setOpenPaymentRequestDrawer] = React.useState(false);

  const openEditPaymentRequest = () => {
    setOpenPaymentRequestDrawer(true);
  }

  const updatePaymentRequest = () => {
    // Refresh table or item
  }

  const customColumnRenderer = {
    active: (item:any) => (
      <PaymentRequestActiveField
        status={item.active ? 'yes' : 'no'}
      />
    ),
    title: (item:any) => (
      <TextField
        title={item.title}
      />
    ),
    description: (item:any) => (
      <TextField
        title={item.description}
      />
    ),
    amount: (item:any) => (
      <AmountField
        value={item.amount}
      />
    ),
    status: (item:any) => (
      <PaymentRequestStatusField
        status={item.status}
      />
    ),
    transfer_status: (item:any) => (
      <PaymentRequestTransferStatusField
        status={item.transfer_status}
      />
    ),
    paymentLink: (item:any) => (
      <LinkField
        url={item.payment_url}
        icon={<LinkIcon />}
        title={item.payment_url}
        tooltipTitle="Open payment link in external browser"
        limit={15}
        width={150}
        external
        copiable
      />
    ),
    createdAt: (item:any) => (
      <CreatedField
        createdAt={item.createdAt}
      />
    ),
    actions: (item:any) => (
      <>
        <PaymentRequestDrawer
          open={openPaymentRequestDrawer}
          onClose={() => setOpenPaymentRequestDrawer(false)}
          completed={true}
          onSuccess={updatePaymentRequest}
        />
        <ActionField
          actions={[
            {
              children: 'Edit',
              icon: <EditIcon />,
              onClick: openEditPaymentRequest
            }
          ]}
        />
      </>
    )
  }

  return (
    <SectionTable
      tableData={paymentRequests}
      tableHeaderMetadata={paymentRequestMetadata}
      customColumnRenderer={customColumnRenderer}
    />
  )
}

export default PaymentRequestsTable