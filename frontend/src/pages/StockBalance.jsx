import React from 'react'

const StockBalance = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Balance</h1>
          <p className="text-gray-600 mt-1">View current inventory stock levels</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">Stock balance overview will be displayed here.</p>
      </div>
    </div>
  )
}

export default StockBalance


