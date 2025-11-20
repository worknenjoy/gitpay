module.exports.baseContentEmailTemplate = (intro = '', content = '') => `
  <!-- START MAIN CONTENT AREA -->
    <tr>
      <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top">
        <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">${intro}</p>
        <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">${content}</p>
      </td>
    </tr>
  <!-- END MAIN CONTENT AREA -->
`
