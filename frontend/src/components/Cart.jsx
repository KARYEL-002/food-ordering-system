import { formatCurrency } from '../utils/helpers';

const Cart = ({ items, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="card text-center py-6 sm:py-8">
        <p className="text-gray-500 text-sm sm:text-base">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Shopping Cart</h2>
      <div className="space-y-3 sm:space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b pb-3 sm:pb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="w-4 sm:w-8 text-center text-xs sm:text-base">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
              <span className="font-semibold w-16 sm:w-20 text-right text-xs sm:text-base">
                {formatCurrency(item.price * item.quantity)}
              </span>
              <button
                onClick={() => onRemove(item.id)}
                className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 sm:mt-6 pt-4 border-t">
        <div className="flex justify-between items-center text-lg sm:text-xl font-bold mb-4">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <button onClick={onCheckout} className="btn btn-primary w-full text-sm sm:text-base">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
