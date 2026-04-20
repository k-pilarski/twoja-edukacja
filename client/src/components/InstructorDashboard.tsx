import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Zaktualizowana definicja typu o pole isPublished
interface Course {
  id: number;
  title: string;
  price: number;
  isPublished: boolean; // Nowe pole
  category: { name: string };
  _count: { lessons: number };
}

export const InstructorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchCourses();
  }, []);

  // Nowa funkcja do przełączania statusu publikacji
  const handleTogglePublish = async (courseId: number, currentStatus: boolean) => {
    const token = localStorage.getItem('jwt_token');
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/toggle-publish`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Aktualizujemy stan lokalnie, żeby UI od razu zareagował
        setCourses(prevCourses =>
          prevCourses.map(course =>
            course.id === courseId
              ? { ...course, isPublished: !currentStatus }
              : course
          )
        );
      } else {
        alert('Nie udało się zmienić statusu publikacji.');
      }
    } catch (error) {
      console.error('Błąd podczas zmiany statusu:', error);
      alert('Wystąpił błąd połączenia z serwerem.');
    }
  };

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
            <div key={course.id} className="border rounded-lg p-5 shadow-sm bg-white flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
                  {/* Mały badge statusu */}
                  <span className={`text-[10px] uppercase px-2 py-1 rounded font-bold ${
                    course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {course.isPublished ? 'Publiczny' : 'Szkic'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Kategoria: {course.category?.name || 'Brak'}</p>
                <p className="text-sm text-gray-500 mb-4">Liczba lekcji: {course._count?.lessons || 0}</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-green-600">{course.price} PLN</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {/* Dynamiczny przycisk publikacji */}
                  <button
                    onClick={() => handleTogglePublish(course.id, course.isPublished)}
                    className={`text-xs py-2 rounded font-semibold transition ${
                      course.isPublished 
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {course.isPublished ? 'Wycofaj' : 'Opublikuj'}
                  </button>

                  <button 
                    onClick={() => navigate(`/edit-course/${course.id}`)}
                    className="bg-gray-100 text-gray-800 text-xs py-2 rounded hover:bg-gray-200 transition border border-gray-200"
                  >
                    Edytuj
                  </button>
                </div>
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