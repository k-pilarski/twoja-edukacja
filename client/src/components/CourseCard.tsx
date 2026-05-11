import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();

  if (!course) return null;

  return (
    <div 
      onClick={() => navigate(`/course/${course.id}`)}
      className="flex flex-col overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer"
    >
      <div className="relative h-48 bg-gray-200">
        {course.thumbnailUrl ? (
          <img 
            src={course.thumbnailUrl} 
            alt={`Okładka kursu: ${course.title}`} // SEO & A11y: Lepszy alt
            loading="lazy" // PERF: Opóźnia ładowanie obrazka, aż user nie przescrolluje blisko niego
            width="400"  // PERF: Zapobiega "skakaniu" strony (Layout Shift)
            height="192" // PERF: Zgadza się proporcją z h-48
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            Brak okładki
          </div>
        )}
        <span className="absolute px-2 py-1 text-xs text-white bg-blue-600 rounded top-2 right-2">
          {course.category?.name || 'Inne'}
        </span>
      </div>

      <div className="flex flex-col grow p-5">
        <h3 className="mb-2 text-xl font-bold text-gray-800 line-clamp-2" title={course.title}>
          {course.title}
        </h3>
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {course.description}
        </p>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Autor: <span className="font-semibold">{course.instructor?.user?.firstName} {course.instructor?.user?.lastName}</span>
          </div>
          <div className="text-lg font-bold text-green-600">
            {Number(course.price) > 0 ? `${course.price} zł` : 'Za darmo'}
          </div>
        </div>
      </div>
    </div>
  );
};