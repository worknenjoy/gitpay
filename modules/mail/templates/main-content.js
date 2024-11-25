module.exports.mainContentEmailTemplate = (intro = '', subtitle1 = '', callToActionText = '', callToActionLink = '', subtitle2 = '', footerMessage = '') => `
 <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top">
                  <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">${intro}</p>
                  <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">${subtitle1}</p>
                  ${getActions(callToActionText, callToActionLink)}
                  <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">${subtitle2}</p>
                  <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">${footerMessage}</p>
                </td>
              </tr>

              <!-- END MAIN CONTENT AREA -->
`;

const getActions = (callToActionText, callToActionLink) => {
  if (callToActionText && callToActionLink) {
    return `
      <table class="btn btn-primary" cellpadding="0" cellspacing="0" border="0">
        <tbody>
          <tr>
            <td align="left">
              <table cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  <tr>
                    <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 12px 24px;" valign="top">
                      <a href="${callToActionLink}" target="_blank" style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; color: #ffffff; text-decoration: none; display: inline-block; background-color: #3498db; border-radius: 3px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);">${callToActionText}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }
  return '';
}