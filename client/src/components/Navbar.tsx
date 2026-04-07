import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
              twoja<span className="text-gray-900">edukacja</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {token ? (
              <>
                {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                  <Link 
                    to="/dashboard" 
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Panel Instruktora
                  </Link>
                )}
                
                <span className="text-gray-500 text-sm hidden sm:block">
                  Witaj, {user?.firstName || 'użytkowniku'}!
                </span>
                
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-red-200"
                >
                  Wyloguj się
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Zaloguj się
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Zarejestruj się
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};