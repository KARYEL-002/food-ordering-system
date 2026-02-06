import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdShoppingCart, MdAccountCircle } from 'react-icons/md';

const Navbar = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <nav style={{backgroundColor: '#FFFDF1', fontFamily: 'Montserrat, sans-serif'}} className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img src="/images/food-hub-logo.png" alt="FoodHub Logo" className="h-28 w-auto" />
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav style={{backgroundColor: '#FFFDF1', fontFamily: 'Montserrat, sans-serif'}} className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center">
              <img src="/images/food-hub-logo.png" alt="FoodHub Logo" className="h-28 w-auto" />
            </Link>
          </div>

          {/* Right Side - Menu Links and Cart */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-800 hover:text-amber-900 font-bold transition-colors"
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-gray-800 hover:text-amber-900 font-bold transition-colors"
            >
              Menu
            </Link>
            {isAuthenticated && user ? (
              <span className="text-gray-800 font-bold">
                Welcome, {user.name.split(' ')[0]}
              </span>
            ) : (
              <Link
                to="/login"
                className="text-gray-800 hover:text-amber-900 font-bold transition-colors"
              >
                Login/Sign up
              </Link>
            )}
            
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="text-amber-900 hover:text-amber-700 transition-colors"
            >
              <MdShoppingCart className="w-6 h-6" />
            </Link>

            {/* Account Dropdown */}
            {isAuthenticated && user && (
              <div 
                ref={dropdownRef}
                className="relative"
              >
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-amber-900 hover:text-amber-700 transition-colors"
                >
                  <MdAccountCircle className="w-6 h-6" />
                </button>
                <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 transition-all z-50 ${
                  showDropdown ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}>
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  {(user.role === 'customer' || user.role === 'Customer') && (
                    <Link
                      to="/orders"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Orders
                    </Link>
                  )}
                  {(user.role === 'admin' || user.role === 'Admin') && (
                    <>
                      <Link
                        to="/admin/menu"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Manage Menu
                      </Link>
                      <Link
                        to="/admin/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        All Orders
                      </Link>
                    </>
                  )}
                  {(user.role === 'chef' || user.role === 'Chef') && (
                    <Link
                      to="/chef/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Orders to Prepare
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
