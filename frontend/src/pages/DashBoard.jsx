import React from 'react'

const DashBoard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of inventory management system</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">Dashboard metrics and overview will be displayed here.</p>
      </div>
    </div>
  )
}

export default DashBoard