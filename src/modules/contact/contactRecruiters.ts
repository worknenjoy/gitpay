import ContactMail from '../mail/contact'

export async function contactRecruiters(contactParams: any) {
  return ContactMail.recruiters(contactParams)
}
