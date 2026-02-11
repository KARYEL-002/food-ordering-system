import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';
import { MdCheckCircle, MdPending, MdTimer } from 'react-icons/md';

const ChefOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chef/orders');
      setOrders(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <MdPending className="w-5 h-5" />;
      case 'preparing':
        return <MdTimer className="w-5 h-5" />;
      case 'ready':
        return <MdCheckCircle className="w-5 h-5" />;
      default:
        return <MdPending className="w-5 h-5" />;
    }
  };

  const filteredOrders = orders.filter(
    (order) => order.status?.toLowerCase() === selectedStatus.toLowerCase()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF1' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#704214' }}>
            Chef Dashboard
          </h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['pending', 'preparing', 'ready', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full font-semibold capitalize transition-all ${
                selectedStatus === status
                  ? 'bg-amber-900 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2'
              }`}
              style={selectedStatus === status ? {} : { borderColor: '#D4C5B0' }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">No {selectedStatus} orders</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4"
                style={{ borderColor: '#704214' }}
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#704214' }}>
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Customer: {order.user?.name || 'Unknown'}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize font-semibold">{order.status}</span>
                  </div>
                </div>

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2" style={{ color: '#704214' }}>
                      Items to Prepare:
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {item.menu_item?.name || item.name} x {item.quantity}
                          </span>
                          <span className="text-gray-600">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order Time</p>
                    <p className="font-semibold">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Total</p>
                    <p className="font-semibold" style={{ color: '#704214' }}>
                      {formatCurrency(order.total_amount || 0)}
                    </p>
                  </div>
                </div>

                {/* Status Update Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {order.status?.toLowerCase() === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      disabled={updatingOrderId === order.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {updatingOrderId === order.id ? 'Updating...' : 'Start Preparing'}
                    </button>
                  )}
                  {order.status?.toLowerCase() === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      disabled={updatingOrderId === order.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {updatingOrderId === order.id ? 'Updating...' : 'Mark Ready'}
                    </button>
                  )}
                  {order.status?.toLowerCase() === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      disabled={updatingOrderId === order.id}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                      {updatingOrderId === order.id ? 'Updating...' : 'Order Completed'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefOrders;
