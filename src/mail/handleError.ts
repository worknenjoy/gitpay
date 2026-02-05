const handleError = (error: any) => {
  // error is an instance of SendGridError
  // The full response is attached to error.response
  // eslint-disable-next-line no-console
  console.log('error to send email:')
  if (error?.response?.body?.errors) {
    // eslint-disable-next-line no-console
    console.log(error.response.body.errors)
  }
  if (error?.response?.statusCode) {
    // eslint-disable-next-line no-console
    console.log(error.response.statusCode)
  }
  return error
}

export default handleError

module.exports = handleError
