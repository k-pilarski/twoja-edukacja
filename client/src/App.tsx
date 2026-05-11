import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar'; 
import { CoursesCatalog } from './pages/CoursesCatalog'; 

const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const CoursePreview = lazy(() => import('./pages/CoursePreview').then(m => ({ default: m.CoursePreview })));
const LessonPlayer = lazy(() => import('./pages/LessonPlayer').then(m => ({ default: m.LessonPlayer })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const InstructorDashboard = lazy(() => import('./components/InstructorDashboard').then(m => ({ default: m.InstructorDashboard })));
const CourseManager = lazy(() => import('./components/CourseManager').then(m => ({ default: m.CourseManager })));

// Prosty ekran ładowania podczas przechodzenia między "ciężkimi" widokami
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> 
        
        <main className="min-h-screen bg-gray-50">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<CoursesCatalog />} />
              <Route path="/course/:id" element={<CoursePreview />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* TRASY CHRONIONE: STUDENT */}
              <Route 
                path="/checkout/:courseId" 
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/course/:courseId/learn/:lessonId?" 
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                    <LessonPlayer />
                  </ProtectedRoute>
                } 
              />

              {/* TRASY CHRONIONE: INSTRUKTOR */}
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
          </Suspense>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;