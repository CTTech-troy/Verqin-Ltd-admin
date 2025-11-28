import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardOverview from './pages/DashboardOverview';
import ApplicationsPage from './pages/ApplicationsPage';
import EmployersPage from './pages/EmployersPage';
import CandidatesPage from './pages/CandidatesPage';
import ContactPage from './pages/ContactPage';
import SettingsPage from './pages/SettingsPage';
import ApplicationDetailsPage from './pages/ApplicationDetailsPage';
function App() {
  return <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/dashboard" element={<ProtectedRoute>
                <DashboardLayout>
                  <DashboardOverview />
                </DashboardLayout>
              </ProtectedRoute>} />

          <Route path="/dashboard/applications" element={<ProtectedRoute>
                <DashboardLayout>
                  <ApplicationsPage />
                </DashboardLayout>
              </ProtectedRoute>} />

          <Route path="/applications/:id" element={<ProtectedRoute>
                <DashboardLayout>
                  <ApplicationDetailsPage />
                </DashboardLayout>
              </ProtectedRoute>} />

          <Route path="/dashboard/employers" element={<ProtectedRoute>
                <DashboardLayout>
                  <EmployersPage />
                </DashboardLayout>
              </ProtectedRoute>} />

          <Route path="/dashboard/candidates" element={<ProtectedRoute>
                <DashboardLayout>
                  <CandidatesPage />
                </DashboardLayout>
              </ProtectedRoute>} />

          <Route path="/dashboard/contact" element={<ProtectedRoute>
                <DashboardLayout>
                  <ContactPage />
                </DashboardLayout>
              </ProtectedRoute>} />

          <Route path="/dashboard/settings" element={<ProtectedRoute>
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              </ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>;
}

export default App