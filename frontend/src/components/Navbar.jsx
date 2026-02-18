import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdShoppingCart, MdAccountCircle, MdClose, MdMenu, MdLock } from 'react-icons/md';

const Navbar = () => {
  const { user, logout, isAuthenticated, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);

  // Update cart count from localStorage
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartCount(cart.length);
    } else {
      setCartCount(0);
    }
  };

  // Load cart count on mount and listen for storage changes
  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    // Also listen for custom cart update event
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

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
      <nav style={{backgroundColor: '#FFFDF1', fontFamily: 'Montserrat, sans-serif'}} className="py-2 sm:py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="FoodHub Logo" className="h-12 sm:h-14 md:h-16 w-auto" />
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav style={{backgroundColor: '#FFFDF1', fontFamily: 'Montserrat, sans-serif'}} className="py-2 sm:py-2 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="FoodHub Logo" className="h-12 sm:h-14 md:h-16 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className="text-gray-800 hover:text-amber-900 font-bold transition-colors text-sm lg:text-base"
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-gray-800 hover:text-amber-900 font-bold transition-colors text-sm lg:text-base"
            >
              Menu
            </Link>
            {isAuthenticated && user ? (
              <span className="text-gray-800 font-bold text-sm lg:text-base">
                Welcome, {user.name.split(' ')[0]}
              </span>
            ) : (
              <Link
                to="/login"
                className="text-gray-800 hover:text-amber-900 font-bold transition-colors text-sm lg:text-base"
              >
                Login/Sign up
              </Link>
            )}
            
            {/* Cart Icon */}
            <button
              onClick={() => {
                if (isAdmin) {
                  setShowAdminModal(true);
                  return;
                }
                navigate('/cart');
              }}
              className="text-amber-900 hover:text-amber-700 transition-colors relative"
              aria-label="Cart"
            >
              <MdShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

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
                  <MdAccountCircle className="w-5 h-5 sm:w-6 sm:h-6" />
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
                        to="/admin/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/menu"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Manage Menu
                      </Link>
                      <Link
                        to="/admin/orders"
                        onClick={() => setShowDropdown(false)}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Welcome Message and Cart Icon */}
            <div className="flex items-center gap-2">
              {isAuthenticated && user && (
                <span className="text-xs sm:text-sm font-bold text-gray-800">
                  Welcome, {user.name.split(' ')[0]}
                </span>
              )}
              {/* Cart Icon Mobile */}
              <button
                onClick={() => {
                  if (isAdmin) {
                    setShowAdminModal(true);
                    return;
                  }
                  navigate('/cart');
                }}
                className="text-amber-900 hover:text-amber-700 transition-colors relative"
                aria-label="Cart"
              >
                <MdShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Hamburger Menu */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-amber-900 hover:text-amber-700 transition-colors p-1"
              aria-label="Menu"
            >
              {showMobileMenu ? (
                <MdClose className="w-6 h-6" />
              ) : (
                <MdMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-3">
              <Link
                to="/"
                className="block text-gray-800 hover:text-amber-900 font-bold transition-colors px-4 py-2 rounded"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                to="/menu"
                className="block text-gray-800 hover:text-amber-900 font-bold transition-colors px-4 py-2 rounded"
                onClick={() => setShowMobileMenu(false)}
              >
                Menu
              </Link>
              {isAuthenticated && user ? (
                <>
                  {(user.role === 'customer' || user.role === 'Customer') && (
                    <Link
                      to="/orders"
                      className="block text-gray-800 hover:text-amber-900 font-semibold transition-colors px-4 py-2 rounded"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      My Orders
                    </Link>
                  )}
                  {(user.role === 'admin' || user.role === 'Admin') && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="block text-gray-800 hover:text-amber-900 font-semibold transition-colors px-4 py-2 rounded"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/menu"
                        className="block text-gray-800 hover:text-amber-900 font-semibold transition-colors px-4 py-2 rounded"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Manage Menu
                      </Link>
                    </>
                  )}
                  {(user.role === 'chef' || user.role === 'Chef') && (
                    <Link
                      to="/chef/orders"
                      className="block text-gray-800 hover:text-amber-900 font-semibold transition-colors px-4 py-2 rounded"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Orders to Prepare
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left text-red-600 hover:text-red-800 font-semibold transition-colors px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-gray-800 hover:text-amber-900 font-bold transition-colors px-4 py-2 rounded"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login/Sign up
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 border border-[#F6E7D0]">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-lg"
              aria-label="Close"
            >
              <MdClose />
            </button>

            <div className="flex justify-center -mt-12 mb-4">
              <div className="bg-[#FFF5E6] rounded-full p-4 shadow-md ring-4 ring-[#FFFDF1]">
                <MdLock className="w-6 h-6 text-[#704214]" />
              </div>
            </div>

            <div className="text-center mb-4 px-2">
              <h3 className="text-xl sm:text-2xl font-bold" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>Access Denied</h3>
              <p className="text-sm text-gray-700 mt-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                Admins cannot place orders.
              </p>
              <p className="text-xs text-gray-500 mt-1" style={{fontFamily: 'Montserrat, sans-serif'}}>
                Use the admin panel for management.
              </p>
            </div>

            <div className="mt-2">
              <button
                onClick={() => setShowAdminModal(false)}
                className="w-full py-3 text-white font-semibold rounded-full hover:opacity-95 transition-all shadow-md"
                style={{backgroundColor: '#704214', fontFamily: 'Montserrat, sans-serif'}}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
