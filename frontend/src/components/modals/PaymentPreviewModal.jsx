import { MdClose } from 'react-icons/md';
import { Edit2 } from 'lucide-react';

const PaymentPreviewModal = ({ isOpen, payment, onClose, onEdit }) => {
  if (!isOpen || !payment) return null;

  // Handle both order objects (with payment relationship) and pure payment objects
  const paymentData = payment.payment || payment;
  const orderId = payment.id;
  const orderPaymentMethod = payment.payment_method;
  const orderPaymentStatus = payment.payment_status;
  const orderStatus = payment.status;
  const totalAmount = payment.total_amount;
  const createdAt = payment.created_at;

  const formatCurrency = (value) => {
    return `₱${parseFloat(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[86vh] overflow-y-auto border shadow-lg" style={{ borderColor: '#E8DCC8' }}>
        {/* Header */}
        <div className="sticky top-0 bg-white flex justify-between items-center px-4 py-3 border-b" style={{ borderColor: '#E8DCC8' }}>
          <h2 style={{ color: '#704214' }} className="text-2xl font-semibold">
            Payment #{String(orderId).padStart(4, '0')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            style={{ color: '#704214' }}
            aria-label="Close payment preview"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Payment Status & Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm uppercase font-bold" style={{ color: '#997755' }}>Payment Status</p>
              <span
                className="inline-block px-3 py-1 rounded-full text-sm font-bold mt-1"
                style={{
                  backgroundColor: orderPaymentStatus === 'paid' ? '#C0F4C4' : '#FFD9B3',
                  color: orderPaymentStatus === 'paid' ? '#065F46' : '#704214'
                }}
              >
                {orderPaymentStatus?.charAt(0).toUpperCase() + orderPaymentStatus?.slice(1) || 'N/A'}
              </span>
            </div>
            <div>
              <p className="text-sm uppercase font-bold" style={{ color: '#997755' }}>Payment Date</p>
              <p style={{ color: '#704214' }} className="text-sm mt-1">
                {formatDate(createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase font-bold" style={{ color: '#997755' }}>Payment Time</p>
              <p style={{ color: '#704214' }} className="text-sm mt-1">
                {formatTime(createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase font-bold" style={{ color: '#997755' }}>Amount</p>
              <p style={{ color: '#704214' }} className="font-bold text-sm mt-1">
                {formatCurrency(paymentData?.amount || totalAmount)}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '2px solid #E8DCC8' }}></div>

          {/* Payment Details */}
          <div>
            <h3 style={{ color: '#704214' }} className="text-sm font-semibold mb-3">Payment Details</h3>
            <div className="space-y-3 bg-[#FFFDF1] p-3 rounded-md border" style={{ borderColor: '#E8DCC8' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Order ID</p>
                  <p style={{ color: '#704214' }} className="text-sm mt-1 font-semibold">
                    #{String(orderId).padStart(4, '0')}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Payment Method</p>
                  <p style={{ color: '#704214' }} className="text-sm mt-1 capitalize">
                    {orderPaymentMethod || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Total Amount</p>
                  <p style={{ color: '#704214' }} className="text-sm mt-1 font-semibold">
                    {formatCurrency(paymentData?.amount || totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Order Status</p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-bold mt-1"
                    style={{
                      backgroundColor: orderStatus === 'completed' ? '#C0F4C4' : 
                                       orderStatus === 'pending' ? '#FFD9B3' :
                                       orderStatus === 'cancelled' ? '#FFB3B3' : '#E8E8E8',
                      color: orderStatus === 'completed' ? '#065F46' :
                             orderStatus === 'cancelled' ? '#7C2D12' : '#704214'
                    }}
                  >
                    {orderStatus?.charAt(0).toUpperCase() + orderStatus?.slice(1) || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <h3 style={{ color: '#704214' }} className="text-sm font-semibold mb-3">Transaction Information</h3>
            <div className="space-y-3 bg-[#FFFDF1] p-3 rounded-md border" style={{ borderColor: '#E8DCC8' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Transaction Reference</p>
                  <p style={{ color: '#704214' }} className="text-sm mt-1 font-mono">
                    {paymentData?.transaction_reference || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: '#997755' }}>Payment ID</p>
                  <p style={{ color: '#704214' }} className="text-sm mt-1 font-mono">
                    {paymentData?.id || orderId}
                  </p>
                </div>
              </div>
            
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '2px solid #E8DCC8' }}></div>

          {/* Action Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <button
                onClick={() => { onEdit(payment); onClose(); }}
                className="w-full py-2 rounded-md font-semibold flex items-center justify-center gap-2 text-white"
                style={{ backgroundColor: '#00BCD4' }}
              >
                <Edit2 size={16} />
                Edit Payment
              </button>
            </div>
            <div>
              <button
                onClick={onClose}
                className="w-full py-2 rounded-md font-semibold"
                style={{
                  backgroundColor: '#FFFDF1',
                  color: '#704214',
                  border: '2px solid #704214'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPreviewModal;
