import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Course, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { SecureImage } from '../components/SecureImage';

export const LessonPlayer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { token, user, isLoading: authLoading } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          navigate('/');
          return;
        }

        const isInstructor = user && data.instructor?.userId === user.id;
        const isAdmin = user && user.role === 'ADMIN';
        const hasAccess = data.isPurchased || Number(data.price) === 0 || isInstructor || isAdmin;

        if (!hasAccess) {
          alert('Musisz wykupić ten kurs, aby uzyskać do niego dostęp.');
          navigate(`/course/${courseId}`);
          return;
        }

        setCourse(data);
        if (!lessonId && data.lessons?.length > 0) {
          const firstLesson = data.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order)[0];
          navigate(`/course/${courseId}/learn/${firstLesson.id}`, { replace: true });
        }
      });
  }, [courseId, lessonId, navigate, token, user, authLoading]);

  useEffect(() => {
    if (token) {
      fetch(`h${import.meta.env.VITE_API_URL}/api/progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        const completedIds = data
          .filter((p: any) => p.isCompleted)
          .map((p: any) => p.lessonId);
        setCompletedLessons(completedIds);
      });
    }
  }, [token]);

  const markAsCompleted = async (id: number) => {
    if (!token) return;
    setIsLoadingProgress(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/progress/${id}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCompletedLessons(prev => [...new Set([...prev, id])]);
      }
    } catch (error) {
      console.error("Błąd zapisywania postępu:", error);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  if (!course) return <div className="p-8 text-center">Ładowanie odtwarzacza...</div>;

  const sortedLessons = course.lessons?.sort((a, b) => a.order - b.order) || [];
  const currentLesson = sortedLessons.find(l => l.id === Number(lessonId)) || sortedLessons[0];
  
  const progressPercentage = sortedLessons.length 
    ? Math.round((completedLessons.filter(id => sortedLessons.map(l => l.id).includes(id)).length / sortedLessons.length) * 100) 
    : 0;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* SIDEBAR */}
      <div className="flex flex-col w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="mb-2 text-lg font-bold">{course.title}</h2>
          
          <div className="w-full h-2.5 mb-1 bg-gray-200 rounded-full">
            <div className="h-2.5 transition-all duration-500 bg-green-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <span className="text-xs font-medium text-gray-500">Ukończono {progressPercentage}%</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sortedLessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isActive = currentLesson?.id === lesson.id;

            return (
              <div 
                key={lesson.id} 
                onClick={() => navigate(`/course/${courseId}/learn/${lesson.id}`)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition flex items-center gap-3
                  ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0
                  ${isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {isCompleted && <span className="text-xs font-bold text-white">✓</span>}
                </div>
                
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
                    {index + 1}. {lesson.title}
                  </p>
                  <p className="text-xs text-gray-500">{lesson.durationMin} min • {lesson.contentType === 'VIDEO' ? 'Wideo' : 'Tekst'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GŁÓWNY OBSZAR ODTWARZACZA */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {currentLesson ? (
          <>
            {/* ODTWARZACZ (Pojawia się tylko dla wideo) */}
            {currentLesson.contentType === 'VIDEO' && (
              <div className="flex items-center justify-center w-full bg-black aspect-video">
                {currentLesson.videoUrl || currentLesson.contentPath ? (
                  <VideoPlayer videoUrl={currentLesson.videoUrl} contentPath={currentLesson.contentPath} />
                ) : (
                  <div className="text-gray-400">Brak wideo do odtworzenia.</div>
                )}
              </div>
            )}

            {/* OBRAZEK (Pojawia się tylko dla obrazków) */}
            {currentLesson.contentType === 'IMAGE' && currentLesson.contentPath && (
              <div className="w-full max-w-4xl p-8 mx-auto pb-0">
                <SecureImage contentPath={currentLesson.contentPath} />
              </div>
            )}
            
            <div className="w-full max-w-4xl p-8 mx-auto">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{currentLesson.title}</h2>
                
                {!completedLessons.includes(currentLesson.id) ? (
                  <button 
                    onClick={() => markAsCompleted(currentLesson.id)}
                    disabled={isLoadingProgress}
                    className="px-6 py-2 font-medium text-white transition bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoadingProgress ? 'Zapisywanie...' : 'Oznacz jako ukończone'}
                  </button>
                ) : (
                  <span className="flex items-center gap-2 px-4 py-2 font-medium text-green-800 bg-green-100 rounded-lg">
                    <span className="font-bold">✓</span> Ukończono
                  </span>
                )}
              </div>
              
              {/* TREŚĆ TEKSTOWA LUB OPIS LEKCJI */}
              {currentLesson.contentType !== 'IMAGE' && (
                <div className="max-w-none text-gray-700 prose mt-4">
                  {currentLesson.contentPath ? (
                     <div 
                       className="whitespace-pre-wrap leading-relaxed quill-content"
                       dangerouslySetInnerHTML={{ __html: currentLesson.contentPath }}
                     />
                  ) : (
                     <p className="italic text-gray-400">Brak dodatkowej treści dla tej lekcji.</p>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Wybierz lekcję z menu bocznego
          </div>
        )}
      </div>
    </div>
  );
};