import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import { MdRestaurant, MdLocalShipping, MdShoppingBag, MdDelete } from 'react-icons/md';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingQuantityId, setEditingQuantityId] = useState(null);
  const [quantityInput, setQuantityInput] = useState('');
  const [showClearCartModal, setShowClearCartModal] = useState(false);

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
    } else {
      localStorage.removeItem('cart');
    }
    // Dispatch custom event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cartItems]);

  // Redirect admins away from cart page
  useEffect(() => {
    if (isAdmin) {
      toast.error('Admins cannot access the cart');
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    // Find the item to check limits
    const item = cartItems.find(ci => ci.id === itemId);
    if (!item) return;

    // Check availability limit
    const maxAvailable = item.quantity_available || 10;
    if (newQuantity > maxAvailable) {
      toast.error(`Only ${maxAvailable} items available`);
      return;
    }

    // Check max per customer limit (default 10)
    const maxPerCustomer = item.max_order_per_customer || 10;
    if (newQuantity > maxPerCustomer) {
      toast.error(`Maximum ${maxPerCustomer} items per order`);
      return;
    }

    setCartItems(cartItems.map(cartItem =>
      cartItem.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
    ));
  };

  const handleQuantityInputChange = (itemId, value) => {
    setQuantityInput(value);
  };

  const handleQuantityInputBlur = (itemId) => {
    const newQuantity = parseInt(quantityInput) || 0;
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
    setEditingQuantityId(null);
    setQuantityInput('');
  };

  const handleQuantityInputKeyPress = (itemId, e) => {
    if (e.key === 'Enter') {
      handleQuantityInputBlur(itemId);
    } else if (e.key === 'Escape') {
      setEditingQuantityId(null);
      setQuantityInput('');
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    setCartItems([]);
    setShowClearCartModal(false);
    toast.success('Cart cleared successfully');
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    if (isAdmin) {
      toast.error('Admins are not allowed to checkout');
      return;
    }
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
    setShowOrderModal(false);
    navigate('/checkout', { state: { deliveryType: type, items: cartItems, total } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-screen" style={{backgroundColor: '#FFFDF1'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen" style={{backgroundColor: '#FFFDF1'}}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8 uppercase tracking-wide" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>Your Cart</h1>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2" style={{borderColor: '#E8DCC8'}}>
        {/* Table Header - Hidden on mobile, visible on md and up */}
        <div className="hidden md:grid grid-cols-4 gap-4 mb-3 pb-3 border-b-2" style={{borderColor: '#D4C5B0'}}>
          <div className="font-bold text-xs uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Product</div>
          <div className="font-bold text-xs uppercase text-center" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Price</div>
          <div className="font-bold text-xs uppercase text-center" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Quantity</div>
          <div className="font-bold text-xs uppercase text-right" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Total Amount</div>
        </div>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 md:gap-4 items-center py-3 sm:py-4 border-b" style={{borderColor: '#E8DCC8'}}>
            {/* Product */}
            <div className="flex items-center space-x-3">
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover shadow-md flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm md:text-base truncate" style={{fontFamily: 'Montserrat, sans-serif', color: '#704214'}}>{item.name}</h3>
                <p className="text-xs uppercase truncate" style={{color: '#997755', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>{item.category || 'Food'}</p>
              </div>
            </div>

            {/* Price */}
            <div className="md:text-center">
              <span className="md:hidden text-xs font-semibold mr-2" style={{color: '#704214'}}>Price: </span>
              <div className="font-semibold text-xs sm:text-sm md:text-base" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                {formatCurrency(item.price)}
              </div>
            </div>

            {/* Quantity and Delete */}
            <div className="flex items-center justify-between md:justify-center gap-2">
              <div className="flex items-center space-x-1 sm:space-x-2 border-2 rounded-full px-2 sm:px-3 py-1" style={{borderColor: '#D4C5B0', backgroundColor: '#FFFDF1'}}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-5 h-5 flex items-center justify-center font-bold text-xs sm:text-sm transition-colors"
                  style={{color: '#704214'}}>
                  −
                </button>
                {editingQuantityId === item.id ? (
                  <input
                    type="number"
                    value={quantityInput}
                    onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                    onBlur={() => handleQuantityInputBlur(item.id)}
                    onKeyDown={(e) => handleQuantityInputKeyPress(item.id, e)}
                    autoFocus
                    min="1"
                    className="w-8 text-center font-bold text-xs outline-none bg-transparent border-b [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', borderColor: '#704214'}}
                  />
                ) : (
                  <span
                    onClick={() => {
                      setEditingQuantityId(item.id);
                      setQuantityInput(item.quantity.toString());
                    }}
                    className="w-8 text-center font-bold text-xs cursor-pointer hover:opacity-70 transition-opacity"
                    style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}
                    title="Click to edit quantity"
                  >
                    {item.quantity}
                  </span>
                )}
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-5 h-5 flex items-center justify-center font-bold text-xs sm:text-sm transition-colors"
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
                <MdDelete size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Total Amount */}
            <div className="md:text-right">
              <span className="md:hidden text-xs font-semibold mr-2" style={{color: '#704214'}}>Total: </span>
              <div className="font-bold text-xs sm:text-sm md:text-base" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          </div>
        ))}

        {/* Total Section */}
        <div className="mt-3 pt-3 sm:pt-4 border-t-2 flex justify-between items-center" style={{borderColor: '#D4C5B0'}}>
          <span className="text-xs sm:text-sm font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Total</span>
          <span className="text-base sm:text-lg md:text-xl font-bold" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Checkout Section */}
      <div className="flex flex-col items-center mt-4 sm:mt-6">
        <button 
          onClick={handleCheckoutClick}
          disabled={isAdmin}
          className="px-6 sm:px-10 py-2 sm:py-3 text-white text-xs sm:text-sm font-bold rounded-full hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{backgroundColor: '#704214', fontFamily: 'Montserrat, sans-serif'}}
        >
          {isAdmin ? 'Admins cannot checkout' : 'Checkout'}
        </button>
        
        {/* Clear Cart Button */}
        <button 
          onClick={() => setShowClearCartModal(true)}
          className="mt-3 text-xs sm:text-sm font-semibold hover:opacity-70 transition-all"
          style={{
            color: '#704214', 
            fontFamily: 'Montserrat, sans-serif',
            textDecoration: 'underline',
            textDecorationThickness: '1.5px',
            textUnderlineOffset: '4px'
          }}
        >
          Clear your cart
        </button>
      </div>

      {/* Order Options Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-md w-full border-2" style={{borderColor: '#D4C5B0'}}>
            {/* Close Button */}
            <div className="flex justify-center items-center mb-4 relative">
              <h2 className="text-base sm:text-lg font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Order Options</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold absolute right-0 w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Instruction Text */}
            <p className="text-center mb-4 sm:mb-5 text-xs sm:text-sm font-semibold" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
              Choose your order options:
            </p>

            {/* Order Options */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {/* Dine In */}
              <button
                onClick={() => handleSelectDeliveryType('dine_in')}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg sm:rounded-2xl border-2 transition-all hover:shadow-lg"
                style={{borderColor: '#D4C5B0', backgroundColor: '#FFF5E6'}}
              >
                <MdRestaurant size={24} className="sm:w-8 sm:h-8" style={{color: '#704214', marginBottom: '4px'}} />
                <span className="text-xs font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Dine In</span>
              </button>

              {/* Pick Up */}
              <button
                onClick={() => handleSelectDeliveryType('pickup')}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg sm:rounded-2xl border-2 transition-all hover:shadow-lg"
                style={{borderColor: '#D4C5B0', backgroundColor: '#FFF5E6'}}
              >
                <MdShoppingBag size={24} className="sm:w-8 sm:h-8" style={{color: '#704214', marginBottom: '4px'}} />
                <span className="text-xs font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Pick Up</span>
              </button>

              {/* Delivery */}
              <button
                onClick={() => handleSelectDeliveryType('delivery')}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg sm:rounded-2xl border-2 transition-all hover:shadow-lg"
                style={{borderColor: '#D4C5B0', backgroundColor: '#FFF5E6'}}
              >
                <MdLocalShipping size={24} className="sm:w-8 sm:h-8" style={{color: '#704214', marginBottom: '4px'}} />
                <span className="text-xs font-bold uppercase" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em'}}>Delivery</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Cart Confirmation Modal */}
      {showClearCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 max-w-xs sm:max-w-sm w-full border-2" style={{borderColor: '#D4C5B0'}}>
            {/* Header with Close */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg md:text-xl font-bold" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>Clear Cart</h2>
              <button
                onClick={() => setShowClearCartModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Message */}
            <p className="text-xs sm:text-sm md:text-base text-center mb-5 sm:mb-6 md:mb-8" style={{color: '#704214', fontFamily: 'Montserrat, sans-serif'}}>
              Clear your cart?
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowClearCartModal(false)}
                className="flex-1 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-semibold rounded-lg border-2 hover:bg-gray-50 transition-all"
                style={{color: '#704214', borderColor: '#704214', fontFamily: 'Montserrat, sans-serif'}}
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-semibold rounded-lg text-white hover:opacity-90 transition-all"
                style={{backgroundColor: '#dc2626', fontFamily: 'Montserrat, sans-serif'}}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CartPage;