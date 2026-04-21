import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CoursePreview } from './pages/CoursePreview';

// IMPORTUJEMY NASZ NOWY KATALOG
import { CoursesCatalog } from './pages/CoursesCatalog'; 

import { Navbar } from './components/Navbar'; 
import { InstructorDashboard } from './components/InstructorDashboard';
import { CourseManager } from './components/CourseManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar będzie widoczny na każdej podstronie */}
        <Navbar /> 
        
        <main className="min-h-screen bg-gray-50">
          <Routes>
            {/* ZMIANA: Zamiast starego <Home />, 
              teraz na wejściu (/) mamy nasz nowy katalog kursów z filtrami 
            */}
            <Route path="/" element={<CoursesCatalog />} />
            
            <Route path="/course/:id" element={<CoursePreview />} />
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