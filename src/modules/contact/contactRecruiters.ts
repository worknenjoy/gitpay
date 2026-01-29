const ContactMail = require('../mail/contact')

export async function contactRecruiters(contactParams: any) {
  return ContactMail.recruiters(contactParams)
}
