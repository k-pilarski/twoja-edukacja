import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CoursePreview } from './pages/CoursePreview';

import { Navbar } from './components/Navbar'; 
import { InstructorDashboard } from './components/InstructorDashboard';
import { CourseManager } from './components/CourseManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> 
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CoursePreview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/create-course" 
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <CourseManager />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/edit-course/:id" 
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <CourseManager />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;