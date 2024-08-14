import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { BillingInfoCard } from './payment-method-invoice-billing-info'
import ReactPlaceholder from 'react-placeholder';
import { countryCodesFull } from '../../../../profile/country-codes';

export const PaymentMethodInvoiceTab = ({
    classes,
    priceAfterFee,
    price,
    formatCurrency,
    fetchCustomer,
    customer,
    user,
    task,
    createOrder,
    onPayment
}) => {

    const { name, address } = customer.data

    const onInvoicePayment = async() => {
        await createOrder({
            provider: 'stripe',
            amount: price,
            userId: user?.id,
            email: user?.email,
            taskId: task.id,
            currency: 'usd',
            status: 'open',
            source_type: 'invoice-item',
            customer_id: user?.customer_id,
            metadata: {
              user_id: user.id,
            }
          })
        onPayment()
    }

    useEffect(() => {
        user.id && fetchCustomer(user.id);
    }, [fetchCustomer, user]);

    return (
        <>
            <ReactPlaceholder
                showLoadingAnimation={true}
                type='media'
                ready={customer.completed}
                rows={5}
            >
            <BillingInfoCard
                name={name}
                address={`${address?.line1} ${address?.line2}`}
                city={address?.city}
                state={address?.state}
                zipCode={address?.postal_code}
                country={countryCodesFull.find(c => c.code === address?.country)?.country}
                totalAmount={priceAfterFee}
            />
            </ReactPlaceholder>
            <Button
                disabled={!priceAfterFee}
                onClick={onInvoicePayment}
                variant='contained'
                color='primary'
                className={classes.btnPayment}
            >
                <FormattedMessage id='task.payment.invoice.action' defaultMessage='Pay {amount} with Invoice' values={{
                    amount: formatCurrency(priceAfterFee)
                }} />
            </Button>
        </>
    )
}