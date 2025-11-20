const UserAccountActivationTemplate = (message: string) => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8"> <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->

    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">

    <!-- CSS Reset : BEGIN -->
    <style>

        /* What it does: Remove spaces around the email design added by some email clients. */
        /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
        html,
body {
    margin: 0 auto !important;
    padding: 0 !important;
    height: 100% !important;
    width: 100% !important;
    background: #f1f1f1;
}

/* What it does: Stops email clients resizing small text. */
* {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}

/* What it does: Centers email on Android 4.4 */
div[style*="margin: 16px 0"] {
    margin: 0 !important;
}

/* What it does: Stops Outlook from adding extra spacing to tables. */
table,
td {
    mso-table-lspace: 0pt !important;
    mso-table-rspace: 0pt !important;
}

/* What it does: Fixes webkit padding issue. */
table {
    border-spacing: 0 !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    margin: 0 auto !important;
}

/* What it does: Uses a better rendering method when resizing images in IE. */
img {
    -ms-interpolation-mode:bicubic;
}

/* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
a {
    text-decoration: none;
}

/* What it does: A work-around for email clients meddling in triggered links. */
*[x-apple-data-detectors],  /* iOS */
.unstyle-auto-detected-links *,
.aBn {
    border-bottom: 0 !important;
    cursor: default !important;
    color: inherit !important;
    text-decoration: none !important;
    font-size: inherit !important;
    font-family: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
}

/* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
.a6S {
    display: none !important;
    opacity: 0.01 !important;
}

/* What it does: Prevents Gmail from changing the text color in conversation threads. */
.im {
    color: inherit !important;
}

/* If the above doesn't work, add a .g-img class to any image in question. */
img.g-img + div {
    display: none !important;
}

/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
/* Create one of these media queries for each additional viewport size you'd like to fix */

/* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
    u ~ div .email-container {
        min-width: 320px !important;
    }
}
/* iPhone 6, 6S, 7, 8, and X */
@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
    u ~ div .email-container {
        min-width: 375px !important;
    }
}
/* iPhone 6+, 7+, and 8+ */
@media only screen and (min-device-width: 414px) {
    u ~ div .email-container {
        min-width: 414px !important;
    }
}

    </style>

    <!-- CSS Reset : END -->

    <!-- Progressive Enhancements : BEGIN -->
    <style>

	    .primary{
	background: #30e3ca;
}
.bg_white{
	background: #ffffff;
}
.bg_light{
	background: #fafafa;
}
.bg_black{
	background: #000000;
}
.bg_dark{
	background: rgba(0,0,0,.8);
}
.email-section{
	padding:2.5em;
}

/*BUTTON*/
.btn{
	padding: 10px 15px;
	display: inline-block;
}
.btn.btn-primary{
	border-radius: 5px;
	background: #30e3ca;
	color: #ffffff;
}
.btn.btn-white{
	border-radius: 5px;
	background: #ffffff;
	color: #000000;
}
.btn.btn-white-outline{
	border-radius: 5px;
	background: transparent;
	border: 1px solid #fff;
	color: #fff;
}
.btn.btn-black-outline{
	border-radius: 0px;
	background: transparent;
	border: 2px solid #000;
	color: #000;
	font-weight: 700;
}

h1,h2,h3,h4,h5,h6{
	font-family: 'Lato', sans-serif;
	color: #000000;
	margin-top: 0;
	font-weight: 400;
}

body{
	font-family: 'Lato', sans-serif;
	font-weight: 400;
	font-size: 15px;
	line-height: 1.8;
	color: rgba(0,0,0,.4);
}

a{
	color: #30e3ca;
}

table{
}
/*LOGO*/

.logo h1{
	margin: 0;
}
.logo h1 a{
	color: #30e3ca;
	font-size: 24px;
	font-weight: 700;
	font-family: 'Lato', sans-serif;
}

/*HERO*/
.hero{
	position: relative;
	z-index: 0;
}

.hero .text{
	color: rgba(0,0,0,.3);
}
.hero .text h2{
	color: #000;
	font-size: 40px;
	margin-bottom: 0;
	font-weight: 400;
	line-height: 1.4;
}
.hero .text h3{
	font-size: 24px;
	font-weight: 300;
}
.hero .text h2 span{
	font-weight: 600;
	color: #30e3ca;
}


/*HEADING SECTION*/
.heading-section{
}
.heading-section h2{
	color: #000000;
	font-size: 28px;
	margin-top: 0;
	line-height: 1.4;
	font-weight: 400;
}
.heading-section .subheading{
	margin-bottom: 20px !important;
	display: inline-block;
	font-size: 13px;
	text-transform: uppercase;
	letter-spacing: 2px;
	color: rgba(0,0,0,.4);
	position: relative;
}
.heading-section .subheading::after{
	position: absolute;
	left: 0;
	right: 0;
	bottom: -10px;
	content: '';
	width: 100%;
	height: 2px;
	background: #30e3ca;
	margin: 0 auto;
}

.heading-section-white{
	color: rgba(255,255,255,.8);
}
.heading-section-white h2{
	font-family: 
	line-height: 1;
	padding-bottom: 0;
}
.heading-section-white h2{
	color: #ffffff;
}
.heading-section-white .subheading{
	margin-bottom: 0;
	display: inline-block;
	font-size: 13px;
	text-transform: uppercase;
	letter-spacing: 2px;
	color: rgba(255,255,255,.4);
}


ul.social{
	padding: 0;
}
ul.social li{
	display: inline-block;
	margin-right: 10px;
}

/*FOOTER*/

.footer{
	border-top: 1px solid rgba(0,0,0,.05);
	color: rgba(0,0,0,.5);
}
.footer .heading{
	color: #000;
	font-size: 20px;
}
.footer ul{
	margin: 0;
	padding: 0;
}
.footer ul li{
	list-style: none;
	margin-bottom: 10px;
}
.footer ul li a{
	color: rgba(0,0,0,1);
}


@media screen and (max-width: 500px) {


}


    </style>


</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
	<center style="width: 100%; background-color: #f1f1f1;">
    <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    </div>
    <div style="max-width: 600px; margin: 0 auto;" class="email-container">
    	<!-- BEGIN BODY -->
      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
      	<tr>
          <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;">
          	<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          		<tr>
          			<td class="logo" style="text-align: center;">
			            <h1>${message}</h1>
			          </td>
          		</tr>
          	</table>
          </td>
	      </tr><!-- end tr -->
	      <tr>
          <td valign="middle" class="hero bg_white" style="padding: 3em 0 2em 0;">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAAHgCAYAAAB91L6VAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEM4MDAxQTEyRDE0MTFFOUIwNENDREEyQTFDQUEzRTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEM4MDAxQTIyRDE0MTFFOUIwNENDREEyQTFDQUEzRTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4QzgwMDE5RjJEMTQxMUU5QjA0Q0NEQTJBMUNBQTNFOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4QzgwMDFBMDJEMTQxMUU5QjA0Q0NEQTJBMUNBQTNFOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtOJ/LoAAFFASURBVHja7J0F2F7V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" alt="" style="width: 300px; max-width: 600px; height: auto; margin: auto; display: block;">
          </td>
	      </tr><!-- end tr -->
				<tr>
          <td valign="middle" class="hero bg_white" style="padding: 2em 0 4em 0;">
            <table>
            	<tr>
            		<td>
            			<div class="text" style="padding: 0 2.5em; text-align: center;">
            				<h2>Please verify your email</h2>
            				<h3>Amazing deals, updates, interesting news right in your inbox</h3>
            				<p><a href="#" class="btn btn-primary">Yes! Subscribe Me</a></p>
            			</div>
            		</td>
            	</tr>
            </table>
          </td>
	      </tr><!-- end tr -->
      <!-- 1 Column Text + Button : END -->
      </table>
      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
      	<tr>
          <td valign="middle" class="bg_light footer email-section">
            <table>
            	<tr>
                <td valign="top" width="33.333%" style="padding-top: 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: left; padding-right: 10px;">
                      	<h3 class="heading">About</h3>
                      	<p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
                      </td>
                    </tr>
                  </table>
                </td>
                <td valign="top" width="33.333%" style="padding-top: 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: left; padding-left: 5px; padding-right: 5px;">
                      	<h3 class="heading">Contact Info</h3>
                      	<ul>
					                <li><span class="text">203 Fake St. Mountain View, San Francisco, California, USA</span></li>
					                <li><span class="text">+2 392 3929 210</span></a></li>
					              </ul>
                      </td>
                    </tr>
                  </table>
                </td>
                <td valign="top" width="33.333%" style="padding-top: 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: left; padding-left: 10px;">
                      	<h3 class="heading">Useful Links</h3>
                      	<ul>
					                <li><a href="#">Home</a></li>
					                <li><a href="#">About</a></li>
					                <li><a href="#">Services</a></li>
					                <li><a href="#">Work</a></li>
					              </ul>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr><!-- end: tr -->
        <tr>
          <td class="bg_light" style="text-align: center;">
          	<p>No longer want to receive these email? You can <a href="#" style="color: rgba(0,0,0,.8);">Unsubscribe here</a></p>
          </td>
        </tr>
      </table>

    </div>
  </center>
</body>
</html>`
