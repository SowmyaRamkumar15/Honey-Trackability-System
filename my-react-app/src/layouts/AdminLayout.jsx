import React from 'react'
import AppShell from '../components/layout/AppShell'
import { useLanguage } from '../i18n/LanguageContext'

export const AdminLayout = ({ children }) => {
  const { t } = useLanguage()

  return (
    <AppShell
      stripLabel={t('admin.controlCenter', 'Admin & KVIC Control Center')}
      stripVariant="admin"
    >
      {children}
    </AppShell>
  )
}

export default AdminLayout
