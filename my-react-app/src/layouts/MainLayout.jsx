import React from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const MainLayout = ({ children, transparentNav = false }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-soft)' }}>
      <Navbar transparent={transparentNav} />
      <main style={{ flex: 1, width: '100%' }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
