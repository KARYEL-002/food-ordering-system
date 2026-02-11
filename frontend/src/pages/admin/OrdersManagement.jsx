import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { Trash2, Edit2 } from 'lucide-react';
import api from '../../utils/api';
import EditOrderModal from '../../components/modals/EditOrderModal';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import OrderPreviewModal from '../../components/modals/OrderPreviewModal';

const StatCard = ({ title, value, bgColor = '#FFFDF1' }) => (
  <div
    className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 rounded-lg border-2 flex flex-col justify-center"
    style={{ backgroundColor: bgColor, borderColor: '#704214' }}
  >
    <p style={{ color: '#704214' }} className="font-bold text-xs sm:text-sm uppercase tracking-wider">
      {title}
    </p>
    <p style={{ color: '#704214' }} className="text-xl sm:text-2xl font-bold mt-2 sm:mt-4">
      {value}
    </p>
  </div>
);

const OrdersManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [previewOrder, setPreviewOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (order) => {
    setDeletingOrder(order);
  };

  const confirmDelete = async () => {
    if (!deletingOrder) return;
    try {
      setIsDeleting(true);
      await api.delete(`/orders/${deletingOrder.id}`);
      setOrders(orders.filter(order => order.id !== deletingOrder.id));
      setDeletingOrder(null);
      // Hot reload - fetch fresh data
      setTimeout(() => fetchOrders(), 300);
    } catch (err) {
      alert('Failed to delete order');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
  };

  const confirmEdit = async (updatedOrder) => {
    try {
      setIsEditing(true);
      await api.put(`/orders/${updatedOrder.id}/status`, {
        status: updatedOrder.status
      });
      setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
      setEditingOrder(null);
      // Hot reload - fetch fresh data
      setTimeout(() => fetchOrders(), 300);
    } catch (err) {
      alert('Failed to update order');
    } finally {
      setIsEditing(false);
    }
  };

  const getFilteredOrders = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());

      switch (filterType) {
        case 'today':
          return orderDay.getTime() === today.getTime();
        case 'week':
          return orderDate >= weekAgo;
        case 'month':
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredOrders = getFilteredOrders();
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="flex h-screen flex-col lg:flex-row" style={{ backgroundColor: '#FFFDF1' }}>
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
            {/* Title */}
            <h1
              style={{ color: '#704214' }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8"
            >
              ORDERS MANAGEMENT
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
              <StatCard title="TOTAL ORDERS" value={totalOrders} />
              <StatCard title="COMPLETED" value={completedOrders} />
              <StatCard title="PENDING" value={pendingOrders} />
            </div>

            {/* Filter Section */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center p-4 sm:p-6 rounded-lg border-2 overflow-x-auto" style={{ borderColor: '#7C3AED', backgroundColor: 'white' }}>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {['all', 'today', 'week', 'month'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className="px-3 sm:px-6 py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm whitespace-nowrap"
                    style={{
                      backgroundColor: filterType === type ? '#704214' : '#FFFDF1',
                      color: filterType === type ? 'white' : '#704214',
                      border: `2px solid #704214`
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Section */}
            {loading ? (
              <div className="text-center py-12">
                <p style={{ color: '#704214' }} className="font-bold">
                  Loading orders...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p style={{ color: '#704214' }} className="font-bold">
                  {error}
                </p>
                <button
                  onClick={fetchOrders}
                  className="mt-4 px-6 py-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700"
                >
                  Retry
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: '#704214' }} className="font-bold">
                  No orders found
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border-2" style={{ borderColor: '#704214' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#FFFDF1', borderBottom: '2px solid #704214' }}>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Order ID</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">User ID</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Total</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Order Type</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Status</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Order Date</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Actions</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        onClick={() => setPreviewOrder(order)}
                        className="table-row-hover fade-transition cursor-pointer hover:bg-amber-50 transition-colors"
                        style={{
                          backgroundColor: index % 2 === 0 ? '#FFFDF1' : 'white',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="font-semibold text-base">#{String(order.id).padStart(4, '0')}</p>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="text-base">{order.user_id || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="text-base font-semibold">{parseFloat(order.total_amount).toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="text-base">{order.details?.delivery_type || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className="px-3 py-1 rounded-full text-sm font-bold"
                            style={{
                              backgroundColor: order.status === 'completed' ? '#C0F4C4' : 
                                              order.status === 'pending' ? '#FFD9B3' :
                                              order.status === 'cancelled' ? '#FFB3B3' : '#E8E8E8',
                              color: order.status === 'completed' ? '#065F46' :
                                     order.status === 'cancelled' ? '#7C2D12' : '#704214'
                            }}
                          >
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="text-base">
                            {new Date(order.created_at).toLocaleDateString('en-US')}
                          </p>
                        </td>
                        <td className="px-6 py-5 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(order);
                            }}
                            className="px-3 py-1.5 rounded-lg font-bold text-white transition-opacity hover:opacity-80 flex items-center gap-1 text-sm btn-hover scale-transition"
                            style={{ backgroundColor: '#00BCD4' }}
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(order);
                            }}
                            className="px-3 py-1.5 rounded-lg font-bold text-white transition-opacity hover:opacity-80 flex items-center gap-1 text-sm btn-hover scale-transition"
                            style={{ backgroundColor: '#FF6B6B' }}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditOrderModal
        isOpen={!!editingOrder}
        order={editingOrder}
        onConfirm={confirmEdit}
        onCancel={() => setEditingOrder(null)}
        isLoading={isEditing}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingOrder}
        title="Delete Order"
        message={`Are you sure you want to delete order #${String(deletingOrder?.id).padStart(4, '0')}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingOrder(null)}
        isLoading={isDeleting}
      />

      <OrderPreviewModal
        isOpen={!!previewOrder}
        order={previewOrder}
        onClose={() => setPreviewOrder(null)}
      />
    </div>
  );
};

export default OrdersManagement;
