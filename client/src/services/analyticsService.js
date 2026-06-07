import api from './api';

export const getOverviewAPI   = () => api.get('/analytics/overview');
export const getTrendsAPI     = () => api.get('/analytics/trends');
export const getBusySlotsAPI  = () => api.get('/analytics/busy-slots');
export const getNoShowTrendAPI = () => api.get('/analytics/no-show-trend');
