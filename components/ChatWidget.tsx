'use client'

import { useState } from 'react'
import { MessengerIcon, WhatsappIcon } from './SocialIcons'
import styles from './ChatWidget.module.css'

const WHATSAPP_NUMBER = '639621494688'
const WHATSAPP_MESSAGE = "Hi Enjoy Ka Dito! I'd like to know more about your tour packages."
const MESSENGER_URL = 'https://m.me/EnjoyKaDito'

const CHANNELS = [
  {
    Icon: WhatsappIcon,
    label: 'WhatsApp',
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    className: 'whatsapp',
  },
  {
    Icon: MessengerIcon,
    label: 'Messenger',
    href: MESSENGER_URL,
    className: 'messenger',
  },
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <p className={styles.panelTitle}>Chat with us</p>
            <p className={styles.panelSubtext}>We usually reply within a few minutes.</p>
          </div>
          <div className={styles.channelList}>
            {CHANNELS.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                className={`${styles.channel} ${styles[channel.className]}`}
              >
                <channel.Icon className={styles.channelIcon} />
                {channel.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close chat options' : 'Chat with us'}
      >
        {open ? (
          <span className={styles.closeIcon}>×</span>
        ) : (
          <svg viewBox="0 0 24 24" className={styles.toggleIcon} fill="currentColor">
            <path d="M12 2C6.477 2 2 6.03 2 11c0 2.61 1.232 4.955 3.2 6.605-.106 1.087-.44 2.194-1.03 3.194a.5.5 0 0 0 .565.73c1.47-.36 2.78-.99 3.83-1.73A11.4 11.4 0 0 0 12 20c5.523 0 10-4.03 10-9s-4.477-9-10-9Z" />
          </svg>
        )}
      </button>
    </div>
  )
}
