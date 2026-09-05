import React from 'react'
import Navbar from '../common/Navbar'
import Footer from '../common/Footer'

export const MainLayout = ({ children, transparentNav = false }) => {
  return (
    <div className="page-container flex flex-col min-h-screen">
      <Navbar transparent={transparentNav} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
