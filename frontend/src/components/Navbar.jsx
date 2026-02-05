import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdShoppingCart } from 'react-icons/md';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{backgroundColor: '#FFFDF1', fontFamily: 'Montserrat, sans-serif'}} className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center">
              <img src={logo} alt="FoodHub Logo" className="h-28 w-auto" />
            </Link>
          </div>

          {/* Right Side - Menu Links and Cart */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-800 hover:text-amber-900 font-medium transition-colors text-lg"
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-gray-800 hover:text-amber-900 font-medium transition-colors text-lg"
            >
              Menu
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-800 hover:text-amber-900 font-medium transition-colors text-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-gray-800 hover:text-amber-900 font-medium transition-colors text-lg"
              >
                Login/Sign up
              </Link>
            )}
            
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="text-amber-900 hover:text-amber-700 transition-colors"
            >
              <MdShoppingCart className="w-7 h-7" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
