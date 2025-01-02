import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import EmergencyForm from './pages/EmergencyForm';
import HospitalMap from './pages/HospitalMap';
import HospitalManagement from './pages/HospitalManagement';
import PatientStatus from './pages/PatientStatus';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <EmergencyForm />
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <HospitalMap />
              </ProtectedRoute>
            } />
            <Route path="/management" element={
              <ProtectedRoute requireHospitalStaff>
                <HospitalManagement />
              </ProtectedRoute>
            } />
            <Route path="/status" element={
              <ProtectedRoute>
                <PatientStatus />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;