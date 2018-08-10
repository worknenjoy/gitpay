module.exports = error => {
  // error is an instance of SendGridError
  // The full response is attached to error.response
  // eslint-disable-next-line no-console
  console.log(error.response.body.errors)
  // eslint-disable-next-line no-console
  console.log(error.response.statusCode)
}
