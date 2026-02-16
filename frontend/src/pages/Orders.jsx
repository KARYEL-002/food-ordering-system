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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

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

  const canCancelOrder = (status) => {
    // Allow cancellation only for pending orders
    return status === 'pending';
  };

  const handleCancelOrder = async (orderId) => {
    setCancellingOrderId(orderId);
    setShowCancelConfirm(true);
  };

  const confirmCancelOrder = async () => {
    try {
      await api.post(`/orders/${cancellingOrderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrders();
      closeModal();
      setShowCancelConfirm(false);
      setCancellingOrderId(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel order');
      setShowCancelConfirm(false);
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen w-full" style={{backgroundColor: '#FFFDF1'}}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 relative animate-fade-in">
        <button
          onClick={() => navigate('/menu')}
          className="absolute left-3 sm:left-4 md:left-6 lg:left-8 top-6 sm:top-8 md:top-10 flex items-center gap-1 hover:opacity-70 transition p-2 btn-press"
          style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}
          title="Back to Menu"
        >
          <MdArrowBack size={20} />
        </button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center animate-fade-in-up" style={{fontFamily: 'Montserrat, sans-serif'}}>My Orders</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base loading-pulse" style={{fontFamily: 'Montserrat, sans-serif'}}>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center py-12">
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
        <div className="space-y-2.5 max-w-3xl mx-auto px-4">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className={`card p-4 border-2 animate-fade-in-up card-hover`}
              style={{borderColor: '#E8DCC8', animationDelay: `${index * 50}ms`}}
            >
              {/* Order Top Row */}
              <div className="flex justify-between items-start mb-2.5">
                <div className="flex-1">
                  <p className="font-bold text-base" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    Order #{order.id}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs px-3 py-1 rounded-full font-semibold text-white" style={{backgroundColor: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    {getDeliveryLabel(order.details?.delivery_type || 'delivery')}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full font-semibold text-white" style={{backgroundColor: getStatusColor(order.status), fontFamily: 'Montserrat, sans-serif'}}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* Items - Compact */}
              {order.items && order.items.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-2 mb-2.5" style={{borderLeft: '3px solid #704214'}}>
                  <div className="text-xs space-y-1" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-gray-700">
                        <span className="font-medium">{item.menu_item?.name || item.menu_item_name || 'Item'}</span>
                        <span className="text-gray-500"> × {item.quantity}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Total and Actions */}
              <div className="flex justify-between items-center pt-2.5 border-t" style={{borderColor: '#E8DCC8'}}>
                <p className="font-bold text-base" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                  {formatCurrency(order.total_amount)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewOrder(order);
                    }}
                    className="px-4 py-1.5 rounded text-xs font-bold text-white hover:opacity-85 transition-all btn-press hover:scale-105 duration-200"
                    style={{backgroundColor: '#704214'}}
                  >
                    View
                  </button>
                  {canCancelOrder(order.status) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelOrder(order.id);
                      }}
                      className="px-4 py-1.5 rounded text-xs font-bold text-white hover:opacity-85 transition-all btn-press hover:scale-105 duration-200"
                      style={{backgroundColor: '#DC143C'}}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Preview Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden modal-content" style={{fontFamily: 'Montserrat, sans-serif', borderColor: '#D4C5B0', border: '2px solid #D4C5B0'}}>
            {/* Header */}
            <div className="bg-white p-4 flex justify-between items-center border-b-2" style={{borderColor: '#E8DCC8'}}>
              <h2 className="text-lg font-bold" style={{color: '#704214'}}>Order #{selectedOrder.id}</h2>
              <button
                onClick={closeModal}
                className="text-xl text-gray-400 hover:text-gray-600 font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* compute items total and delivery fee for display */}
              {(() => {
                const items = selectedOrder.items || [];
                const details = selectedOrder.details || selectedOrder.order_detail || selectedOrder.orderDetail || {};
                selectedOrder._itemsTotal = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0);
                selectedOrder._deliveryFee = Number(details.delivery_fee || details.deliveryFee || 0);
                selectedOrder._deliveryService = details.delivery_service || details.deliveryService || '';
                return null;
              })()}
              {/* Order Meta */}
              <div className="flex justify-between text-xs text-gray-600">
                <span>{formatDate(selectedOrder.created_at)}</span>
                <div className="flex gap-2">
                  <span
                    className="px-3 py-1 rounded-full font-semibold text-white text-xs"
                    style={{backgroundColor: '#704214'}}
                  >
                    {getDeliveryLabel(selectedOrder.details?.delivery_type || 'delivery')}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full font-semibold text-white text-xs"
                    style={{backgroundColor: getStatusColor(selectedOrder.status)}}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
              </div>

              {/* Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <p className="text-xs font-bold mb-2" style={{color: '#704214'}}>Items</p>
                  <div className="space-y-1.5 bg-gray-50 p-3 rounded-lg border-2 text-xs" style={{borderColor: '#E8DCC8'}}>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span style={{color: '#704214'}} className="font-medium">{item.menu_item?.name || item.menu_item_name}</span>
                        <span className="text-gray-600">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-3" style={{borderColor: '#E8DCC8'}}>
                <div className="flex justify-between text-sm" style={{color: '#704214'}}>
                  <span>Items Total:</span>
                  <span>{formatCurrency(selectedOrder._itemsTotal || 0)}</span>
                </div>
                {selectedOrder._deliveryFee > 0 && (
                  <div className="flex justify-between text-sm mt-2" style={{color: '#704214'}}>
                    <span>Delivery Fee:</span>
                    <span>{formatCurrency(selectedOrder._deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm mt-3" style={{color: '#704214'}}>
                  <span>Total:</span>
                  <span>{formatCurrency((selectedOrder._itemsTotal || 0) + (selectedOrder._deliveryFee || 0))}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="text-xs border-t pt-3" style={{borderColor: '#E8DCC8'}}>
                <div className="flex items-center gap-2">
                  <span className="capitalize font-medium" style={{color: '#704214'}}>{selectedOrder.payment_method || 'N/A'}</span>
                  <span className="px-2.5 py-0.5 rounded-full font-semibold text-white text-xs" style={{backgroundColor: selectedOrder.payment_status === 'paid' ? '#228B22' : '#FFA500'}}>
                    {selectedOrder.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex gap-2" style={{borderColor: '#E8DCC8'}}>
              {canCancelOrder(selectedOrder?.status) && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="flex-1 py-2.5 rounded font-bold text-white text-sm transition-all btn-press hover:scale-105 duration-200 hover:opacity-85"
                  style={{backgroundColor: '#DC143C'}}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden modal-content" style={{fontFamily: 'Montserrat, sans-serif', borderColor: '#D4C5B0', border: '2px solid #D4C5B0'}}>
            {/* Header */}
            <div className="bg-white p-4 flex justify-between items-center border-b-2" style={{borderColor: '#E8DCC8'}}>
              <h2 className="text-lg font-bold" style={{color: '#704214'}}>Cancel Order</h2>
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setCancellingOrderId(null);
                }}
                className="text-xl text-gray-400 hover:text-gray-600 font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-sm text-gray-700" style={{fontFamily: 'Montserrat, sans-serif'}}>
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex gap-2" style={{borderColor: '#E8DCC8'}}>
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setCancellingOrderId(null);
                }}
                className="flex-1 py-2.5 rounded font-bold text-white text-sm transition-all btn-press hover:scale-105 duration-200 hover:opacity-85"
                style={{backgroundColor: '#704214'}}
              >
                No, Keep Order
              </button>
              <button
                onClick={confirmCancelOrder}
                className="flex-1 py-2.5 rounded font-bold text-white text-sm transition-all btn-press hover:scale-105 duration-200 hover:opacity-85"
                style={{backgroundColor: '#DC143C'}}
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
