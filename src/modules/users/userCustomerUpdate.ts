type UserCustomerUpdateParams = {
  [key: string]: any
}

export async function userCustomerUpdate(id: number, customerParameters: UserCustomerUpdateParams) {
  const { updateUserCustomer } = await import('../../mutations/user/customer/updateUserCustomer')
  return updateUserCustomer(id, customerParameters)
}
