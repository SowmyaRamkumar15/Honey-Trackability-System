import React from 'react'
import Navbar from '../components/common/Navbar'

const DashboardLayout = ({ children, roleLabel = 'Dashboard' }) => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout__strip strip--beekeeper">
        <div className="layout__strip-inner">
          <div className="layout__strip-bar" />
          <span className="layout__strip-label">
            {roleLabel} Portal
          </span>
        </div>
      </div>
      <main className="layout__main">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
