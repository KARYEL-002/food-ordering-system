import { useState } from 'react';
import { formatCurrency } from '../utils/helpers';

const MenuItemCard = ({ item, onAddToCart, isAdmin, onEdit, onDelete }) => {
  const [showAddToCart, setShowAddToCart] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(item);
    setShowAddToCart(false);
  };

  return (
    <div className="group h-full">
      <div className="relative pt-16 transform transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        {/* Food Image - Circular at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 z-10 transition-smooth group-hover:scale-110 animate-pop">
          <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300"
              />
            )}
          </div>
        </div>

        {/* Card background */}
        <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-3xl pt-16 pb-5 px-6 transition-all duration-300 hover:shadow-2xl flex flex-col h-full">
          {/* Content */}
          <div className="space-y-2 flex-1 flex flex-col">
            <h3 className="text-base font-bold mb-0" style={{fontFamily: 'Montserrat, sans-serif', color: '#704214'}}>{item.name}</h3>
            
            {/* Description */}
            {item.description && (
              <p className="text-sm truncate mb-3 flex-1" style={{fontFamily: 'Montserrat, sans-serif', color: '#704214'}}>
                {item.description}
              </p>
            )}

            {/* Price and Button */}
            {isAdmin ? (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onEdit(item)}
                  className="btn btn-secondary flex-1 py-2 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="btn btn-danger flex-1 py-2 text-sm"
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
                    disabled={!item.availability_status}
                    className={`relative w-full py-2 px-4 rounded-full font-bold text-sm text-white overflow-hidden transition-all duration-500 ${
                      item.availability_status
                        ? 'bg-amber-900 hover:shadow-lg active:scale-95 border-4 border-purple-500'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      animation: 'slideInRounded 0.5s ease-out'
                    }}
                  >
                    {/* Sliding background effect on hover */}
                    {item.availability_status && (
                      <div className="absolute inset-0 bg-amber-800 transform translate-x-full hover:-translate-x-full transition-transform duration-500 rounded-full"></div>
                    )}
                    <span className="relative z-10">Add to Cart</span>
                  </button>
                ) : (
                  // Default view with price and + button
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      {formatCurrency(item.price)}
                    </span>
                    <button
                      onClick={() => setShowAddToCart(true)}
                      disabled={!item.availability_status}
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform overflow-hidden ${
                        item.availability_status
                          ? 'bg-white shadow-md hover:shadow-lg hover:scale-110 active:scale-95'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {/* Subtle hover background slide */}
                      {item.availability_status && (
                        <div className="absolute inset-0 bg-gray-100 transform translate-x-full group-hover:-translate-x-full transition-transform duration-300"></div>
                      )}
                      <span className="relative z-10 text-lg font-light text-gray-600">+</span>
                    </button>
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
