const handleResponse = (response: any) => {
  // eslint-disable-next-line no-console
  console.log(response[0].statusCode)
  // eslint-disable-next-line no-console
  console.log(response[0].body)
  // eslint-disable-next-line no-console
  console.log(response[0].headers)
  return response
}

export default handleResponse

module.exports = handleResponse
