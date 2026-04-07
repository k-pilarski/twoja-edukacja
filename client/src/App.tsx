import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CoursePreview } from './pages/CoursePreview';

// Importujemy nowe komponenty z folderu components
import { InstructorDashboard } from './components/InstructorDashboard';
import { CourseManager } from './components/CourseManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Trasy publiczne */}
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CoursePreview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Trasy chronione (Tylko dla zalogowanych) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <InstructorDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/create-course" 
            element={
              <ProtectedRoute>
                <CourseManager />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/edit-course/:id" 
            element={
              <ProtectedRoute>
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