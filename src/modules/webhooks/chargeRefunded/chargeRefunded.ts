import handleRefundIssue from './chargeRefundedIssue'
export const handleChargeRefunded = async (event: any, req: any, res: any) => {
  try {
    const { data } = event || {};
    const { object } = data || {};
    const { payment_intent, metadata, paid, status } = object || {};

    console.log('Processing charge.refunded event with data:', data);

    if (metadata && metadata.order_id) {
      await handleRefundIssue(event, paid, status, req, res);
    } else {
      console.warn('No order_id found in metadata');
    }
    
  } catch (error) {
    console.error('Error processing charge.refunded event:', error);
    return res.status(500).send('Internal Server Error');
  }

  return res.status(200).send('charge.refunded event processed');
};