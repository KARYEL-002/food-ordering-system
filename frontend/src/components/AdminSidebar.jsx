import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ onClose = () => {} }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { label: 'DASHBOARD', path: '/admin/dashboard' },
    { label: 'MENU', path: '/admin/menu' },
    { label: 'ORDERS', path: '/admin/orders' },
    { label: 'PAYMENTS', path: '/admin/payments' },
    { label: 'USERS', path: '/admin/users' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full sm:w-48 md:w-56 flex flex-col h-screen" style={{ backgroundColor: '#FFD9B3' }}>
      {/* Logo */}
      <div className="p-4 sm:p-6 flex justify-center">
        <div className="border-4 border-[#FFD9B3] bg-white rounded-full w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex items-center justify-center shadow-lg">
          <img src="/images/food-hub-logo.png" alt="Food Hub" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover" />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="px-3 sm:px-6 py-4 sm:py-6 space-y-2 sm:space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className="block px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-bold text-center transition-all text-xs sm:text-sm md:text-base"
            style={{
              color: '#704214',
              backgroundColor: isActive(item.path) ? '#FFFDF1' : 'transparent',
              letterSpacing: '0.5px',
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout Button - Pushed to bottom */}
      <div className="p-3 sm:p-6 mt-auto">
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-bold transition-all hover:opacity-80 cursor-pointer text-xs sm:text-sm md:text-base"
          style={{ 
            color: '#fff',
            backgroundColor: '#E74C3C',
            letterSpacing: '0.5px',
          }}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
