import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, Settings } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            🎓 StudentClubs
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/clubs"
              className={`transition-colors ${
                location.pathname === '/clubs'
                  ? 'text-primary font-semibold'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Clubs
            </Link>
            <Link
              to="/events"
              className={`transition-colors ${
                location.pathname === '/events'
                  ? 'text-primary font-semibold'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Events
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'text-primary font-semibold'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className={`transition-colors ${
                    location.pathname === '/chat'
                      ? 'text-primary font-semibold'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Chat
                </Link>
              </>
            )}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-sm">{user.firstName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <img
                  src={user.profileImage || 'https://via.placeholder.com/40'}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full"
                />
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t">
            <Link
              to="/clubs"
              className="block py-2 text-gray-600 hover:text-primary"
            >
              Clubs
            </Link>
            <Link
              to="/events"
              className="block py-2 text-gray-600 hover:text-primary"
            >
              Events
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-gray-600 hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className="block py-2 text-gray-600 hover:text-primary"
                >
                  Chat
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  to="/login"
                  className="text-center py-2 border border-primary text-primary rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center py-2 btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
