import { formatCurrency } from '../utils/helpers';

const MenuItemCard = ({ item, onAddToCart, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="group h-full">
      <div className="relative pt-20 transform transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        {/* Food Image - Circular at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-44 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
        </div>

        {/* Card background */}
        <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-3xl pt-24 pb-8 px-8 transition-all duration-300 hover:shadow-2xl flex flex-col h-full">
          {/* Content */}
          <div className="space-y-3 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-3" style={{fontFamily: 'Montserrat, sans-serif'}}>{item.name}</h3>
            
            {/* Description */}
            {item.description && (
              <p className="text-sm text-gray-800 leading-relaxed mb-6 flex-1">
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
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  {formatCurrency(item.price)}
                </span>
                <button
                  onClick={() => onAddToCart(item)}
                  disabled={!item.is_available}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    item.is_available
                      ? 'bg-white shadow-md hover:shadow-lg hover:bg-gray-50'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <span className="text-2xl font-light text-gray-600">+</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
