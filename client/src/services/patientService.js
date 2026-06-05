import api from './api';

export const getPatients       = (params) => api.get('/patients', { params });
export const addPatientAPI     = (data)   => api.post('/patients/add', data);
export const getPatientAPI     = (id)     => api.get(`/patients/${id}`);
export const updatePatientAPI  = (id, data) => api.put(`/patients/${id}`, data);
export const getPatientHistory = (id)     => api.get(`/patients/${id}/history`);
export const deletePatientAPI  = (id)     => api.delete(`/patients/${id}`);
