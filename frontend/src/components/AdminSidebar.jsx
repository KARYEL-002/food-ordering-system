import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const AdminSidebar = () => {
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
    <div className="w-56 flex flex-col h-screen" style={{ backgroundColor: '#FFD9B3' }}>
      {/* Logo */}
      <div className="p-6 flex justify-center">
        <div className="border-4 bg-white rounded-lg w-36 h-36 flex items-center justify-center">
          <img src="/images/food-hub-logo.png" alt="Food Hub" className="w-24 h-24" />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="px-6 py-6 space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block px-6 py-4 rounded-2xl font-bold text-center transition-all"
            style={{
              color: '#704214',
              backgroundColor: isActive(item.path) ? '#FFFDF1' : 'transparent',
              fontSize: '14px',
              letterSpacing: '0.5px',
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout Button - Pushed to bottom */}
      <div className="p-6 mt-auto">
        <button
          onClick={logout}
          className="w-full px-6 py-4 rounded-2xl font-bold transition-opacity hover:opacity-80"
          style={{ 
            color: '#704214',
            fontSize: '14px',
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
