import { createContext, useContext, useState } from 'react';
import { loginAPI } from '../services/authService';

const AuthContext = createContext(null);

// Demo users — used only when backend is not reachable
const DEMO_USERS = {
  'admin@clinic.com':        { id: '1', name: 'Dr. Ayesha Siddiqui', email: 'admin@clinic.com',        role: 'admin',        clinicName: 'Vision Care Clinic' },
  'receptionist@clinic.com': { id: '2', name: 'Sara Malik',           email: 'receptionist@clinic.com', role: 'receptionist', clinicName: 'Vision Care Clinic' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // Real login — calls backend API
  const login = async (email, password) => {
    // Demo shortcut (yellow buttons on login page)
    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser && password === 'demo123') {
      localStorage.setItem('token', 'demo-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }

    // Real backend login
    const { data } = await loginAPI(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // One-click demo login (yellow buttons)
  const demoLogin = (role = 'admin') => {
    const demoUser = role === 'admin'
      ? DEMO_USERS['admin@clinic.com']
      : DEMO_USERS['receptionist@clinic.com'];
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
    <AuthContext.Provider value={{ user, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
