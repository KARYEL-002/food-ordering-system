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
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
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
              onClick={() => handleViewOrder(order)}
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

      {/* Order Preview Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full" style={{fontFamily: 'Montserrat, sans-serif'}}>
            {/* Header */}
            <div className="bg-white border-b p-3 flex justify-between items-center" style={{borderColor: '#E8DCC8'}}>
              <h2 className="text-base font-bold" style={{color: '#704214'}}>Order #{selectedOrder.id}</h2>
              <button
                onClick={closeModal}
                className="text-xl text-gray-500 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              {/* Date and Status */}
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>{formatDate(selectedOrder.created_at)}</span>
                <span
                  className="px-2 py-0.5 rounded-full font-semibold text-white text-xs"
                  style={{backgroundColor: getStatusColor(selectedOrder.status)}}
                >
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              {/* Type Badge */}
              <div>
                <span
                  className="inline-block px-2 py-0.5 rounded-full font-semibold text-white text-xs"
                  style={{backgroundColor: '#704214'}}
                >
                  {getDeliveryLabel(selectedOrder.details?.delivery_type || 'delivery')}
                </span>
              </div>

              {/* Items List */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <p className="text-xs font-bold mb-1" style={{color: '#704214'}}>Items</p>
                  <div className="space-y-0.5 bg-gray-50 p-2 rounded border text-xs" style={{borderColor: '#E8DCC8'}}>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span style={{color: '#704214'}}>{item.menu_item?.name}</span>
                        <span className="text-gray-600">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amount Breakdown */}
              <div className="border-t pt-2 text-xs space-y-0.5" style={{borderColor: '#E8DCC8'}}>
                <div className="flex justify-between">
                  <span style={{color: '#704214'}}>Subtotal:</span>
                  <span style={{color: '#704214'}}>{formatCurrency(selectedOrder.subtotal || selectedOrder.total_amount)}</span>
                </div>
                {selectedOrder.tax_amount && (
                  <div className="flex justify-between">
                    <span style={{color: '#704214'}}>Tax:</span>
                    <span style={{color: '#704214'}}>{formatCurrency(selectedOrder.tax_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-1 text-sm" style={{borderColor: '#E8DCC8', color: '#704214'}}>
                  <span>Total:</span>
                  <span>{formatCurrency(selectedOrder.total_amount)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="text-xs border-t pt-2" style={{borderColor: '#E8DCC8'}}>
                <span className="capitalize" style={{color: '#704214'}}>{selectedOrder.payment_method || 'N/A'}</span>
                <span className="ml-2 px-2 py-0.5 rounded-full font-semibold text-white text-xs" style={{backgroundColor: selectedOrder.payment_status === 'paid' ? '#228B22' : '#FFA500'}}>
                  {selectedOrder.payment_status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-2" style={{borderColor: '#E8DCC8'}}>
              <button
                onClick={closeModal}
                className="w-full py-2 rounded-lg font-bold text-white text-sm transition hover:opacity-90"
                style={{backgroundColor: '#704214'}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
