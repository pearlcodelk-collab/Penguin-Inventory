import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home, Bell } from 'lucide-react'

const Navbar = ({ onToggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const location = useLocation()

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment)
    
    const breadcrumbs = [
      { label: 'Home', path: '/dashboard' }
    ]

    let currentPath = ''
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`
      // Convert kebab-case to Title Case
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      breadcrumbs.push({ label, path: currentPath })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  const notifications = [
    { id: 1, message: 'New GRN entry received', time: '2 min ago', type: 'info' },
    { id: 2, message: 'Low stock alert for Item #1234', time: '15 min ago', type: 'warning' },
    { id: 3, message: 'Monthly report generated', time: '1 hour ago', type: 'success' },
  ]

  return (
    <nav className="bg-gray-50 shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-blue-900 font-medium flex items-center gap-1">
                    {index === 0 && <Home className="w-4 h-4" />}
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-blue-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    {index === 0 && <Home className="w-4 h-4" />}
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 ml-auto">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-blue-900" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-blue-200 z-50">
                <div className="p-4 border-b border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-blue-100 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'warning' ? 'bg-yellow-400' :
                          notification.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-blue-900">{notification.message}</p>
                          <p className="text-xs text-blue-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-blue-200">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-blue-900">John Doe</p>
                <p className="text-xs text-blue-400">Administrator</p>
              </div>
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-blue-200 z-50">
                <div className="p-4 border-b border-blue-200">
                  <p className="text-sm font-medium text-blue-900">John Doe</p>
                  <p className="text-xs text-blue-400">john.doe@penguin.com</p>
                </div>
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-sm text-blue-900 hover:bg-gray-100">
                    Profile Settings
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-blue-900 hover:bg-gray-100">
                    Preferences
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-blue-900 hover:bg-gray-100">
                    Help & Support
                  </a>
                  <hr className="my-1" />
                  <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
