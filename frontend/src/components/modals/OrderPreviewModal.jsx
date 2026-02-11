import { MdClose } from 'react-icons/md';
import { formatCurrency } from '../../utils/helpers';

const OrderPreviewModal = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  const details = order.details || order.order_detail || {};
  const items = order.items || [];
  const user = order.user || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 modal-content" style={{ borderColor: '#704214' }}>
        {/* Header */}
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b-2" style={{ borderColor: '#E8DCC8' }}>
          <h2 style={{ color: '#704214' }} className="text-3xl font-bold">
            Order #{String(order.id).padStart(4, '0')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ color: '#704214' }}
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Status & Info */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm uppercase font-bold" style={{ color: '#997755' }}>Status</p>
              <span
                className="inline-block px-3 py-1 rounded-full text-sm font-bold mt-1"
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
            </div>
            <div>
              <p className="text-sm uppercase font-bold" style={{ color: '#997755' }}>Order Date</p>
              <p style={{ color: '#704214' }} className="text-sm mt-1">
                {new Date(order.created_at).toLocaleDateString('en-US')}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase font-bold" style={{ color: '#997755' }}>Order Time</p>
              <p style={{ color: '#704214' }} className="text-sm mt-1">
                {new Date(order.created_at).toLocaleTimeString('en-US')}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase font-bold" style={{ color: '#997755' }}>Total Amount</p>
              <p style={{ color: '#704214' }} className="font-bold text-sm mt-1">
                {formatCurrency(order.total_amount)}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '2px solid #E8DCC8' }}></div>

          {/* Customer Information */}
          <div>
            <h3 style={{ color: '#704214' }} className="text-lg font-bold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Name</p>
                <p style={{ color: '#704214' }} className="text-sm mt-1">
                  {details.customer_name || user.name || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Email</p>
                <p style={{ color: '#704214' }} className="text-sm mt-1">
                  {user.email || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Phone Number</p>
                <p style={{ color: '#704214' }} className="text-sm mt-1">
                  {details.customer_phone || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div>
            <h3 style={{ color: '#704214' }} className="text-lg font-bold mb-3">Delivery Information</h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Delivery Type</p>
                  <p style={{ color: '#704214' }} className="text-sm mt-1 capitalize">
                    {details.delivery_type || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Order Date</p>
                  <p style={{ color: '#704214' }} className="text-sm mt-1">
                    {details.order_date ? new Date(details.order_date).toLocaleDateString('en-US') : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Order Time</p>
                  <p style={{ color: '#704214' }} className="text-sm mt-1">
                    {details.order_time || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Payment Method</p>
                  <p style={{ color: '#704214' }} className="text-sm mt-1 capitalize">
                    {order.payment_method || 'N/A'}
                  </p>
                </div>
              </div>
              {details.delivery_address && (
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Delivery Address</p>
                  <p style={{ color: '#704214' }} className="text-sm mt-1">
                    {details.delivery_address}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 style={{ color: '#704214' }} className="text-lg font-bold mb-3">Order Items</h3>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              {items && items.length > 0 ? (
                items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b pb-2" style={{ borderColor: '#E8DCC8' }}>
                    <div>
                      <p style={{ color: '#704214' }} className="font-semibold">
                        {item.menu_item?.name || item.name || 'Item'}
                      </p>
                      <p style={{ color: '#997755' }} className="text-xs mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p style={{ color: '#704214' }} className="font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#704214' }}>No items found</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-orange-100 p-4 rounded-lg border-2" style={{ borderColor: '#E8DCC8' }}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p style={{ color: '#704214' }} className="font-semibold">Subtotal:</p>
                <p style={{ color: '#704214' }} className="font-semibold">
                  {formatCurrency(order.subtotal || order.total_amount)}
                </p>
              </div>
              {order.tax_amount && (
                <div className="flex justify-between">
                  <p style={{ color: '#704214' }} className="font-semibold">Tax (10%):</p>
                  <p style={{ color: '#704214' }} className="font-semibold">
                    {formatCurrency(order.tax_amount)}
                  </p>
                </div>
              )}
              <div className="border-t-2 pt-2" style={{ borderColor: '#D4C5B0' }}>
                <div className="flex justify-between">
                  <p style={{ color: '#704214' }} className="text-lg font-bold">Total:</p>
                  <p style={{ color: '#704214' }} className="text-lg font-bold">
                    {formatCurrency(order.total_amount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-bold text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#704214' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPreviewModal;
