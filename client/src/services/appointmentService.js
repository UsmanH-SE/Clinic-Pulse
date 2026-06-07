import api from './api';

export const getAppointmentsAPI   = (params) => api.get('/appointments', { params });
export const getTodayAPI           = ()       => api.get('/appointments/today');
export const bookAppointmentAPI    = (data)   => api.post('/appointments/book', data);
export const updateStatusAPI       = (id, data) => api.put(`/appointments/${id}/status`, data);
export const deleteAppointmentAPI  = (id)     => api.delete(`/appointments/${id}`);

export const getClinicAPI          = ()       => api.get('/clinic');
export const getSlotsAPI           = (date)   => api.get('/appointments/slots', { params: { date } });
