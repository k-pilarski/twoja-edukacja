import React, { useState, useEffect } from 'react';
import { CourseCard } from '../components/CourseCard';
import type { Course, PaginationData } from '../types';

export const CoursesCatalog: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  // NOWY STAN: Paginacja
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [page, setPage] = useState(1);
  const limit = 6; // Ilość kursów na stronę (możesz zmienić)

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Stany filtrów
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.append('search', search);
      if (categoryId) queryParams.append('categoryId', categoryId);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
      
      // Dodajemy parametry stronicowania do URL
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      const response = await fetch(`http://localhost:5000/api/courses?${queryParams.toString()}`);
      
      if (!response.ok) throw new Error('Nie udało się pobrać kursów.');
      
      const data = await response.json();
      
      // Zmiana: teraz backend zwraca obiekt { courses, pagination }
      setCourses(data.courses || []);
      setPagination(data.pagination || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Jeśli użytkownik zmieni jakikolwiek filtr (np. wpisze coś w wyszukiwarkę), wracamy na stronę 1
  useEffect(() => {
    setPage(1);
  }, [search, categoryId, minPrice, maxPrice]);

  // Nasłuchujemy na zmianę filtrów ORAZ strony (page)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourses();
    }, 400); 

    return () => clearTimeout(delayDebounceFn);
  }, [search, categoryId, minPrice, maxPrice, page]);

  return (
    <div className="max-w-7xl px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Katalog Kursów</h1>

      {/* PASEK FILTRÓW */}
      <div className="grid grid-cols-1 gap-4 p-4 mb-8 bg-white rounded-lg shadow md:grid-cols-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Wyszukiwarka</label>
          <input 
            type="text" 
            placeholder="Np. React, JavaScript..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Kategoria</label>
          <select 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wszystkie</option>
            <option value="1">Programowanie</option>
            <option value="2">Design</option>
            <option value="3">Biznes</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Cena min. (PLN)</label>
          <input 
            type="number" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Cena max. (PLN)</label>
          <input 
            type="number" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* SIATKA KURSÓW */}
      {loading ? (
        <div className="py-10 text-center">
          <p className="text-gray-500 animate-pulse">Ładowanie katalogu...</p>
        </div>
      ) : error ? (
        <div className="py-10 text-center text-red-500">
          <p>Wystąpił błąd: {error}</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          Nie znaleźliśmy kursów o takich parametrach.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* KONTROLKI PAGINACJI */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 text-sm font-medium transition bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Poprzednia
              </button>
              
              <span className="text-sm font-medium text-gray-700">
                Strona {pagination.currentPage} z {pagination.totalPages}
              </span>
              
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                className="px-4 py-2 text-sm font-medium transition bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Następna
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};