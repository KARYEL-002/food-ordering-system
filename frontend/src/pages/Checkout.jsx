import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { MdArrowBack } from 'react-icons/md';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deliveryType, items, total } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form fields
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    orderDate: new Date().toISOString().split('T')[0],
    orderTime: '12:00',
    deliveryAddress: ''
  });

  if (!deliveryType || !items) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{backgroundColor: '#FFFDF1', minHeight: '80vh'}}>
        <p className="text-center text-gray-500 text-xl">Invalid checkout session</p>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!formData.customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.customerPhone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    try {
      const subtotal = total;
      const taxAmount = Math.round(subtotal * 0.10 * 100) / 100; // 10% tax
      const totalAmount = subtotal + taxAmount;

      const orderData = {
        subtotal: subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        status: 'pending',
        payment_status: 'pending',
        items: items.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        order_detail: {
          delivery_type: deliveryType,
          order_date: formData.orderDate,
          order_time: formData.orderTime,
          delivery_address: deliveryType === 'delivery' ? formData.deliveryAddress : null,
        }
      };

      console.log('Sending order data:', orderData);
      const response = await api.post('/orders', orderData);
      console.log('Order response:', response);
      localStorage.removeItem('cart');
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Order error:', error.response?.data);
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getDeliveryTypeLabel = () => {
    const types = {
      dine_in: 'Dine In',
      pickup: 'Pick Up',
      delivery: 'Delivery'
    };
    return types[deliveryType] || deliveryType;
  };

  const getCashMessage = () => {
    if (deliveryType === 'dine_in') {
      return 'Kindly proceed to cashier for your payment';
    } else if (deliveryType === 'pickup') {
      return 'After picking the order please proceed to cashier to confirm your payment';
    } else if (deliveryType === 'delivery') {
      return 'Please prepare payment for the delivery driver';
    }
    return 'Proceed to payment';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4" style={{backgroundColor: '#FFFDF1', minHeight: '80vh'}}>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .payment-message {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>

      {/* Back Button and Title */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1 text-lg font-semibold hover:opacity-70 transition"
          style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}
        >
          <MdArrowBack size={24} />
        </button>
        <h1 className="text-2xl font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
          {getDeliveryTypeLabel()}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Form Fields and Payment */}
        <div className="space-y-4">
          {/* Customer Information */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border-2" style={{borderColor: '#E8DCC8'}}>
            <h2 className="text-base font-bold mb-4" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
              Your Information
            </h2>

            {/* Name */}
            <div className="mb-3">
              <label className="block text-xs font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                Full Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                style={{borderColor: '#D4C5B0', backgroundColor: '#FFFDF1'}}
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="block text-xs font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                Phone Number
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                style={{borderColor: '#D4C5B0', backgroundColor: '#FFFDF1'}}
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                  Date
                </label>
                <input
                  type="date"
                  name="orderDate"
                  value={formData.orderDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                  style={{borderColor: '#D4C5B0', backgroundColor: '#FFFDF1'}}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                  Time
                </label>
                <input
                  type="time"
                  name="orderTime"
                  value={formData.orderTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                  style={{borderColor: '#D4C5B0', backgroundColor: '#FFFDF1'}}
                />
              </div>
            </div>

            {/* Delivery specific */}
            {deliveryType === 'delivery' && (
              <>
                <div className="mb-3">
                  <label className="block text-xs font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    Delivery Address
                  </label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your complete delivery address"
                    rows="3"
                    className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                    style={{borderColor: '#D4C5B0', backgroundColor: '#FFFDF1'}}
                  />
                </div>
              </>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border-2" style={{borderColor: '#E8DCC8'}}>
            <h2 className="text-base font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
              Payment Method
            </h2>
            <p className="text-gray-600 mb-4 text-xs" style={{fontFamily: 'Montserrat, sans-serif'}}>
              Choose your payment method
            </p>

            <div className="space-y-3">
              {/* Cash Option */}
              <button
                onClick={() => setPaymentMethod(paymentMethod === 'cash' ? null : 'cash')}
                className="w-full transition-all rounded-2xl border-2 duration-300"
                style={{
                  borderColor: '#704214',
                  backgroundColor: paymentMethod === 'cash' ? '#F5EBE0' : '#FFFDF1',
                  color: '#704214',
                  fontFamily: 'Montserrat, sans-serif',
                  padding: '12px 16px',
                  minHeight: paymentMethod === 'cash' ? '80px' : '48px',
                  display: 'flex',
                  alignItems: paymentMethod === 'cash' ? 'center' : 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <span className="font-semibold">Cash</span>
                {paymentMethod === 'cash' && (
                  <span className="text-xs mt-2 payment-message" style={{color: '#704214'}}>
                    {getCashMessage()}
                  </span>
                )}
              </button>

              {/* Online Payment Option */}
              <button
                onClick={() => setPaymentMethod(paymentMethod === 'online' ? null : 'online')}
                className="w-full transition-all rounded-2xl border-2 duration-300"
                style={{
                  borderColor: '#704214',
                  backgroundColor: paymentMethod === 'online' ? '#F5EBE0' : '#FFFDF1',
                  color: '#704214',
                  fontFamily: 'Montserrat, sans-serif',
                  padding: '12px 16px',
                  minHeight: paymentMethod === 'online' ? '80px' : '48px',
                  display: 'flex',
                  alignItems: paymentMethod === 'online' ? 'center' : 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <span className="font-semibold">Online Payment</span>
                {paymentMethod === 'online' && (
                  <span className="text-xs mt-2 payment-message" style={{color: '#704214'}}>
                    Coming soon
                  </span>
                )}
              </button>
            </div>

            {/* Pickup Information */}
            {deliveryType === 'pickup' && (
              <div className="mt-4 pt-4 border-t-2" style={{borderColor: '#D4C5B0'}}>
                <h3 className="text-xs font-bold mb-3" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                  PICKUP DETAILS
                </h3>
                <div className="space-y-2 text-xs" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                  <div>
                    <p className="font-semibold">Estimated Time</p>
                    <p className="text-gray-600">20-30 minutes</p>
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-gray-600">Main Counter</p>
                  </div>
                  <div>
                    <p className="font-semibold">Note</p>
                    <p className="text-gray-600">Please keep your order number handy</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Section */}
        <div>
          <div className="bg-orange-200 rounded-3xl p-6 border-2" style={{borderColor: '#E8DCC8'}}>
            <h3 className="text-base font-bold mb-3" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
              Order Summary
            </h3>

            <div className="space-y-2 mb-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 pt-2" style={{borderColor: '#D4C5B0'}}>
              <div className="flex justify-between font-bold text-xs">
                <span style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>Total</span>
                <span style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing || !paymentMethod}
          className="px-10 py-2 text-white text-sm font-bold rounded-full hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{backgroundColor: '#704214', fontFamily: 'Montserrat, sans-serif'}}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
