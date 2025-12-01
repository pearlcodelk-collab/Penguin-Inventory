import React, { useEffect, useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService'

const ItemUpload = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create') // 'create' | 'edit'
  const [currentCategory, setCurrentCategory] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    categoryCode: '',
    categoryName: '',
    deptCode: '',
    deptName: '',
    sequence: ''
  })

  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchCategories('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced remote search
  useEffect(() => {
    const handle = setTimeout(() => {
      fetchCategories(searchTerm)
    }, 300)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  const fetchCategories = async (search) => {
    try {
      setLoading(true)
      const response = await getCategories(search)
      // Support either { categories: [...] } or direct array
      const list = Array.isArray(response) ? response : (response.categories || [])
      setCategories(list)
    } catch (err) {
      toast.error(err.message || 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories
    const term = searchTerm.toLowerCase()
    return categories.filter(c =>
      (c.categoryCode || '').toLowerCase().includes(term) ||
      (c.categoryName || '').toLowerCase().includes(term)
    )
  }, [categories, searchTerm])

  const openCreateModal = () => {
    setModalType('create')
    setCurrentCategory(null)
    setFormData({
      categoryCode: '',
      categoryName: '',
      deptCode: '',
      deptName: '',
      sequence: ''
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (category) => {
    setModalType('edit')
    setCurrentCategory(category)
    setFormData({
      categoryCode: category.categoryCode || '',
      categoryName: category.categoryName || '',
      deptCode: category.deptCode || '',
      deptName: category.deptName || '',
      sequence: category.sequence ?? ''
    })
    setFormErrors({})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setCurrentCategory(null)
    setFormErrors({})
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const errs = {}
    
    // Required field validations
    if (!formData.categoryCode?.trim()) {
      errs.categoryCode = 'Category Code is required'
    } else {
      // Check for duplicate Category Code (case-insensitive)
      const duplicateCode = categories.find(cat => 
        cat.categoryCode?.toUpperCase() === formData.categoryCode.trim().toUpperCase() &&
        cat._id !== currentCategory?._id
      )
      if (duplicateCode) {
        errs.categoryCode = 'Category Code already exists'
      }
    }
    
    if (!formData.categoryName?.trim()) {
      errs.categoryName = 'Category Name is required'
    } else {
      // Check for duplicate Category Name (case-insensitive)
      const duplicateName = categories.find(cat => 
        cat.categoryName?.toLowerCase() === formData.categoryName.trim().toLowerCase() &&
        cat._id !== currentCategory?._id
      )
      if (duplicateName) {
        errs.categoryName = 'Category Name already exists'
      }
    }
    
    if (!formData.deptCode?.trim()) errs.deptCode = 'Department Code is required'
    if (!formData.deptName?.trim()) errs.deptName = 'Department Name is required'
    
    if (formData.sequence === '' || formData.sequence === null || formData.sequence === undefined) {
      errs.sequence = 'Sequence Number is required'
    } else if (isNaN(Number(formData.sequence))) {
      errs.sequence = 'Sequence Number must be numeric'
    } else {
      // Check for duplicate Sequence Number
      const duplicateSequence = categories.find(cat => 
        cat.sequence === Number(formData.sequence) &&
        cat._id !== currentCategory?._id
      )
      if (duplicateSequence) {
        errs.sequence = 'Sequence Number already exists'
      }
    }
    
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting')
      return
    }

    const payload = {
      categoryCode: formData.categoryCode.trim(),
      categoryName: formData.categoryName.trim(),
      deptCode: formData.deptCode.trim(),
      deptName: formData.deptName.trim(),
      sequence: Number(formData.sequence)
    }

    try {
      setSubmitting(true)
      if (modalType === 'create') {
        await createCategory(payload)
        toast.success('Category created successfully!')
      } else if (modalType === 'edit' && currentCategory?._id) {
        await updateCategory(currentCategory._id, payload)
        toast.success('Category updated successfully!')
      }
      await fetchCategories(searchTerm)
      setTimeout(() => {
        closeModal()
      }, 500)
    } catch (err) {
      // Map backend validation errors if provided
      if (err?.errors && typeof err.errors === 'object') {
        const mapped = {}
        Object.entries(err.errors).forEach(([key, val]) => {
          if (typeof val === 'string') mapped[key] = val
          else if (val && typeof val.message === 'string') mapped[key] = val.message
          else if (Array.isArray(val) && val.length > 0) mapped[key] = String(val[0])
        })
        setFormErrors((prev) => ({ ...prev, ...mapped }))
      }
      toast.error(err?.message || 'Failed to submit category')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (category) => {
    const name = category.categoryName || category.categoryCode || 'this category'
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      await deleteCategory(category._id)
      toast.success('Category deleted successfully!')
      await fetchCategories(searchTerm)
    } catch (err) {
      toast.error(err.message || 'Failed to delete category')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by code or name..."
              className="w-full sm:w-64 pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Table */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sequence Number</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No categories found</td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.categoryCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.categoryName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.deptCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.deptName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.sequence}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
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

      {/* Add/Edit Category Modal - Popup overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'create' ? 'Add Category' : 'Edit Category'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="categoryCode" className="block text-sm font-medium text-gray-700">Category Code<span className="text-red-500">*</span></label>
                  <input
                    id="categoryCode"
                    name="categoryCode"
                    type="text"
                    value={formData.categoryCode}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.categoryCode ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g. CAT001"
                  />
                  {formErrors.categoryCode && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.categoryCode}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name<span className="text-red-500">*</span></label>
                  <input
                    id="categoryName"
                    name="categoryName"
                    type="text"
                    value={formData.categoryName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.categoryName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g. Electronics"
                  />
                  {formErrors.categoryName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.categoryName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="deptCode" className="block text-sm font-medium text-gray-700">Department Code<span className="text-red-500">*</span></label>
                  <input
                    id="deptCode"
                    name="deptCode"
                    type="text"
                    value={formData.deptCode}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.deptCode ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g. D001"
                  />
                  {formErrors.deptCode && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.deptCode}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="deptName" className="block text-sm font-medium text-gray-700">Department Name<span className="text-red-500">*</span></label>
                  <input
                    id="deptName"
                    name="deptName"
                    type="text"
                    value={formData.deptName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.deptName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g. Sales"
                  />
                  {formErrors.deptName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.deptName}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="sequence" className="block text-sm font-medium text-gray-700">Sequence Number<span className="text-red-500">*</span></label>
                  <input
                    id="sequence"
                    name="sequence"
                    type="number"
                    value={formData.sequence}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.sequence ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g. 1"
                  />
                  {formErrors.sequence && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.sequence}</p>
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
                  {submitting ? 'Submitting...' : modalType === 'create' ? 'Create Category' : 'Update Category'}
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

export default ItemUpload