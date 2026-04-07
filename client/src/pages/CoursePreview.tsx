import { useParams, Link } from 'react-router-dom';

export const CoursePreview = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Podgląd kursu (ID: {id})</h1>
      <p className="text-gray-600 mb-8">Widok szczegółów kursu dla studenta dodamy w kolejnych taskach!</p>
      <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Wróć na stronę główną
      </Link>
    </div>
  );
};