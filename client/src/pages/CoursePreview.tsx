import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Course } from '../types';
import { useAuth } from '../context/AuthContext';

export const CoursePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!course) return <div className="p-8 text-center">Ładowanie kursu...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.description}</p>
        
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div>
            <span className="block text-sm text-gray-500">Instruktor</span>
            {/* POPRAWKA: odwołanie do zagnieżdżonego user */}
            <span className="font-medium">
              {course.instructor?.user.firstName} {course.instructor?.user.lastName}
            </span>
          </div>
          <div>
            <span className="block text-sm text-gray-500">Cena</span>
            <span className="font-bold text-xl text-blue-600">{course.price} PLN</span>
          </div>
          <button 
            // POPRAWKA: Zmiana z /courses na /course żeby pasowało do App.tsx
            onClick={() => navigate(`/course/${course.id}/learn`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {token ? 'Rozpocznij naukę' : 'Zaloguj się, by uczyć'}
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Program kursu</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
        {course.lessons?.sort((a, b) => a.order - b.order).map((lesson, index) => (
          <div key={lesson.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
            <span className="font-medium text-gray-800">
              {index + 1}. {lesson.title}
            </span>
            <span className="text-sm text-gray-500">{lesson.durationMin} min</span>
          </div>
        ))}
        {!course.lessons?.length && <div className="p-4 text-gray-500">Brak lekcji w tym kursie.</div>}
      </div>
    </div>
  );
};