import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';

const OrderCard = ({ order, onUpdateStatus, showActions, userRole }) => {
  const canUpdateStatus = (currentStatus, newStatus) => {
    const statusFlow = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['delivered', 'cancelled'],
    };
    return statusFlow[currentStatus]?.includes(newStatus);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.id}</h3>
          <p className="text-gray-600 text-sm">{formatDate(order.created_at)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.quantity}x {item.menu_item?.name || item.menu_item_name || 'Item'}
            </span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold text-lg mb-2">
          <span>Total:</span>
          <span>{formatCurrency(order.total_amount)}</span>
        </div>
        {order.special_instructions && (
          <div className="text-sm text-gray-600 mb-4">
            <span className="font-medium">Special Instructions:</span>
            <p className="mt-1">{order.special_instructions}</p>
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex flex-wrap gap-2 mt-4">
          {userRole === 'admin' && (
            <>
              {canUpdateStatus(order.status, 'confirmed') && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'confirmed')}
                  className="btn btn-primary text-sm"
                >
                  Confirm Order
                </button>
              )}
              {canUpdateStatus(order.status, 'delivered') && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'delivered')}
                  className="btn btn-primary text-sm"
                >
                  Mark Delivered
                </button>
              )}
            </>
          )}
          {userRole === 'chef' && (
            <>
              {canUpdateStatus(order.status, 'preparing') && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'preparing')}
                  className="btn btn-primary text-sm"
                >
                  Start Preparing
                </button>
              )}
              {canUpdateStatus(order.status, 'ready') && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'ready')}
                  className="btn btn-primary text-sm"
                >
                  Mark Ready
                </button>
              )}
            </>
          )}
          {(userRole === 'admin' || userRole === 'customer') && canUpdateStatus(order.status, 'cancelled') && (
            <button
              onClick={() => onUpdateStatus(order.id, 'cancelled')}
              className="btn btn-danger text-sm"
            >
              Cancel Order
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
