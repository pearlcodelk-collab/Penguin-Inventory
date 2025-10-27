import { Route, Routes } from 'react-router-dom'
import DefaultLayout from './layout/DefaultLayout'
import Welcome from './pages/Welcome'
import DashBoard from './pages/DashBoard'
import GrnEntry from './pages/GrnEntry'
import StockBalance from './pages/StockBalance'
import Reporting from './pages/Reporting'
import ItemMaster from './pages/ItemMaster'
import DataUpload from './pages/DataUpload'

const App = () => {
  return (
    <>
    <Routes>
      <Route index element={<Welcome />} />      

      <Route path='/' element={<DefaultLayout />}>
        <Route path='dashboard' element={<DashBoard />} />
        <Route path='grn-entry' element={<GrnEntry />} />
        <Route path='stock-balance' element={<StockBalance />} />
        <Route path='reporting' element={<Reporting />} />
        <Route path='item-master' element={<ItemMaster />} />
        <Route path='data-upload' element={<DataUpload />} />
      </Route>
      
    </Routes>

    </>
  )
}

export default App