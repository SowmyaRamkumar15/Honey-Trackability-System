import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { useLanguage } from '../../i18n/LanguageContext'
import LanguageSelector from './LanguageSelector'
import NotificationBell from '../../features/notification/components/NotificationBell'
import './Navbar.css'

export const Navbar = ({ transparent = false, onMobileToggle }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth)
  const { itemCount } = useSelector((state) => state.cart || { itemCount: 0 })
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    setMobileOpen(false)
    navigate('/login')
  }

  return (
    <nav
      id="main-navbar"
      className={`hc-navbar ${transparent ? 'hc-navbar--transparent' : ''}`.trim()}
    >
      <div className="hc-navbar__inner">
        {/* Brand Logo */}
        <div className="hc-navbar__left">
          <Link
            to="/"
            id="nav-logo"
            className="hc-navbar__brand"
            onClick={() => setMobileOpen(false)}
          >
            <div className="hc-navbar__logo-icon">
              🍯
            </div>
            <span className="hc-navbar__brand-name">
              HoneyChain
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hc-navbar__links">
            <Link
              to="/marketplace"
              className="hc-navbar__link"
            >
              {t('nav.marketplace', 'Marketplace')}
            </Link>

            {isAuthenticated && role === 'BEEKEEPER' && (
              <>
                <Link to="/beekeeper/dashboard" className="hc-navbar__link">
                  {t('nav.dashboard', 'Dashboard')}
                </Link>
                <Link to="/hives" className="hc-navbar__link">
                  {t('nav.myHives', 'My Hives')}
                </Link>
                <Link to="/batches" className="hc-navbar__link">
                  {t('nav.myBatches', 'My Batches')}
                </Link>
                <Link to="/hives/health" className="hc-navbar__link">
                  {t('nav.hiveHealth', 'Hive Health')}
                </Link>
              </>
            )}

            {isAuthenticated && role === 'CUSTOMER' && (
              <>
                <Link to="/customer/dashboard" className="hc-navbar__link">
                  {t('nav.dashboard', 'Dashboard')}
                </Link>
                <Link to="/orders" className="hc-navbar__link">
                  {t('nav.orders', 'My Orders')}
                </Link>
                <Link to="/my-reviews" className="hc-navbar__link">
                  {t('nav.myReviews', 'My Reviews')}
                </Link>
                <Link to="/customer/disputes" className="hc-navbar__link">
                  {t('nav.disputes', 'Disputes')}
                </Link>
              </>
            )}

            {isAuthenticated && (role === 'ADMIN' || role === 'KVIC_OFFICER') && (
              <>
                <Link to="/admin/dashboard" className="hc-navbar__link">
                  {t('nav.adminDashboard', 'Dashboard')}
                </Link>
                <Link to="/admin/beekeepers" className="hc-navbar__link">
                  {t('nav.beekeepers', 'Beekeepers')}
                </Link>
                <Link to="/admin/batches" className="hc-navbar__link">
                  {t('nav.batches', 'Batches')}
                </Link>
                <Link to="/admin/analytics" className="hc-navbar__link">
                  {t('nav.analytics', 'Analytics')}
                </Link>
              </>
            )}

            {isAuthenticated && role === 'LAB' && (
              <>
                <Link to="/lab/dashboard" className="hc-navbar__link">
                  {t('nav.dashboard', 'Lab Dashboard')}
                </Link>
                <Link to="/lab/tests" className="hc-navbar__link">
                  {t('nav.pendingTests', 'Pending Tests')}
                </Link>
                <Link to="/lab/certificates" className="hc-navbar__link">
                  {t('nav.certificates', 'Certificates')}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="hc-navbar__actions">
          {/* Language Selector Dropdown */}
          <LanguageSelector />

          {/* Notification Bell */}
          {isAuthenticated && <NotificationBell />}

          {/* Cart Icon for Customers / Public */}
          {(!isAuthenticated || role === 'CUSTOMER') && (
            <Link
              to="/cart"
              id="nav-cart-btn"
              className="hc-navbar__cart-btn"
              title={t('accessibility.viewCart', 'View Cart')}
            >
              <span>🛒</span>
              <span>{t('nav.cart', 'Cart')}</span>
              {itemCount > 0 && (
                <span className="hc-navbar__cart-count">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="hc-navbar__user-pill">
              <span className="hc-navbar__role-badge">
                {role}
              </span>
              <button
                id="nav-logout-btn"
                onClick={handleLogout}
                className="hc-navbar__logout-btn"
              >
                {t('nav.logout', 'Logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              id="nav-login-btn"
              className="hc-navbar__login-btn"
            >
              {t('nav.login', 'Login')}
            </Link>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            id="nav-mobile-toggle"
            onClick={() => {
              if (onMobileToggle) {
                onMobileToggle()
              } else {
                setMobileOpen(!mobileOpen)
              }
            }}
            className="hc-navbar__toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Menu Panel */}
      {mobileOpen && (
        <div className="hc-navbar__mobile-drawer">
          <div className="hc-navbar__mobile-drawer-top">
            <LanguageSelector />
            {isAuthenticated && (
              <span className="hc-navbar__role-badge">
                {role}
              </span>
            )}
          </div>

          <div className="hc-navbar__mobile-links">
            <Link
              to="/marketplace"
              className="hc-navbar__mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {t('nav.marketplace', 'Marketplace')}
            </Link>

            {isAuthenticated && role === 'BEEKEEPER' && (
              <>
                <Link
                  to="/beekeeper/dashboard"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.dashboard', 'Dashboard')}
                </Link>
                <Link
                  to="/hives"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.myHives', 'My Hives')}
                </Link>
                <Link
                  to="/batches"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.myBatches', 'My Batches')}
                </Link>
                <Link
                  to="/hives/health"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.hiveHealth', 'Hive Health')}
                </Link>
              </>
            )}

            {isAuthenticated && role === 'CUSTOMER' && (
              <>
                <Link
                  to="/customer/dashboard"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.dashboard', 'Dashboard')}
                </Link>
                <Link
                  to="/orders"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.orders', 'My Orders')}
                </Link>
                <Link
                  to="/my-reviews"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.myReviews', 'My Reviews')}
                </Link>
                <Link
                  to="/customer/disputes"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.disputes', 'Disputes')}
                </Link>
              </>
            )}

            {isAuthenticated && (role === 'ADMIN' || role === 'KVIC_OFFICER') && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.adminDashboard', 'Dashboard')}
                </Link>
                <Link
                  to="/admin/beekeepers"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.beekeepers', 'Beekeepers')}
                </Link>
                <Link
                  to="/admin/batches"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.batches', 'Batches')}
                </Link>
                <Link
                  to="/admin/analytics"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.analytics', 'Analytics')}
                </Link>
              </>
            )}

            {isAuthenticated && role === 'LAB' && (
              <>
                <Link
                  to="/lab/dashboard"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.dashboard', 'Lab Dashboard')}
                </Link>
                <Link
                  to="/lab/tests"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.pendingTests', 'Pending Tests')}
                </Link>
                <Link
                  to="/lab/certificates"
                  className="hc-navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.certificates', 'Certificates')}
                </Link>
              </>
            )}
          </div>

          <div className="hc-navbar__mobile-footer">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="hc-navbar__mobile-logout"
              >
                {t('nav.logout', 'Logout')}
              </button>
            ) : (
              <Link
                to="/login"
                className="hc-navbar__mobile-login"
                onClick={() => setMobileOpen(false)}
              >
                {t('nav.login', 'Login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
