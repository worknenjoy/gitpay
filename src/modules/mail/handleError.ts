const handleError = (error: any) => {
  // eslint-disable-next-line no-console
  console.log(' ----- error ---- ')
  // eslint-disable-next-line no-console
  console.log(error.response.body.errors)
  // eslint-disable-next-line no-console
  console.log(' ----- end error ---- ')
}

export default handleError

module.exports = handleError
