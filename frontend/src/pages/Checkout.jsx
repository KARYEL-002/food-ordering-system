import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { MdArrowBack } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deliveryType, items, total } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [gcashReference, setGcashReference] = useState('');
  const [showQRPreview, setShowQRPreview] = useState(false);
  const orderIdRef = useRef(null);
  const qrRef = useRef(null);
  const { isAdmin, user } = useAuth();
  
  // Form fields
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    orderDate: new Date().toISOString().split('T')[0],
    orderTime: '12:00',
    deliveryAddress: '',
    deliveryService: 'standard'
  });

  // Validation errors state
  const [errors, setErrors] = useState({
    customerName: '',
    customerPhone: '',
    orderDate: '',
    orderTime: '',
    deliveryAddress: '',
    deliveryService: '',
    paymentMethod: '',
    gcashReference: ''
  });

  // Delivery service tiers
  const deliveryServices = [
    { id: 'saver', label: 'Saver', fee: 50, time: '1 hour' },
    { id: 'standard', label: 'Standard', fee: 100, time: '30-45 min' },
    { id: 'priority', label: 'Priority', fee: 150, time: '5-15 min' }
  ];


  // Auto-fill customer name from logged-in user
  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name
      }));
    }
  }, [user]);

  // Validation rules
  const validateName = (name) => {
    if (!name.trim()) {
      return 'Full name is required';
    }
    if (name.trim().length < 3) {
      return 'Full name must be at least 3 characters';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return 'Full name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    // Philippine phone number validation (09XX XXX XXXX or +63 9XX XXX XXXX)
    const phoneRegex = /^(?:09\d{9}|\+639\d{9}|09\d{2}\s\d{3}\s\d{4})$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Please enter a valid Philippine phone number (09XXXXXXXXX)';
    }
    return '';
  };

  const validateDate = (date) => {
    if (!date) {
      return 'Order date is required';
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'Order date cannot be in the past';
    }
    return '';
  };

  const validateTime = (time, date = formData.orderDate) => {
    if (!time) {
      return 'Order time is required';
    }
    // Basic time format validation (HH:MM)
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return 'Please enter a valid time';
    }
    
    // Check if time is in the past for today's date
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    // If selected date is today, check if time is in the past
    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const selectedTime = new Date();
      selectedTime.setHours(hours, minutes, 0, 0);
      
      if (selectedTime <= now) {
        return 'Order time cannot be in the past';
      }
    }
    
    return '';
  };

  const validateDeliveryAddress = (address) => {
    if (deliveryType !== 'delivery') {
      return '';
    }
    if (!address.trim()) {
      return 'Delivery address is required';
    }
    if (address.trim().length < 10) {
      return 'Delivery address must be at least 10 characters';
    }
    return '';
  };

  const validateDeliveryService = (service) => {
    if (!service) {
      return 'Please select a delivery service';
    }
    return '';
  };

  const validateGcashReference = (reference) => {
    const ref = reference.trim();
    if (!ref) {
      return 'Transaction reference is required for GCash payment';
    }
    if (!/^\d+$/.test(ref)) {
      return 'Reference must contain only numbers';
    }
    if (ref.length < 5) {
      return 'Please enter a valid transaction reference';
    }
    if (ref.length > 13) {
      return 'Reference cannot exceed 13 digits';
    }
    return '';
  };

  // Helper function to get minimum time for today's date
  const getMinTimeForDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // If selected date is today, calculate minimum time (add 30 minutes to current time)
    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date();
      const minTime = new Date(now.getTime() + 30 * 60000); // Add 30 minutes
      const hours = String(minTime.getHours()).padStart(2, '0');
      const minutes = String(minTime.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    return '00:00'; // For future dates, allow any time
  };

  const validateForm = () => {
    const newErrors = {
      customerName: validateName(formData.customerName),
      customerPhone: validatePhone(formData.customerPhone),
      orderDate: validateDate(formData.orderDate),
      orderTime: validateTime(formData.orderTime),
      deliveryAddress: validateDeliveryAddress(formData.deliveryAddress),
      deliveryService: deliveryType === 'delivery' ? validateDeliveryService(formData.deliveryService) : '',
      paymentMethod: !paymentMethod ? 'Payment method is required' : '',
      gcashReference: paymentMethod === 'gcash' ? validateGcashReference(gcashReference) : ''
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Lightweight form validity checker that doesn't mutate error state
  const isFormValidNow = () => {
    if (!paymentMethod) return false;
    if (validateName(formData.customerName)) return false;
    if (validatePhone(formData.customerPhone)) return false;
    if (validateDate(formData.orderDate)) return false;
    if (validateTime(formData.orderTime)) return false;
    if (validateDeliveryAddress(formData.deliveryAddress)) return false;
    if (deliveryType === 'delivery' && validateDeliveryService(formData.deliveryService)) return false;
    if (paymentMethod === 'gcash') {
      const gErr = validateGcashReference(gcashReference);
      if (gErr) return false;
    }
    return true;
  };

  if (!deliveryType || !items) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{backgroundColor: '#FFFDF1', minHeight: '80vh'}}>
        <p className="text-center text-gray-500 text-xl">Invalid checkout session</p>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (isAdmin) {
      toast.error('Admins are not allowed to place orders');
      return;
    }

    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsProcessing(true);
    try {
      const selectedService = deliveryServices.find(s => s.id === formData.deliveryService);
      const deliveryFee = (deliveryType === 'delivery' && selectedService) ? selectedService.fee : 0;
      const totalAmount = total + deliveryFee;

      const orderData = {
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
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          order_date: formData.orderDate,
          order_time: formData.orderTime,
          delivery_address: deliveryType === 'delivery' ? formData.deliveryAddress : null,
          delivery_service: deliveryType === 'delivery' ? formData.deliveryService : null,
          delivery_fee: deliveryFee
        },
        ...(paymentMethod === 'gcash' && { gcash_reference: gcashReference })
      };

      console.log('Sending order data:', orderData);
      const response = await api.post('/orders', orderData);
      console.log('Order response:', response.data);
      
      // Extract order ID from database response
      const newOrderId = response.data?.data?.id;
      if (newOrderId) {
        setOrderId(newOrderId);
        setShowOrderModal(true);
      } else {
        toast.error('Order created but unable to retrieve order ID');
        return;
      }
      
      localStorage.removeItem('cart');
      toast.success('Order placed successfully!');
      // Do not navigate yet, wait for user to save order id
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

    // Real-time validation
    let error = '';
    switch (name) {
      case 'customerName':
        error = validateName(value);
        break;
      case 'customerPhone':
        error = validatePhone(value);
        break;
      case 'orderDate':
        error = validateDate(value);
        // If date changed, re-validate the time with the new date
        if (!error) {
          setFormData(prev => ({
            ...prev,
            orderTime: prev.orderTime || getMinTimeForDate(value)
          }));
          error = validateTime(formData.orderTime, value);
          setErrors(prev => ({
            ...prev,
            orderTime: error
          }));
        }
        break;
      case 'orderTime':
        error = validateTime(value);
        break;
      case 'deliveryAddress':
        error = validateDeliveryAddress(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
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

  // Save order id as image
  const handleSaveOrderId = async () => {
    if (!orderIdRef.current) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(orderIdRef.current);
      const link = document.createElement('a');
      link.download = `order-id-${orderId}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Order ID saved successfully!');
    } catch (error) {
      console.error('Error saving order ID:', error);
      toast.error('Failed to save order ID');
    }
  };

  // Save QR code
  const handleSaveQR = () => {
    const link = document.createElement('a');
    link.download = 'instapay-qr.jpg';
    link.href = '/images/instapay.jpg';
    link.click();
  };

  return (
    <>
      {/* QR Code Preview Modal */}
      {showQRPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{color: '#704214'}}>Online Payment QR</h3>
              <button
                onClick={() => setShowQRPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-center">
              <img 
                src="/images/instapay.jpg"
                alt="GCash QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code to complete the payment
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleSaveQR}
                className="flex-1 py-2.5 text-white font-bold rounded-lg hover:opacity-90 transition-all"
                style={{backgroundColor: '#704214'}}
              >
                Download QR
              </button>
              <button
                onClick={() => setShowQRPreview(false)}
                className="flex-1 py-2.5 border-2 font-bold rounded-lg hover:bg-gray-50 transition-all"
                style={{borderColor: '#704214', color: '#704214'}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order ID Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xs w-full text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>
            <div ref={orderIdRef} className="mb-4">
              <h2 className="text-lg font-bold mb-2" style={{color: '#704214'}}>Order Placed!</h2>
              <span className="block text-xs text-gray-700 mb-3">Here is your order ID. Make sure you screenshot or save this for your proof of order.</span>
              <span className="block text-2xl font-mono font-bold tracking-widest bg-[#FFFDF1] border-2 border-[#D4C5B0] rounded-lg px-4 py-3 mx-auto w-fit select-all" style={{color: '#704214'}}>
                {orderId}
              </span>
            </div>
            <button
              onClick={handleSaveOrderId}
              className="w-full py-2 mb-2 rounded-lg font-bold text-white transition-all text-sm"
              style={{backgroundColor: '#704214'}}
            >
              Save to Device
            </button>
            <button
              onClick={() => { setShowOrderModal(false); navigate('/orders'); }}
              className="w-full py-2 rounded-lg font-bold border-2 bg-white hover:bg-[#F5EBE0] transition-all text-sm"
              style={{color: '#704214', borderColor: '#704214'}}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-1 sm:px-1.5 md:px-2 lg:px-3 py-4 sm:py-6 md:py-8" style={{backgroundColor: '#FFFDF1', minHeight: '80vh'}}>
        <style>
          {`
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
            input[type="date"],
            input[type="time"] {
              color-scheme: light;
              accent-color: #704214;
            }
            input[type="date"]::-webkit-calendar-picker-indicator,
            input[type="time"]::-webkit-calendar-picker-indicator {
              cursor: pointer;
              background-color: #F5EBE0;
            }
            input[type="date"]::-webkit-calendar-picker-indicator:hover,
            input[type="time"]::-webkit-calendar-picker-indicator:hover {
              background-color: #E8DCC8;
            }
            input[type="date"]::-webkit-datetime-edit-fields-wrapper,
            input[type="time"]::-webkit-datetime-edit-fields-wrapper {
              color: #704214;
            }
            input[type="date"]:focus,
            input[type="time"]:focus {
              outline: none;
            }
          `}
        </style>

      {/* Back Button and Title */}
      <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1 text-base sm:text-lg font-semibold hover:opacity-70 transition p-1"
          style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}
        >
          <MdArrowBack size={20} className="sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
          {getDeliveryTypeLabel()}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Left Column - Form Fields and Payment */}
        <div className="space-y-4">
          {/* Customer Information */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 border-2" style={{borderColor: '#E8DCC8'}}>
            <h2 className="text-sm sm:text-base font-bold mb-4" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
              Your Information
            </h2>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-xs font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                Full Name <span style={{color: '#dc2626'}}>*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className={`w-full px-3 py-2 rounded-lg border-2 text-xs sm:text-sm transition-colors ${
                  errors.customerName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                style={{
                  borderColor: errors.customerName ? '#dc2626' : '#D4C5B0',
                  backgroundColor: errors.customerName ? '#fee2e2' : '#FFFDF1'
                }}
              />
              {errors.customerName && (
                <p className="text-xs text-red-600 mt-1 font-semibold">{errors.customerName}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-xs font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                Phone Number <span style={{color: '#dc2626'}}>*</span>
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="09XXXXXXXXX"
                className={`w-full px-3 py-2 rounded-lg border-2 text-xs sm:text-sm transition-colors`}
                style={{
                  borderColor: errors.customerPhone ? '#dc2626' : '#D4C5B0',
                  backgroundColor: errors.customerPhone ? '#fee2e2' : '#FFFDF1'
                }}
              />
              {errors.customerPhone && (
                <p className="text-xs text-red-600 mt-1 font-semibold">{errors.customerPhone}</p>
              )}
            </div>

            {/* Date & Time - Only for Dine In and Pickup */}
            {deliveryType !== 'delivery' && (
              <>
                <label className="block text-xs sm:text-sm font-semibold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                  Choose your preferred time and date of dining in
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                      Date <span style={{color: '#dc2626'}}>*</span>
                    </label>
                    <input
                      type="date"
                      name="orderDate"
                      value={formData.orderDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 text-xs sm:text-sm font-medium transition-colors"
                      style={{
                        borderColor: errors.orderDate ? '#dc2626' : '#704214',
                        backgroundColor: errors.orderDate ? '#fee2e2' : '#FFFDF1',
                        color: '#704214',
                        fontFamily: 'Montserrat, sans-serif'
                      }}
                    />
                    {errors.orderDate && (
                      <p className="text-xs text-red-600 mt-1 font-semibold">{errors.orderDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                      Time <span style={{color: '#dc2626'}}>*</span>
                    </label>
                    <input
                      type="time"
                      name="orderTime"
                      value={formData.orderTime}
                      min={getMinTimeForDate(formData.orderDate)}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 text-xs sm:text-sm font-medium transition-colors"
                      style={{
                        borderColor: errors.orderTime ? '#dc2626' : '#704214',
                        backgroundColor: errors.orderTime ? '#fee2e2' : '#FFFDF1',
                        color: '#704214',
                        fontFamily: 'Montserrat, sans-serif'
                      }}
                    />
                    {errors.orderTime && (
                      <p className="text-xs text-red-600 mt-1 font-semibold">{errors.orderTime}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Delivery specific */}
            {deliveryType === 'delivery' && (
              <>
                <div className="mb-4">
                  <label className="block text-xs font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    Delivery Address <span style={{color: '#dc2626'}}>*</span>
                  </label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your complete delivery address"
                    rows="3"
                    className="w-full px-3 py-2 rounded-lg border-2 text-xs sm:text-sm transition-colors resize-none"
                    style={{
                      borderColor: errors.deliveryAddress ? '#dc2626' : '#D4C5B0',
                      backgroundColor: errors.deliveryAddress ? '#fee2e2' : '#FFFDF1'
                    }}
                  />
                  {errors.deliveryAddress && (
                    <p className="text-xs text-red-600 mt-1 font-semibold">{errors.deliveryAddress}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Delivery Service Section - Only show for delivery type */}
          {deliveryType === 'delivery' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 border-2 transition-colors mb-4" style={{
              borderColor: errors.deliveryService ? '#dc2626' : '#E8DCC8',
              backgroundColor: errors.deliveryService ? '#fee2e2' : '#FFFDF1'
            }}>
              <h2 className="text-sm sm:text-base font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                Delivery Service <span style={{color: '#dc2626'}}>*</span>
              </h2>
              <p className="text-gray-600 mb-4 text-xs" style={{fontFamily: 'Montserrat, sans-serif'}}>
                Select your preferred service level
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {deliveryServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({...prev, deliveryService: service.id}));
                      setErrors(prev => ({...prev, deliveryService: ''}));
                    }}
                    className="p-3 rounded-lg border-2 text-left transition-all"
                    style={{
                      borderColor: formData.deliveryService === service.id ? '#704214' : '#D4C5B0',
                      backgroundColor: formData.deliveryService === service.id ? '#F5EBE0' : '#FFFDF1',
                    }}
                  >
                    <p className="font-bold text-xs sm:text-sm" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                      {service.label}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">₱{service.fee} • {service.time}</p>
                  </button>
                ))}
              </div>
              {errors.deliveryService && (
                <p className="text-xs text-red-600 mt-2 font-semibold">{errors.deliveryService}</p>
              )}
            </div>
          )}

          {/* Payment Method Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 border-2 transition-colors" style={{
            borderColor: errors.paymentMethod ? '#dc2626' : '#E8DCC8',
            backgroundColor: errors.paymentMethod ? '#fee2e2' : '#FFFDF1'
          }}>
            <h2 className="text-sm sm:text-base font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
              Payment Method <span style={{color: '#dc2626'}}>*</span>
            </h2>
            <p className="text-gray-600 mb-4 text-xs" style={{fontFamily: 'Montserrat, sans-serif'}}>
              Choose your payment method
            </p>

            <div className="space-y-3">
              {/* Cash Option */}
              <button
                onClick={() => setPaymentMethod(paymentMethod === 'cash' ? null : 'cash')}
                className="w-full transition-all rounded-xl sm:rounded-2xl border-2 duration-300"
                style={{
                  borderColor: errors.paymentMethod ? '#dc2626' : '#704214',
                  backgroundColor: paymentMethod === 'cash' ? '#F5EBE0' : '#FFFDF1',
                  color: '#704214',
                  fontFamily: 'Montserrat, sans-serif',
                  padding: '12px 16px',
                  minHeight: paymentMethod === 'cash' ? '80px' : '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <span className="font-semibold text-sm sm:text-base">Cash</span>
                {paymentMethod === 'cash' && (
                  <span className="text-xs mt-2 payment-message" style={{color: '#704214'}}>
                    {getCashMessage()}
                  </span>
                )}
              </button>

              {/* Online Payment Option */}
              <button
                onClick={() => {
                  setPaymentMethod(paymentMethod === 'gcash' ? null : 'gcash');
                  setGcashReference('');
                }}
                className="w-full transition-all rounded-xl sm:rounded-2xl border-2 duration-300"
                style={{
                  borderColor: errors.paymentMethod ? '#dc2626' : '#704214',
                  backgroundColor: paymentMethod === 'gcash' ? '#F5EBE0' : '#FFFDF1',
                  color: '#704214',
                  fontFamily: 'Montserrat, sans-serif',
                  padding: '12px 16px',
                  minHeight: paymentMethod === 'gcash' ? 'auto' : '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <span className="font-semibold text-sm sm:text-base">Online Payment</span>
                {paymentMethod === 'gcash' && (
                  <span className="text-xs mt-2 payment-message" style={{color: '#704214'}}>
                    Scan QR and send reference number
                  </span>
                )}
              </button>
            </div>

            {errors.paymentMethod && (
              <p className="text-xs text-red-600 mt-3 font-semibold">{errors.paymentMethod}</p>
            )}

            {/* GCash Payment Details */}
            {paymentMethod === 'gcash' && (
              <div className="mt-4 pt-4 border-t-2" style={{borderColor: '#D4C5B0'}}>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                  <h3 className="text-sm font-bold mb-3 text-center" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    GCash Payment QR
                  </h3>
                  <div className="flex justify-center mb-3">
                    <div className="bg-white p-3 rounded-lg border-2 border-gray-300 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowQRPreview(true)}>
                      <img 
                        ref={qrRef}
                        src="/images/instapay.jpg" 
                        alt="GCash QR Code"
                        className="w-40 h-40 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center mb-3">
                    <button
                      type="button"
                      onClick={() => setShowQRPreview(true)}
                      className="px-3 py-1.5 bg-white border-2 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-all"
                      style={{borderColor: '#704214', color: '#704214'}}
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveQR}
                      className="px-3 py-1.5 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-all"
                      style={{backgroundColor: '#704214'}}
                    >
                      Save QR
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Click to preview or scan the QR code to complete your GCash payment
                  </p>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-bold mb-2" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    Transaction Reference <span style={{color: '#dc2626'}}>*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={13}
                    value={gcashReference}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 13);
                      setGcashReference(digits);
                      if (digits.trim()) {
                        setErrors(prev => ({...prev, gcashReference: ''}));
                      }
                    }}
                    onKeyDown={(e) => {
                      // allow control keys, navigation, etc.
                      if (e.key.length === 1 && /\D/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const paste = (e.clipboardData || window.clipboardData).getData('text');
                      e.preventDefault();
                      const digits = paste.replace(/\D/g, '').slice(0, 13);
                      if (digits) setGcashReference(prev => (prev + digits).slice(0, 13));
                    }}
                    placeholder="Enter GCash transaction reference (numbers only, max 13 digits)"
                    className={`w-full px-3 py-2 rounded-lg border-2 text-xs sm:text-sm transition-colors ${
                      errors.gcashReference ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    style={{
                      borderColor: errors.gcashReference ? '#dc2626' : '#D4C5B0',
                      backgroundColor: errors.gcashReference ? '#fee2e2' : '#FFFDF1'
                    }}
                  />
                  {errors.gcashReference && (
                    <p className="text-xs text-red-600 mt-1 font-semibold">{errors.gcashReference}</p>
                  )}
                </div>
              </div>
            )}

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
          <div className="bg-orange-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2" style={{borderColor: '#E8DCC8'}}>
            <h3 className="text-sm sm:text-base font-bold mb-3" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
              Order Summary
            </h3>

            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs sm:text-sm">
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
              {deliveryType === 'delivery' && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>Delivery Fee</span>
                  <span style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                    {formatCurrency(deliveryServices.find(s => s.id === formData.deliveryService)?.fee || 0)}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-bold text-xs sm:text-sm mt-2">
                <span style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>Total</span>
                <span style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                  {formatCurrency(total + (deliveryType === 'delivery' ? (deliveryServices.find(s => s.id === formData.deliveryService)?.fee || 0) : 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="flex justify-center mt-6 sm:mt-8">
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing || !isFormValidNow() || isAdmin}
          className="px-6 sm:px-10 py-2 sm:py-3 text-white text-xs sm:text-sm font-bold rounded-full hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{backgroundColor: '#704214', fontFamily: 'Montserrat, sans-serif'}}
        >
          {isProcessing ? 'Processing...' : isAdmin ? 'Admins cannot place orders' : 'Place Order'}
        </button>
      </div>
      </div>
    </>
  );
};

export default CheckoutPage;
