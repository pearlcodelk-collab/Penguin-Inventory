import api from './api';

// Super Admin Login
export const superAdminLogin = async (email, password) => {
    try {
        const response = await api.post('/users/super-admin/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

// User Login
export const userLogin = async (email, password) => {
    try {
        const response = await api.post('/users/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

// Change Password
export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await api.put('/users/change-password', { 
            currentPassword, 
            newPassword 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Password change failed' };
    }
};
