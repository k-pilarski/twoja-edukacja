import { CourseCard } from '../components/CourseCard';

// Tymczasowe dane (mocki) do zaprezentowania prototypu
const MOCK_COURSES = [
  { id: 1, title: 'Programowanie w React od podstaw', description: 'Poznaj najpopularniejszą bibliotekę do tworzenia UI. Zbuduj z nami swoją pierwszą aplikację Single Page Application.', price: 299 },
  { id: 2, title: 'Zaawansowany Node.js & Express', description: 'Naucz się budować bezpieczne i skalowalne REST API. JWT, autoryzacja i middleware w praktyce.', price: 199 },
  { id: 3, title: 'Bazy danych z Prisma ORM', description: 'Zrozum relacje, migracje i pisz optymalne zapytania do PostgreSQL używając TypeScriptu.', price: 249 },
  { id: 4, title: 'Opanuj TailwindCSS', description: 'Przestań pisać nudny CSS. Twórz nowoczesne, responsywne interfejsy w mgnieniu oka.', price: 149 },
];

export const Home = () => {
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_COURSES.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description}
                price={course.price}
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
};