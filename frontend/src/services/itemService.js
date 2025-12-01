import api from './api';

const normalizeError = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status === 404) {
    return {
      message:
        'Items endpoint not found. Ensure backend has /api/items route and is running.',
      errors: undefined,
      status: 404,
    };
  }

  if (!error.response) {
    return {
      message:
        'Cannot connect to backend server. Please ensure the server is running.',
      errors: undefined,
      status: 0,
    };
  }

  if (typeof data === 'string') {
    return { message: data, status };
  }

  const message = data?.message || data?.error || 'Request failed';
  const errors =
    data?.errors && typeof data.errors === 'object' ? data.errors : undefined;
  return { message, errors, status };
};

export const getItems = async (searchTerm = '') => {
  try {
    const response = await api.get('/items', {
      params: searchTerm ? { search: searchTerm } : undefined,
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const createItem = async (formData) => {
  try {
    const response = await api.post('/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const updateItem = async (id, formData) => {
  try {
    const response = await api.put(`/items/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};


