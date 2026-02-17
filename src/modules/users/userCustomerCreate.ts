type UserCustomerCreateParams = {
  [key: string]: any
}

export async function userCustomerCreate(id: number, customerParameters: UserCustomerCreateParams) {
  const { createCustomerForUser } = await import(
    '../../mutations/user/customer/createCustomerForUser'
  )
  return createCustomerForUser(id, customerParameters)
}
