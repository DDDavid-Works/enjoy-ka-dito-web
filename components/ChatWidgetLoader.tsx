import { getCompanyDetails } from '@/lib/company'
import { findWhatsappNumber } from '@/lib/phone'
import ChatWidget from './ChatWidget'

// Uses the first mobile number in the company details as the WhatsApp number.
export default async function ChatWidgetLoader() {
  const company = await getCompanyDetails()
  return <ChatWidget whatsappNumber={findWhatsappNumber(company.contactNumbers)} />
}
