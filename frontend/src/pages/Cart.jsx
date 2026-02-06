import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { MdRestaurant, MdLocalShipping, MdShoppingBag, MdDelete } from 'react-icons/md';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [deliveryType, setDeliveryType] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setShowOrderModal(true);
  };

  const handleSelectDeliveryType = (type) => {
    setDeliveryType(type);
    setShowOrderModal(false);
    navigate('/checkout', { state: { deliveryType: type, items: cartItems, total } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{backgroundColor: '#FFFDF1', minHeight: '80vh'}}>
        <h1 className="text-3xl font-bold text-center mb-8">YOUR CART</h1>
        <div className="text-center py-11">
          <p className="text-gray-500 text-xl">Your cart is empty</p>
          <button 
            onClick={() => navigate('/menu')}
            className="mt-6 px-6 py-3 bg-amber-900 text-white rounded-full font-semibold hover:bg-amber-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4" style={{backgroundColor: '#FFFDF1', minHeight: '80vh'}}>
      <h1 className="text-3xl font-bold text-center mb-6 uppercase tracking-wide" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>Your Cart</h1>

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border-2" style={{borderColor: '#E8DCC8'}}>
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 mb-3 pb-3 border-b-2" style={{borderColor: '#D4C5B0'}}>
          <div className="font-bold text-xs uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Product</div>
          <div className="font-bold text-xs uppercase text-center" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Price</div>
          <div className="font-bold text-xs uppercase text-center" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Quantity</div>
          <div className="font-bold text-xs uppercase text-right" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Total Amount</div>
        </div>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <div key={item.id} className="grid grid-cols-4 gap-4 items-center py-3 border-b" style={{borderColor: '#E8DCC8'}}>
            {/* Product */}
            <div className="flex items-center space-x-3">
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover shadow-md"
                />
              )}
              <div>
                <h3 className="font-bold text-gray-900 text-sm" style={{fontFamily: 'Montserrat, sans-serif', color: '#704214'}}>{item.name}</h3>
                <p className="text-xs uppercase" style={{color: '#997755', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>{item.category || 'Food'}</p>
              </div>
            </div>

            {/* Price */}
            <div className="font-semibold text-center text-sm" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
              {formatCurrency(item.price)}
            </div>

            {/* Quantity and Delete */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center space-x-2 border-2 rounded-full px-3 py-1" style={{borderColor: '#D4C5B0', backgroundColor: '#FFFDF1'}}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-5 h-5 flex items-center justify-center font-bold text-sm transition-colors"
                  style={{color: '#704214'}}>
                  −
                </button>
                <span className="w-4 text-center font-bold text-xs" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-5 h-5 flex items-center justify-center font-bold text-sm transition-colors"
                  style={{color: '#704214'}}>
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="flex items-center justify-center hover:text-red-600 transition-colors p-1"
                title="Remove from cart"
                style={{color: '#704214'}}
              >
                <MdDelete size={24} />
              </button>
            </div>

            {/* Total Amount */}
            <div className="font-bold text-right text-sm" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        ))}

        {/* Total Section */}
        <div className="mt-3 pt-3 border-t-2 flex justify-between items-center" style={{borderColor: '#D4C5B0'}}>
          <span className="text-xs font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Total</span>
          <span className="text-base font-bold" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Checkout Section */}
      <div className="flex justify-center mt-4">
        <button 
          onClick={handleCheckoutClick}
          className="px-10 py-2 text-white text-sm font-bold rounded-full hover:opacity-90 transition-all shadow-md"
          style={{backgroundColor: '#704214', fontFamily: 'Montserrat, sans-serif'}}
        >
          Checkout
        </button>
      </div>

      {/* Order Options Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full mx-4 border-2" style={{borderColor: '#D4C5B0'}}>
            {/* Close Button */}
            <div className="flex justify-center items-center mb-4 relative">
              <h2 className="text-lg font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Order Options</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold absolute right-0"
              >
                ✕
              </button>
            </div>

            {/* Instruction Text */}
            <p className="text-center mb-5 text-sm font-semibold" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
              Choose your order options:
            </p>

            {/* Order Options */}
            <div className="grid grid-cols-3 gap-4">
              {/* Dine In */}
              <button
                onClick={() => handleSelectDeliveryType('dine_in')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all hover:shadow-lg"
                style={{borderColor: '#D4C5B0', backgroundColor: '#FFF5E6'}}
              >
                <MdRestaurant size={32} style={{color: '#704214', marginBottom: '6px'}} />
                <span className="text-xs font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Dine In</span>
              </button>

              {/* Pick Up */}
              <button
                onClick={() => handleSelectDeliveryType('pickup')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all hover:shadow-lg"
                style={{borderColor: '#D4C5B0', backgroundColor: '#FFF5E6'}}
              >
                <MdShoppingBag size={32} style={{color: '#704214', marginBottom: '6px'}} />
                <span className="text-xs font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Pick Up</span>
              </button>

              {/* Delivery */}
              <button
                onClick={() => handleSelectDeliveryType('delivery')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all hover:shadow-lg"
                style={{borderColor: '#D4C5B0', backgroundColor: '#FFF5E6'}}
              >
                <MdLocalShipping size={32} style={{color: '#704214', marginBottom: '6px'}} />
                <span className="text-xs font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Delivery</span>
              </button>
            </div>
          </div>
        </div>
      )}    </div>
  );
};

export default CartPage;