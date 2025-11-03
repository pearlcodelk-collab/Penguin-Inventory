import api from './api';

// Create User
export const createUser = async (userData) => {
    try {
        const response = await api.post('/users/create', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create user' };
    }
};

// Get All Users
export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch users' };
    }
};

// Get User By ID
export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch user' };
    }
};

// Update User
export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update user' };
    }
};

// Delete User (Deactivate)
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete user' };
    }
};
