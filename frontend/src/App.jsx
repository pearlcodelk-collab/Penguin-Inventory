import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import DefaultLayout from './layout/DefaultLayout'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import DashBoard from './pages/DashBoard'
import GrnEntry from './pages/GrnEntry'
import StockBalance from './pages/StockBalance'
import Reporting from './pages/Reporting'
import ItemMaster from './pages/ItemMaster'
import DataUpload from './pages/DataUpload'
import UserManagement from './pages/UserManagement'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
    <Routes>
      {/* Public Routes */}
      <Route index element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Welcome />} />      
      <Route path='/login' element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />

      {/* Protected Routes */}
      <Route path='/' element={
        <ProtectedRoute>
          <DefaultLayout />
        </ProtectedRoute>
      }>
        <Route path='dashboard' element={<DashBoard />} />
        <Route path='grn-entry' element={<GrnEntry />} />
        <Route path='stock-balance' element={<StockBalance />} />
        <Route path='reporting' element={<Reporting />} />
        <Route path='item-master' element={<ItemMaster />} />
        <Route path='data-upload' element={<DataUpload />} />
        
        {/* Super Admin Only Routes */}
        <Route path='user-management' element={
          <ProtectedRoute requireSuperAdmin={true}>
            <UserManagement />
          </ProtectedRoute>
        } />
      </Route>

      {/* Catch all - redirect to dashboard if authenticated, login otherwise */}
      <Route path='*' element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
    </Routes>

    </>
  )
}

export default App