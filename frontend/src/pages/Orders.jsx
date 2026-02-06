import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { MdArrowBack, MdShoppingBag } from 'react-icons/md';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my-orders');
      console.log('Orders response:', response.data);
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      confirmed: '#4169E1',
      preparing: '#FF8C00',
      ready: '#32CD32',
      completed: '#228B22',
      cancelled: '#DC143C',
    };
    return colors[status] || '#704214';
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getDeliveryLabel = (type) => {
    const labels = {
      dine_in: 'Dine In',
      pickup: 'Pick Up',
      delivery: 'Delivery',
    };
    return labels[type] || type;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4" style={{backgroundColor: '#FFFDF1', minHeight: '100vh'}}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/menu')}
          className="flex items-center gap-1 hover:opacity-70 transition p-2"
          style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}
          title="Back to Menu"
        >
          <MdArrowBack size={20} />
        </button>
        <h1 className="text-3xl font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
          My Orders
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base" style={{fontFamily: 'Montserrat, sans-serif'}}>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2" style={{borderColor: '#E8DCC8'}}>
          <MdShoppingBag size={48} className="mx-auto mb-4" style={{color: '#D4C5B0'}} />
          <p className="text-lg font-semibold" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
            No orders placed yet
          </p>
          <p className="text-xs text-gray-500 mt-2 mb-5" style={{fontFamily: 'Montserrat, sans-serif'}}>
            Start ordering delicious food now!
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="px-8 py-2 text-white text-sm font-bold rounded-full hover:opacity-90 transition"
            style={{backgroundColor: '#704214', fontFamily: 'Montserrat, sans-serif'}}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-sm p-5 border-2 cursor-pointer hover:shadow-md transition"
              style={{borderColor: '#E8DCC8'}}
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                {/* Order ID */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    Order #
                  </p>
                  <p className="text-base font-bold" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    {order.id}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    {formatDate(order.created_at)}
                  </p>
                </div>

                {/* Type */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    Type
                  </p>
                  <span
                    className="inline-block text-xs px-2.5 py-1 rounded-full font-semibold text-white"
                    style={{backgroundColor: '#704214', fontFamily: 'Montserrat, sans-serif'}}
                  >
                    {getDeliveryLabel(order.details?.delivery_type || 'delivery')}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    Status
                  </p>
                  <span
                    className="inline-block text-xs px-2.5 py-1 rounded-full font-semibold text-white"
                    style={{backgroundColor: getStatusColor(order.status), fontFamily: 'Montserrat, sans-serif'}}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Total */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    Total
                  </p>
                  <p className="text-xl font-bold" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    {formatCurrency(order.total_amount)}
                  </p>
                </div>
              </div>

              {/* Items */}
              {order.items && order.items.length > 0 && (
                <div className="border-t pt-2" style={{borderColor: '#D4C5B0'}}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    Items ({order.items.length})
                  </p>
                  <div className="space-y-0.5">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <p key={idx} className="text-xs text-gray-700" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <span className="font-medium">{item.menu_item?.name}</span>
                        <span className="text-gray-500"> × {item.quantity}</span>
                      </p>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-gray-400 italic" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
