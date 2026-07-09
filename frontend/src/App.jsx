import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import CourseViewer from './pages/CourseViewer';
import Register from './pages/Register';


// Pages Import 
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

// Unauthorized Page එකක් (Inline)
const Unauthorized = () => (
  <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
    <h1 className="text-4xl font-bold text-red-500 mb-2">Access Denied! 🛑</h1>
    <p className="text-slate-400">You do not have permission to view this page.</p>
  </div>
);

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* 1. Public Route  */}
        <Route path="/login" element={
          !user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
        } />

        {/* 2. Student Only Route */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        {/* 3. Admin Only Route */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* 4. Error Pages */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* 5. Default Fallback - */}
        <Route path="*" element={<Navigate to="/login" replace />} />

        <Route path="/course/:id" element={<CourseViewer />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}