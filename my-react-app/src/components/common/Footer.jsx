import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

export const Footer = () => {
  return (
    <footer id="main-footer" className="hc-footer">
      <div className="hc-footer__inner">
        <div className="hc-footer__brand">
          <div className="hc-footer__logo-icon">
            🍯
          </div>
          <span className="hc-footer__brand-title">HoneyChain</span>
          <span className="hc-footer__separator">|</span>
          <span className="hc-footer__tagline">National Honey Traceability & Purity Network</span>
        </div>

        <div className="hc-footer__links">
          <Link to="/marketplace" className="hc-footer__link">Marketplace</Link>
          <Link to="/login" className="hc-footer__link">Portals</Link>
          <span className="hc-footer__copyright">© {new Date().getFullYear()} HoneyChain. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
