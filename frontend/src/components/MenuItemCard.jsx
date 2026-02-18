import { useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import OptimizedImage from './OptimizedImage';

const MenuItemCard = ({ item, onAddToCart, isAdmin, onEdit = () => {}, onDelete = () => {}, currentCartQuantity = 0 }) => {
  const [showAddToCart, setShowAddToCart] = useState(false);

  const isLowStock = item.quantity_available && item.quantity_available <= 3;
  const isOutOfStock = !item.availability_status || (item.quantity_available !== undefined && item.quantity_available <= 0);
  const maxOrderPerCustomer = item.max_order_per_customer || 10;
  const maxAvailable = item.quantity_available || 10;
  const maxAllowedQuantity = Math.min(maxOrderPerCustomer, maxAvailable);
  const isAtMaxLimit = currentCartQuantity >= maxAllowedQuantity;

  const handleAddToCart = () => {
    if (isAdmin) {
      toast.error('Admins are not allowed to add items to cart');
      return;
    }

    if (isAtMaxLimit) {
      toast.error(`You've already reached the maximum of ${maxAllowedQuantity} items for this product`);
      return;
    }

    onAddToCart(item);
    setShowAddToCart(false);
  };

  return (
    <div className="group h-full">
      <div className="relative pt-12 sm:pt-16 md:pt-16 transform transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        {/* Food Image - Circular at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 z-10 transition-smooth group-hover:scale-110 animate-pop">
          <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
            {item.image_url && (
              <OptimizedImage
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300"
              />
            )}
          </div>
        </div>

        {/* Card background */}
        <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl sm:rounded-3xl pt-12 sm:pt-16 md:pt-16 pb-4 sm:pb-5 px-4 sm:px-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] flex flex-col h-full">
          {/* Content */}
          <div className="space-y-1 sm:space-y-2 flex-1 flex flex-col">
            <h3 className="text-sm sm:text-base font-bold mb-0" style={{fontFamily: 'Montserrat, sans-serif', color: '#704214'}}>{item.name}</h3>
            
            {/* Description */}
            {item.description && (
              <p className="text-xs sm:text-sm truncate mb-2 sm:mb-3 flex-1" style={{fontFamily: 'Montserrat, sans-serif', color: '#704214'}}>
                {item.description}
              </p>
            )}

            {/* Stock Status */}
            {item.quantity_available !== undefined && !isAdmin && (
              <div className="text-xs font-semibold mb-1" style={{fontFamily: 'Montserrat, sans-serif'}}>
                {isOutOfStock ? (
                  <span className="text-red-600">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="text-orange-600">Only {item.quantity_available} left</span>
                ) : (
                  <span className="text-green-600">In Stock</span>
                )}
              </div>
            )}

            {/* Price and Button */}
            {isAdmin ? (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onEdit(item)}
                  className="btn btn-secondary flex-1 py-2 text-xs sm:text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="btn btn-danger flex-1 py-2 text-xs sm:text-sm"
                >
                  Delete
                </button>
              </div>
            ) : (
              <>
                {showAddToCart ? (
                  // Expanded Add to Cart Button with Rounded Slide Effect
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAtMaxLimit}
                    className={`relative w-full py-2 px-4 rounded-full font-bold text-xs sm:text-sm text-white overflow-hidden transition-all duration-500 ${
                      !isOutOfStock && !isAtMaxLimit
                        ? 'bg-amber-900 hover:shadow-lg active:scale-95 border-4 border-purple-500'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      animation: 'slideInRounded 0.5s ease-out'
                    }}
                  >
                    {/* Sliding background effect on hover */}
                    {!isOutOfStock && !isAtMaxLimit && (
                      <div className="absolute inset-0 bg-amber-800 transform translate-x-full hover:-translate-x-full transition-transform duration-500 rounded-full"></div>
                    )}
                    <span className="relative z-10">
                      {isAtMaxLimit ? `Limit Reached (${maxAllowedQuantity})` : 'Add to Cart'}
                    </span>
                  </button>
                ) : (
                  // Default view with price and + button OR unavailable badge
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {formatCurrency(item.price)}
                    </span>
                    {!isOutOfStock && !isAtMaxLimit ? (
                      <button
                        onClick={() => {
                          if (isAdmin) {
                            toast.error('Admins are not allowed to add items to cart');
                            return;
                          }
                          setShowAddToCart(true);
                        }}
                        className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-transform duration-300 transform overflow-hidden flex-shrink-0 bg-white shadow-md hover:shadow-lg hover:scale-110 active:scale-95"
                      >
                        {/* Subtle hover background slide */}
                        <div className="absolute inset-0 bg-gray-100 transform translate-x-full group-hover:-translate-x-full transition-transform duration-300"></div>
                        <span className="relative z-10 text-base sm:text-lg font-light text-gray-600">+</span>
                      </button>
                    ) : (
                      <div className="px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-red-500 text-white text-xs sm:text-sm font-bold flex-shrink-0" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        {isAtMaxLimit ? `Max (${maxAllowedQuantity})` : isOutOfStock ? 'Sold Out' : 'Unavailable'}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
