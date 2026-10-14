import { getCompanyDetails } from '@/lib/company'
import { toWhatsappNumber } from '@/lib/phone'
import ChatWidget from './ChatWidget'

// Uses the first contact number from the company details as the WhatsApp number.
export default async function ChatWidgetLoader() {
  const company = await getCompanyDetails()
  const first = company.contactNumbers[0]
  return <ChatWidget whatsappNumber={first ? toWhatsappNumber(first) : undefined} />
}
