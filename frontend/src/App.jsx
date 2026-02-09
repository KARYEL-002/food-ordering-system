import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

// Lazy load admin pages for code splitting
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const MenuManagement = lazy(() => import('./pages/admin/MenuManagement'));
const OrdersManagement = lazy(() => import('./pages/admin/OrdersManagement'));
const PaymentsManagement = lazy(() => import('./pages/admin/PaymentsManagement'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));
const ChefOrders = lazy(() => import('./pages/staff/ChefOrders'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={isAdminRoute ? 'min-h-screen' : 'min-h-screen bg-gray-50'}>
      {!isAdminRoute && <Navbar />}
      <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Orders />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Suspense fallback={<PageLoader />}>
                <MenuManagement />
              </Suspense>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Suspense fallback={<PageLoader />}>
                <OrdersManagement />
              </Suspense>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Suspense fallback={<PageLoader />}>
                <PaymentsManagement />
              </Suspense>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Suspense fallback={<PageLoader />}>
                <UsersManagement />
              </Suspense>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/chef/orders"
          element={
            <ProtectedRoute allowedRoles={['chef']}>
              <Suspense fallback={<PageLoader />}>
                <ChefOrders />
              </Suspense>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
