import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Definicja typów, żeby TypeScript nie krzyczał
interface Course {
  id: number;
  title: string;
  price: number;
  category: { name: string };
  _count: { lessons: number };
}

export const InstructorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('jwt_token');
      try {
        const response = await fetch('http://localhost:5000/api/courses/my-courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Błąd pobierania kursów', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Sekcja Info o koncie */}
      <div className="flex justify-between items-center bg-gray-100 p-6 rounded-lg shadow-sm mb-8">
        <div>
          <h1 className="text-2xl font-bold">Panel Instruktora</h1>
          <p className="text-gray-600">Zarządzaj swoimi kursami i dodawaj nowe materiały.</p>
        </div>
        <button 
          onClick={() => navigate('/create-course')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          + Utwórz nowy kurs
        </button>
      </div>

      {/* Lista kursów */}
      <h2 className="text-xl font-semibold mb-4">Twoje kursy ({courses.length})</h2>
      
      {loading ? (
        <p>Ładowanie kursów...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="border rounded-lg p-5 shadow-sm bg-white">
              <h3 className="font-bold text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-1">Kategoria: {course.category?.name || 'Brak'}</p>
              <p className="text-sm text-gray-500 mb-4">Liczba lekcji: {course._count?.lessons || 0}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-green-600">{course.price} PLN</span>
                <button 
                  onClick={() => navigate(`/edit-course/${course.id}`)}
                  className="bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300"
                >
                  Edytuj
                </button>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="col-span-full text-gray-500">Nie masz jeszcze żadnych kursów. Kliknij przycisk wyżej, aby stworzyć pierwszy!</p>
          )}
        </div>
      )}
    </div>
  );
};