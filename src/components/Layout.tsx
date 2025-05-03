
import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Top Bangladeshi Companies' }) => {
  const isAdmin = isAuthenticated();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <Link to="/" className="text-2xl font-bold">
              BD Companies
            </Link>
            <p className="text-xs opacity-80">Top Bangladeshi Business Entities</p>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              {isAdmin ? (
                <>
                  <li>
                    <Link to="/admin" className="hover:underline">Admin Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/logout" className="hover:underline">Logout</Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="hover:underline">Admin Login</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Page title */}
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} - Top Bangladeshi Companies</p>
          <p className="text-xs mt-1">CSE 3206: Web Engineering - 3rd Year 2nd Semester</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
