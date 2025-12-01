import React, { useEffect, useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import api from '../services/api'
import { getItems, createItem, updateItem, deleteItem } from '../services/itemService'
import { uploadImage } from '../services/uploadService'
import { getCategories } from '../services/categoryService'

const ItemItems = () => {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create') // 'create' | 'edit'
  const [currentItem, setCurrentItem] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    ctnNo: '',
    productCode: '',
    categoryId: '',
    image: null,
    imageUrl: ''
  })
  const [formErrors, setFormErrors] = useState({})

  const apiBase = useMemo(() => {
    const base = api.defaults.baseURL || ''
    return typeof base === 'string' ? base.replace(/\/api$/, '') : ''
  }, [])

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl
    return `${apiBase}${imageUrl}`
  }

  useEffect(() => {
    // initial load
    refreshAll('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced remote search
  useEffect(() => {
    const handle = setTimeout(() => {
      fetchItems(searchTerm)
    }, 300)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  const refreshAll = async (search) => {
    try {
      setLoading(true)
      await Promise.all([fetchItems(search), fetchCategoriesList('')])
    } finally {
      setLoading(false)
    }
  }

  const fetchItems = async (search) => {
    try {
      const response = await getItems(search)
      const list = Array.isArray(response) ? response : (response.items || [])
      setItems(list)
    } catch (err) {
      toast.error(err.message || 'Failed to fetch items')
    }
  }

  const fetchCategoriesList = async (search) => {
    try {
      const response = await getCategories(search)
      const list = Array.isArray(response) ? response : (response.categories || [])
      setCategories(list)
    } catch (err) {
      toast.error(err.message || 'Failed to fetch categories')
    }
  }

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items
    const term = searchTerm.toLowerCase()
    return items.filter(it =>
      (it.ctnNo || '').toLowerCase().includes(term) ||
      (it.productCode || '').toLowerCase().includes(term) ||
      (it.category?.categoryName || '').toLowerCase().includes(term) ||
      (it.category?.categoryCode || '').toLowerCase().includes(term)
    )
  }, [items, searchTerm])

  const openCreateModal = () => {
    setModalType('create')
    setCurrentItem(null)
    setFormData({
      ctnNo: '',
      productCode: '',
      categoryId: '',
      image: null
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setModalType('edit')
    setCurrentItem(item)
    setFormData({
      ctnNo: item.ctnNo || '',
      productCode: item.productCode || '',
      categoryId: item.category?._id || item.category || '',
      image: null,
      imageUrl: item.imageUrl || ''
    })
    setFormErrors({})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setCurrentItem(null)
    setFormErrors({})
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0] || null
    if (!file) {
      setFormData(prev => ({ ...prev, image: null, imageUrl: '' }))
      return
    }
    try {
      setSubmitting(true)
      const res = await uploadImage(file)
      const url = res?.secure_url || res?.url || ''
      if (!url) throw new Error('Failed to get upload URL')
      setFormData(prev => ({ ...prev, image: null, imageUrl: url }))
      setCurrentItem(prev => (prev ? { ...prev, imageUrl: url } : prev))
    } catch (err) {
      // Intentionally suppress toast notifications during image upload
    } finally {
      setSubmitting(false)
    }
  }

  const validateForm = () => {
    const errs = {}
    if (!formData.ctnNo?.trim()) errs.ctnNo = 'CTN No is required'
    if (!formData.productCode?.trim()) errs.productCode = 'Product Code is required'
    if (!formData.categoryId?.trim()) errs.categoryId = 'Category is required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting')
      return
    }

    const payload = new FormData()
    payload.append('ctnNo', formData.ctnNo.trim().toUpperCase())
    payload.append('productCode', formData.productCode.trim().toUpperCase())
    payload.append('categoryId', formData.categoryId)

    // If a new file was chosen, upload it first to Cloudinary to get URL
    if (formData.image) {
      const up = await uploadImage(formData.image)
      const url = up?.secure_url || up?.url
      if (url) payload.append('imageUrl', url)
    } else if (formData.imageUrl) {
      payload.append('imageUrl', formData.imageUrl)
    }

    try {
      setSubmitting(true)
      let saved
      if (modalType === 'create') {
        const res = await createItem(payload)
        saved = res?.item || res
        toast.success('Item created successfully!')
      } else if (modalType === 'edit' && currentItem?._id) {
        const res = await updateItem(currentItem._id, payload)
        saved = res?.item || res
        toast.success('Item updated successfully!')
      }

      if (saved && saved._id) {
        // Refresh list
        await fetchItems(searchTerm)
        if (modalType === 'create') {
          // Close the modal after creating an item
          closeModal()
        } else {
          // For edit, keep modal open and reflect saved data
          setCurrentItem(saved)
          setFormData(prev => ({ ...prev, image: null, imageUrl: saved.imageUrl || '' }))
        }
      }
    } catch (err) {
      if (err?.errors && typeof err.errors === 'object') {
        const mapped = {}
        Object.entries(err.errors).forEach(([key, val]) => {
          if (typeof val === 'string') mapped[key] = val
          else if (val && typeof val.message === 'string') mapped[key] = val.message
          else if (Array.isArray(val) && val.length > 0) mapped[key] = String(val[0])
        })
        setFormErrors((prev) => ({ ...prev, ...mapped }))
      }
      toast.error(err?.message || 'Failed to submit item')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (item) => {
    const label = item.productCode || item.ctnNo || 'this item'
    if (!window.confirm(`Are you sure you want to delete "${label}"?`)) return
    try {
      await deleteItem(item._id)
      toast.success('Item deleted successfully!')
      await fetchItems(searchTerm)
    } catch (err) {
      toast.error(err.message || 'Failed to delete item')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Item Management</h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by CTN No, product code or category..."
              className="w-full sm:w-72 pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTN No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No items found</td>
                  </tr>
                ) : (
                  filteredItems.map((it) => (
                    <tr key={it._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.ctnNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {it.category?.categoryName || it.category?.categoryCode || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.productCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {it.imageUrl ? (
                          <img
                            src={resolveImageUrl(it.imageUrl)}
                            alt={it.imageOriginalName || 'Item image'}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(it)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(it)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'create' ? 'Add Item' : 'Edit Item'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ctnNo" className="block text-sm font-medium text-gray-700">
                    CTN No<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="ctnNo"
                    name="ctnNo"
                    type="text"
                    value={formData.ctnNo}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.ctnNo ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g. CTN001"
                  />
                  {formErrors.ctnNo && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.ctnNo}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                    Category<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.categoryId ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.categoryName || cat.categoryCode}
                      </option>
                    ))}
                  </select>
                  {formErrors.categoryId && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.categoryId}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="productCode" className="block text-sm font-medium text-gray-700">
                    Product Code<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="productCode"
                    name="productCode"
                    type="text"
                    value={formData.productCode}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.productCode ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g. PRD001"
                  />
                  {formErrors.productCode && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.productCode}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Image (optional)
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 hover:file:bg-gray-200"
                  />
                  {(formData.imageUrl || currentItem?.imageUrl) && (
                    <div className="mt-2">
                      <span className="block text-xs text-gray-500 mb-1">Preview</span>
                      <img
                        src={
                          formData.imageUrl
                            ? resolveImageUrl(formData.imageUrl)
                            : currentItem?.imageUrl
                              ? resolveImageUrl(currentItem.imageUrl)
                              : undefined
                        }
                        alt="preview"
                        className="w-24 h-24 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                  {submitting ? 'Submitting...' : modalType === 'create' ? 'Create Item' : 'Update Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default ItemItems