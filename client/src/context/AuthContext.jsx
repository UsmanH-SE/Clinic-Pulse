import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Demo users for frontend preview (removed when backend is connected)
const DEMO_USERS = {
  'admin@clinic.com':        { id: '1', name: 'Dr. Ayesha Siddiqui', email: 'admin@clinic.com',        role: 'admin',        clinicName: 'Vision Care Clinic' },
  'receptionist@clinic.com': { id: '2', name: 'Sara Malik',           email: 'receptionist@clinic.com', role: 'receptionist', clinicName: 'Vision Care Clinic' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    // --- DEMO MODE: works without backend ---
    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser && password === 'demo123') {
      const fakeToken = 'demo-token-' + Date.now();
      localStorage.setItem('token', fakeToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
    // --- REAL MODE: calls backend (when built) ---
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw err;
    }
  };

  const demoLogin = (role = 'admin') => {
    const demoUser = role === 'admin' ? DEMO_USERS['admin@clinic.com'] : DEMO_USERS['receptionist@clinic.com'];
    localStorage.setItem('token', 'demo-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
