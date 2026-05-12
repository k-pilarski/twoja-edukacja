import { useState, useEffect } from 'react';
import { CourseCard } from '../components/CourseCard';
import type { Course } from '../types';

export const Home = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/newest`);
        
        if (!response.ok) {
          throw new Error(`Błąd HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Błąd pobierania kursów:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Rozwijaj się z <span className="text-blue-600">Twoja Edukacja</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Odkryj kursy, które pomogą Ci zdobyć nowe umiejętności, napisać lepszy kod i awansować w karierze.
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Nasze najnowsze kursy</h2>
          </div>
          
          {isLoading ? (
            <p className="text-center text-gray-500">Ładowanie kursów...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500">
              Nie ma jeszcze żadnych kursów. (Albo żadne nie zostały jeszcze opublikowane!)
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};