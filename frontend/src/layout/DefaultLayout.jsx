import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'

const DefaultLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const location = useLocation()

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen)
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed)
    }
  }

  const contentShiftClass = isMobile 
    ? (isMobileSidebarOpen ? 'ml-0' : 'ml-0') 
    : (isSidebarCollapsed ? 'ml-16' : 'ml-64')

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
        isMobileOpen={isMobileSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${contentShiftClass}`}>
        {/* Navbar */}
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto transition-all">
          <div className="container mx-auto">
            <Outlet key={location.pathname} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DefaultLayout