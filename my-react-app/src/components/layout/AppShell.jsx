import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../common/Navbar'
import RoleSidebar from '../common/RoleSidebar'
import './AppShell.css'

export const AppShell = ({ children, stripLabel, stripVariant = 'default' }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth)
  const [mobileOpen, setMobileOpen] = useState(false)

  const showSidebar = isAuthenticated && Boolean(role)

  return (
    <div className="hc-app-shell">
      {/* Top Navbar */}
      <Navbar onMobileToggle={() => setMobileOpen(!mobileOpen)} />

      {/* Main Body Shell: Sidebar + Main Content */}
      <div className="hc-app-shell__body">
        {showSidebar && (
          <RoleSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        )}
        <div className="hc-app-shell__content-wrapper">
          {/* Subtle Portal Context Header / Strip */}
          {stripLabel && (
            <div className="hc-app-shell__strip">
              <div className="hc-app-shell__strip-tag">
                <span className="hc-app-shell__strip-dot" />
                <span className="hc-app-shell__strip-text">
                  {stripLabel}
                </span>
              </div>
              {showSidebar && (
                <button
                  type="button"
                  id="appshell-mobile-sidebar-toggle"
                  onClick={() => setMobileOpen(true)}
                  className="hc-app-shell__mobile-menu-btn"
                  aria-label="Open portal navigation"
                >
                  <span>☰</span>
                  <span>Menu</span>
                </button>
              )}
            </div>
          )}

          <main className="hc-app-shell__main">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppShell
