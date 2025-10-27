import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  FileText, 
  Database, 
  Upload 
} from 'lucide-react'
import logo from '../assets/logo.png'

const Sidebar = ({ isCollapsed, isMobile, isMobileOpen, onToggleSidebar }) => {
  const location = useLocation()
  
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'grn-entry', icon: ClipboardList, label: 'GRN Entry', path: '/grn-entry' },
    { id: 'stock-balance', icon: Package, label: 'Stock Balance', path: '/stock-balance' },
    { id: 'reporting', icon: FileText, label: 'Reporting', path: '/reporting' },
    { id: 'item-master', icon: Database, label: 'Item Master', path: '/item-master' },
    { id: 'data-upload', icon: Upload, label: 'Data Upload', path: '/data-upload' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggleSidebar}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 ${
        isMobile && !isMobileOpen ? 'hidden' : ''
      } ${isCollapsed && !isMobile ? 'w-16' : 'w-64'} h-screen bg-gray-50 shadow-lg flex flex-col transition-all duration-300 ${isMobile ? 'z-50' : 'z-40'}`}>
        {/* Header Section */}
        <div className={`${isCollapsed && !isMobile ? 'p-3' : 'p-6'} border-b border-gray-200`}>
          <div className="flex items-center justify-center">
            {/* Penguin Logo */}
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-white">
              <img src={logo} alt="Penguin Logo" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              const IconComponent = item.icon
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => isMobile && onToggleSidebar()}
                    className={`w-full flex items-center ${isCollapsed && !isMobile ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-blue-300 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={isCollapsed && !isMobile ? item.label : ''}
                  >
                    <IconComponent className="w-5 h-5" />
                    {(!isCollapsed || isMobile) && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer Section */}
        {(!isCollapsed || isMobile) && (
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Powered by Pearl Code
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar