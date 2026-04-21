import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  // DEBUG: Odkomentuj poniższą linię, aby zobaczyć w konsoli przeglądarki, 
  // co React wie o Twoim użytkowniku:
  // console.log("Aktualny użytkownik:", user);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
              twoja<span className="text-gray-900">edukacja</span>
            </Link>
            
            <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
              Katalog Kursów
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {token ? (
              <>
                {/* WAŻNE: Upewnij się, że user.role jest dokładnie taki sam 
                   jak w bazie danych (np. 'INSTRUCTOR')
                */}
                {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                  <Link 
                    to="/dashboard" 
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-blue-100"
                  >
                    Panel Instruktora
                  </Link>
                )}
                
                <span className="text-gray-500 text-sm hidden sm:block">
                  {/* Jeśli firstName jest puste, spróbujmy wyświetlić chociaż email */}
                  Witaj, {user?.firstName || user?.email || 'użytkowniku'}!
                </span>
                
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-red-200"
                >
                  Wyloguj się
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                  Zaloguj się
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Zarejestruj się
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};