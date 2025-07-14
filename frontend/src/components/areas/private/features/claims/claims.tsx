import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import PrimaryDataPage from 'design-library/pages/private/data-pages/primary-data-page/primary-data-page';
import IssueLinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field';
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field';
import TextField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/text-field/text-field';

const Claims = ({
  user,
  transfers,
  searchTransfer,
  paymentRequestTransfers,
  listPaymentRequestTransfers
}) => {

  useEffect(() => {
    searchTransfer({ to: user.id });
    listPaymentRequestTransfers();
  }, [user, searchTransfer, listPaymentRequestTransfers]);

  return (
    <PrimaryDataPage
      title={<FormattedMessage id="account.profile.claims.title" defaultMessage="Claims" />}
      description={<FormattedMessage id="account.profile.claims.description" defaultMessage="List of claims made by contributors." />}
      activeTab="claims"
      tabs={[
        {
          label: <FormattedMessage id="account.profile.claims.tab.label" defaultMessage="Claims for bounties" />,
          value: 'claims',
          table: {
            tableData: transfers,
            tableHeaderMetadata: {
              status: { sortable: true, dataBaseKey: 'status', label: <FormattedMessage id="account.profile.claims.status" defaultMessage="Status" /> },
              transfer_method: { sortable: true, dataBaseKey: 'transfer_method', label: <FormattedMessage id="account.profile.claims.method" defaultMessage="Method" /> },
              issue: { sortable: true, dataBaseKey: 'issue', label: <FormattedMessage id="account.profile.claims.issue" defaultMessage="Issue" /> },
              value: { sortable: true, numeric: true, dataBaseKey: 'value', label: <FormattedMessage id="account.profile.claims.value" defaultMessage="Value" /> },
              createdAt: { sortable: true, numeric: true, dataBaseKey: 'createdAt', label: <FormattedMessage id="account.profile.claims.createdAt" defaultMessage="Created At" /> }
            },
            customColumnRenderer: {
              issue: (item) => (
                <IssueLinkField
                  issue={item?.Task}
                />
              ),
              value: (item:any) => (
                <AmountField
                  value={item.value}
                />
              ),
              createdAt: (item:any) => (
                <CreatedField
                  createdAt={item.createdAt}
                />
              )
            }
          }
        },
        {
          label: <FormattedMessage id="account.profile.paymentRequestTransfers.tab.label" defaultMessage="Claims for payment requests" />,
          value: 'payment-request-transfers',
          table: {
            tableData: paymentRequestTransfers,
            tableHeaderMetadata: {
              title: { sortable: true, dataBaseKey: 'PaymentRequest.title', label: <FormattedMessage id="account.profile.paymentRequestTransfer.title" defaultMessage="Payment Request" /> },
              status: { sortable: true, dataBaseKey: 'status', label: <FormattedMessage id="account.profile.claims.status" defaultMessage="Status" /> },
              transfer_method: { sortable: true, dataBaseKey: 'transfer_method', label: <FormattedMessage id="account.profile.claims.method" defaultMessage="Method" /> },
              value: { sortable: true, numeric: true, dataBaseKey: 'value', label: <FormattedMessage id="account.profile.claims.value" defaultMessage="Value" /> },
              createdAt: { sortable: true, numeric: true, dataBaseKey: 'createdAt', label: <FormattedMessage id="account.profile.claims.createdAt" defaultMessage="Created At" /> }
            },
            customColumnRenderer: {
              title: (item:any) => (
                <TextField
                  title={item?.PaymentRequest?.title}
                />
              ),
              value: (item:any) => (
                <AmountField
                  value={item.value}
                />
              ),
              createdAt: (item:any) => (
                <CreatedField
                  createdAt={item.createdAt}
                />
              )
            }
          }
        }
      ]}
    />
  );
};

export default Claims;
