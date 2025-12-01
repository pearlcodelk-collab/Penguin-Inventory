import api from './api';

const normalizeError = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  // Handle 404 specifically with helpful message
  if (status === 404) {
    return {
      message: 'Backend API endpoint not found. Please ensure your backend server is running and has category routes configured at /api/categories',
      errors: undefined,
      status: 404
    };
  }

  // If backend returned a string
  if (typeof data === 'string') {
    return { message: data, status };
  }

  // Common shapes
  const message = data?.message || data?.error || 'Request failed';
  const errors = data?.errors && typeof data.errors === 'object' ? data.errors : undefined;
  return { message, errors, status };
};

// Fetch Categories with optional search
export const getCategories = async (searchTerm = '') => {
  try {
    const response = await api.get('/categories', {
      params: searchTerm ? { search: searchTerm } : undefined
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

// Create Category
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    // Enhanced error handling
    if (!error.response) {
      // Network error - backend not reachable
      throw {
        message: 'Cannot connect to backend server. Please ensure the server is running on http://localhost:3000',
        errors: undefined,
        status: 0
      };
    }
    throw normalizeError(error);
  }
};

// Update Category
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    // If PUT returns 405, try PATCH
    if (error?.response?.status === 405) {
      try {
        const response = await api.patch(`/categories/${id}`, categoryData);
        return response.data;
      } catch (patchError) {
        throw normalizeError(patchError);
      }
    }
    throw normalizeError(error);
  }
};

// Delete Category
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};


