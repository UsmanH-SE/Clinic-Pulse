import api from './api';

export const loginAPI      = (email, password) => api.post('/auth/login', { email, password });
export const registerAPI   = (data)            => api.post('/auth/register', data);
export const getMeAPI      = ()                => api.get('/auth/me');
export const addStaffAPI   = (data)            => api.post('/auth/add-staff', data);
export const getStaffAPI   = ()                => api.get('/auth/staff');
export const toggleStaffAPI= (id)              => api.put(`/auth/staff/${id}/toggle`);
