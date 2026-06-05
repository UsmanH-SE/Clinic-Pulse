import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages - Auth
import LoginPage from './pages/auth/LoginPage';

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

// Pages - Public
import BookingPortal from './pages/booking/BookingPortal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/book" element={<BookingPortal />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Staff Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><AppointmentsList /></ProtectedRoute>} />
          <Route path="/appointments/new" element={<ProtectedRoute><NewAppointment /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><PatientsList /></ProtectedRoute>} />
          <Route path="/patients/add" element={<ProtectedRoute><AddPatient /></ProtectedRoute>} />
          <Route path="/patients/:id" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><BillingList /></ProtectedRoute>} />

          {/* Admin Only Routes */}
          <Route path="/analytics" element={<ProtectedRoute adminOnly><AnalyticsDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
