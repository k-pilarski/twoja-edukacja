import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CoursePreview } from './pages/CoursePreview';
import { CoursesCatalog } from './pages/CoursesCatalog'; 
import { Navbar } from './components/Navbar'; 
import { InstructorDashboard } from './components/InstructorDashboard';
import { CourseManager } from './components/CourseManager';

// IMPORT ODTWARZACZA
import { LessonPlayer } from './pages/LessonPlayer';

// IMPORT CHECKOUTU
import { Checkout } from './pages/Checkout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> 
        
        <main className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<CoursesCatalog />} />
            <Route path="/course/:id" element={<CoursePreview />} />
            
            {/* NOWA TRASA: KOSZYK / PODSUMOWANIE ZAMÓWIENIA (wymaga logowania) */}
            <Route 
              path="/checkout/:courseId" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            
            {/* TRASA: ODTWARZACZ LEKCJI (wymaga logowania) */}
            <Route 
              path="/course/:courseId/learn/:lessonId?" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                  <LessonPlayer />
                </ProtectedRoute>
              } 
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* TRASY CHRONIONE DLA INSTRUKTORA */}
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
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;