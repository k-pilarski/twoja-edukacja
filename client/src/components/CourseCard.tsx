import React from 'react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Zabezpieczenie przed błędem "Cannot read properties of undefined"
  if (!course) return null;

  return (
    <div className="flex flex-col overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
      {/* Miniaturka kursu */}
      <div className="relative h-48 bg-gray-200">
        {course.thumbnailUrl ? (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            Brak okładki
          </div>
        )}
        {/* Plakietka z kategorią */}
        <span className="absolute px-2 py-1 text-xs text-white bg-blue-600 rounded top-2 right-2">
          {course.category?.name || 'Inne'}
        </span>
      </div>

      {/* Treść karty */}
      <div className="flex flex-col grow p-5">
        <h3 className="mb-2 text-xl font-bold text-gray-800 line-clamp-2">
          {course.title}
        </h3>
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {course.description}
        </p>

        {/* Stopka karty */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Autor: <span className="font-semibold">{course.instructor?.user?.firstName} {course.instructor?.user?.lastName}</span>
          </div>
          <div className="text-lg font-bold text-green-600">
            {course.price > 0 ? `${course.price} zł` : 'Za darmo'}
          </div>
        </div>
      </div>
    </div>
  );
};