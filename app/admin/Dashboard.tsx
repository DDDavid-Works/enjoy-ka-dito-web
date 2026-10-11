'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import type { ModuleKey } from '@/types/modules'
import styles from './Dashboard.module.css'

type DashboardModule = { module: ModuleKey; to: string; title: string; desc: string }

const MODULE_GROUPS: { title: string; modules: DashboardModule[] }[] = [
  {
    title: 'Sales',
    modules: [
      { module: 'inquiries', to: '/admin/inquiries', title: 'Inquiries', desc: 'Review quote requests and contact messages.' },
      { module: 'quotations', to: '/admin/quotations', title: 'Quotations', desc: 'Prepare and track customer quotations.' },
    ],
  },
  {
    title: 'Catalog',
    modules: [
      { module: 'packages', to: '/admin/packages', title: 'Tour Packages', desc: 'Create, edit, and publish tour packages.' },
      { module: 'hotels', to: '/admin/hotels', title: 'Hotels & Resorts', desc: 'Manage partner hotel and resort contacts.' },
    ],
  },
  {
    title: 'Settings',
    modules: [
      { module: 'users', to: '/admin/users', title: 'Users', desc: 'Manage who can log in, and change passwords.' },
      {
        module: 'company',
        to: '/admin/company',
        title: 'Company Details',
        desc: 'Update the email, address, and contact numbers shown on the site.',
      },
    ],
  },
]

export default function AdminDashboard() {
  const { admin, logout } = useAuth()
  const router = useRouter()

  const visibleGroups = MODULE_GROUPS.map((group) => ({
    ...group,
    modules: group.modules.filter((m) => admin?.modules?.includes(m.module)),
  })).filter((group) => group.modules.length > 0)

  function handleLogout() {
    logout()
    router.push('/admin/login')
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <img src="/images/logo-square.png" alt="Enjoy Ka Dito" className={styles.logo} />
        <div className={styles.account}>
          <span>{admin?.name}</span>
          <Link href="/admin/account" className={styles.accountLink}>
            Change Password
          </Link>
          <button type="button" onClick={handleLogout} className={styles.logoutButton}>
            Log Out
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <h1 className={styles.title}>Welcome, {admin?.name}.</h1>
        <p className={styles.subtext}>Manage the site&rsquo;s content below.</p>

        {visibleGroups.map((group) => (
          <section key={group.title} className={styles.group}>
            <h2 className={styles.groupTitle}>{group.title}</h2>
            <div className={styles.modules}>
              {group.modules.map((module) => (
                <Link key={module.to} href={module.to} className={styles.moduleCard}>
                  <span className={styles.moduleTitle}>{module.title}</span>
                  <span className={styles.moduleDesc}>{module.desc}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
