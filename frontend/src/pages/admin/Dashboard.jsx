import { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import StatCard from '../../components/StatCard';
import RevenueChart from '../../components/RevenueChart';
import TopSellingProducts from '../../components/TopSellingProducts';
import PaymentDistribution from '../../components/PaymentDistribution';
import { ShoppingBag, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayRevenue: 0,
    totalUsers: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        api.get('/orders').catch(() => ({ data: { data: [] } })),
        api.get('/users').catch(() => ({ data: { data: [] } })),
      ]);

      const orders = ordersRes.data.data || [];
      const users = usersRes.data.data || [];
      
      // Filter only paid and completed orders
      const completedPaidOrders = Array.isArray(orders) 
        ? orders.filter(order => order.status === 'completed' && order.payment_status === 'paid')
        : [];
      
      // Calculate today's revenue from completed and paid orders
      const today = new Date().toDateString();
      let todayRevenue = 0;
      
      if (Array.isArray(completedPaidOrders)) {
        todayRevenue = completedPaidOrders
          .filter(order => new Date(order.created_at).toDateString() === today)
          .reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
      }

      setStats({
        totalOrders: completedPaidOrders.length,
        todayRevenue: parseFloat(todayRevenue).toFixed(2),
        totalUsers: Array.isArray(users) ? users.length : 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Set default values to prevent crashes
      setStats({
        totalOrders: 0,
        todayRevenue: 0,
        totalUsers: 0,
      });
    }
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = today.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex h-screen flex-col lg:flex-row" style={{ backgroundColor: '#FFF5E6' }}>
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block w-full lg:w-56">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar - Fixed on mobile, hidden on desktop */}
      <div
        className={`fixed z-40 transform transition-transform h-screen w-56 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-20">
          <AdminTopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black" style={{ color: '#704214' }}>WELCOME, ADMIN!</h1>
              </div>
              <div className="text-left sm:text-right text-sm sm:text-base">
                <p className="font-bold" style={{ color: '#704214' }}>{dateStr}</p>
                <p className="text-xs sm:text-sm" style={{ color: '#704214' }}>{timeStr}</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <StatCard
                title="TOTAL ORDERS"
                value={stats.totalOrders}
                icon={<ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />}
              />
              <StatCard
                title="TODAY'S REVENUE"
                value={`PHP ${parseFloat(stats.todayRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={<TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />}
              />
              <StatCard
                title="USERS"
                value={stats.totalUsers}
                icon={<Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />}
              />
            </div>

            {/* Charts Row 1 */}
            <div className="mb-6 sm:mb-8">
              <RevenueChart />
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <TopSellingProducts />
              <PaymentDistribution />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
