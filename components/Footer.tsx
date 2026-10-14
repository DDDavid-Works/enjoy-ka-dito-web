import { cacheLife } from 'next/cache'
import Image from 'next/image'
import { getCompanyDetails } from '@/lib/company'
import { FacebookIcon, InstagramIcon, TiktokIcon } from './SocialIcons'
import styles from './Footer.module.css'

const SOCIAL_LINKS = [
  { Icon: FacebookIcon, label: 'Follow us on Facebook', handle: 'EnjoyKaDito', href: 'https://www.facebook.com/EnjoyKaDito' },
  { Icon: InstagramIcon, label: 'Follow us on Instagram', handle: 'enjoykadito', href: 'https://www.instagram.com/enjoykadito/' },
  {
    Icon: TiktokIcon,
    label: 'Follow us on TikTok',
    handle: 'enjoykaditotravels',
    href: 'https://www.tiktok.com/@enjoykaditotravels',
  },
]

// Cached so the year is part of the prerendered footer; it refreshes within a day.
async function currentYear() {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}

export default async function Footer() {
  const company = await getCompanyDetails()
  const emails = company.emails.filter(Boolean)
  const numbers = company.contactNumbers.filter(Boolean)

  // Items sit on one line with a dot between them; on phones each item gets its own line.
  const renderItems = (items: string[]) =>
    items.map((item, index) => (
      <span key={index} className={styles.contactItem}>
        {index > 0 && <span className={styles.contactSeparator}> · </span>}
        {item}
      </span>
    ))

  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <div className={styles.footerInfo}>
          <div className={styles.logoCard}>
            <Image src="/images/logo-square.png" alt="Enjoy Ka Dito" width={98} height={88} className={styles.logo} />
          </div>
          <p className={styles.company}>by: MCP Greenery Travel and Tours</p>
          <p className={styles.tagline}>
            Your Philippine-based travel partner for more meaningful local and international adventures.
          </p>
          {emails.length > 0 && <p className={styles.contact}>{renderItems(emails)}</p>}
          {numbers.length > 0 && <p className={styles.contact}>{renderItems(numbers)}</p>}
          {company.address && <p className={styles.contact}>{company.address}</p>}
        </div>

        <div className={styles.social}>
          <p className={styles.socialLabel}>FOLLOW ALONG</p>
          <div className={styles.socialRow}>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className={styles.socialLink}
              >
                <social.Icon className={styles.socialIcon} />
                <span className={styles.socialHandle}>@{social.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.copyright}>
        © {await currentYear()} Enjoy Ka Dito by: MCP Greenery Travel and Tours. All Rights Reserved.
      </p>
    </footer>
  )
}
