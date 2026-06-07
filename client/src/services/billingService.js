import api from './api';

export const getBillingAPI   = (params) => api.get('/billing', { params });
export const addBillAPI      = (data)   => api.post('/billing/add', data);
export const markPaidAPI     = (id, data) => api.put(`/billing/${id}/pay`, data);
export const getSummaryAPI   = (period)  => api.get('/billing/summary', { params: { period } });
