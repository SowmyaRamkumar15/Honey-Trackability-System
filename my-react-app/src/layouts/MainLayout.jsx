import React from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const MainLayout = ({ children, transparentNav = false }) => {
  return (
    <div className="layout">
      <Navbar transparent={transparentNav} />
      <main className="layout__main">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
