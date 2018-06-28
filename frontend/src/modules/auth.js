class Auth {
  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  /* eslint-disable no-undef */
  static authenticateUser (token) {
    localStorage.setItem('token', token)
  }

  static authNotified () {
    localStorage.setItem('authNotified', true)
  }

  static getAuthNotified () {
    return localStorage.getItem('authNotified')
  }

  static storeReferer (path) {
    localStorage.setItem('referer', path)
  }

  static getReferer () {
    return localStorage.getItem('referer')
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated () {
    return localStorage.getItem('token') !== null
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser () {
    localStorage.removeItem('token')
    localStorage.removeItem('authNotified')
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken () {
    return localStorage.getItem('token')
  }
}

export default Auth
