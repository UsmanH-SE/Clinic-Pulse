import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages - Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Pages - Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Pages - Appointments
import AppointmentsList from './pages/appointments/AppointmentsList';
import NewAppointment from './pages/appointments/NewAppointment';

// Pages - Patients
import PatientsList from './pages/patients/PatientsList';
import PatientProfile from './pages/patients/PatientProfile';
import AddPatient from './pages/patients/AddPatient';

// Pages - Billing
import BillingList from './pages/billing/BillingList';

// Pages - Analytics (Admin only)
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';

// Pages - Settings
import StaffManagement from './pages/settings/StaffManagement';

// Pages - Public
import BookingPortal from './pages/booking/BookingPortal';
import LandingPage from './pages/landing/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/book" element={<BookingPortal />} />
          <Route path="/book/:clinicId" element={<BookingPortal />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Staff Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><AppointmentsList /></ProtectedRoute>} />
          <Route path="/appointments/new" element={<ProtectedRoute><NewAppointment /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><PatientsList /></ProtectedRoute>} />
          <Route path="/patients/add" element={<ProtectedRoute><AddPatient /></ProtectedRoute>} />
          <Route path="/patients/:id" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><BillingList /></ProtectedRoute>} />

          {/* Admin Only Routes */}
          <Route path="/analytics" element={<ProtectedRoute adminOnly><AnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute adminOnly><StaffManagement /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
