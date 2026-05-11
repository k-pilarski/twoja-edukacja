import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const CoursePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [course, setCourse] = useState<any | null>(null);

  const fetchCourse = () => {
    console.log("Wysyłam zapytanie o kurs z tokenem:", token ? "TAK" : "NIE");
    
    fetch(`http://127.0.0.1:5000/api/courses/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        console.log("Dane otrzymane z serwera:", data);
        setCourse(data);
      })
      .catch(err => console.error("Błąd połączenia z API:", err));
  };

  useEffect(() => {
    fetchCourse();
  }, [id, token]);

  useEffect(() => {
    const isSuccess = searchParams.get('success');
    if (isSuccess && token && course) {
      fetch('http://127.0.0.1:5000/api/payments/academic-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: course.id })
      })
      .then(() => {
        alert('Dostęp przyznany!');
        setSearchParams({});
        fetchCourse(); // Odświeżamy dane, by przycisk zmienił się na "Oglądaj"
      });
    }
  }, [searchParams, token, course]);

  // Funkcja wchodzenia do konkretnej lekcji
  const navigateToLesson = (lessonId?: number) => {
    if (course?.isPurchased || course?.price === 0) {
      const target = lessonId ? `?lessonId=${lessonId}` : '';
      navigate(`/course/${course.id}/learn${target}`);
    } else {
      alert("Musisz najpierw wykupić kurs, aby zobaczyć lekcje.");
    }
  };

  if (!course) return <div className="p-8 text-center">Ładowanie...</div>;

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <div className="p-8 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h1 className="mb-4 text-3xl font-bold">{course.title}</h1>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="block text-sm text-gray-500 uppercase font-bold">Status</span>
            <span className={`text-xl font-bold ${course.isPurchased ? 'text-green-600' : 'text-blue-600'}`}>
              {course.isPurchased ? "✅ POSIADANY" : `${course.price} PLN`}
            </span>
          </div>
          
          <button 
            onClick={() => course.isPurchased ? navigateToLesson() : navigate(`/checkout/${course.id}`)}
            className={`px-8 py-3 font-bold text-white transition rounded-lg ${
              course.isPurchased ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {course.isPurchased ? 'Zacznij naukę' : 'Kup dostęp'}
          </button>
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-bold text-gray-800">Program kursu</h2>
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="divide-y">
          {course.lessons?.sort((a: any, b: any) => a.order - b.order).map((lesson: any, index: number) => (
            <div 
              key={lesson.id} 
              onClick={() => navigateToLesson(lesson.id)} // TERAZ MOŻNA KLIKNĄĆ W LEKCJĘ
              className={`flex items-center justify-between p-5 transition cursor-pointer hover:bg-blue-50 group`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-bold text-gray-400 group-hover:bg-blue-200 group-hover:text-blue-600">
                  {index + 1}
                </span>
                <span className="font-semibold text-gray-700 group-hover:text-blue-700">{lesson.title}</span>
              </div>
              <span className="text-gray-400 text-sm font-medium">{lesson.durationMin} min</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};