import { MdClose } from 'react-icons/md';
import { formatCurrency } from '../../utils/helpers';

const OrderPreviewModal = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  const details = order.details || order.order_detail || {};
  const items = order.items || [];
  const user = order.user || {};
  const statusHistory = order.status_history || order.statusHistory || [];

  const formatDate = (d) => {
    if (!d) return null;
    try { return new Date(d).toLocaleDateString(); } catch { return d; }
  };
  const formatTime = (t) => {
    if (!t) return null;
    const parts = String(t).split(':');
    if (parts.length < 2) return t;
    const h = parseInt(parts[0], 10); const m = parts[1];
    const ampm = h >= 12 ? 'pm' : 'am';
    const hour12 = ((h + 11) % 12) + 1;
    return `${hour12}:${String(m).padStart(2,'0')} ${ampm}`;
  };

  const itemsTotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
  const deliveryFee = Number(details.delivery_fee || details.deliveryFee || order.delivery_fee || 0) || 0;
  const discount = Number(order.discount || details.discount || 0) || 0;
  const tax = Number(order.tax || details.tax || 0) || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-35 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-auto max-h-[92vh]">
        {/* Header with Yellow Accent */}
        <header className="border-b" style={{ borderColor: '#F3EDE6' }}>
          <div className="h-1" style={{ backgroundColor: '#FFD166' }} />
          <div className="p-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#704214' }}>Order #{String(order.id).padStart(4,'0')}</h1>
              <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleString()}</p>
              {order.notes && <p className="mt-3 text-sm text-gray-700">Note: {order.notes}</p>}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold" style={{ color: '#704214' }}>{formatCurrency(order.total_amount)}</p>
              <button onClick={onClose} aria-label="Close" className="mt-2 p-2 rounded-lg hover:bg-gray-100 transition">
                <MdClose size={24} style={{ color: '#704214' }} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Customer & Items */}
          <section className="lg:col-span-2 space-y-6">
            {/* Customer & Delivery Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border" style={{ borderColor: '#F3EDE6', backgroundColor: '#FFFDF1' }}>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Customer</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#704214' }}>{details.customer_name || user.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{user.email || details.customer_email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{details.customer_phone || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border" style={{ borderColor: '#F3EDE6', backgroundColor: '#FFFDF1' }}>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Delivery</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#704214' }}>{details.delivery_type || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{details.delivery_service || order.delivery_service || '—'}</p>
                  </div>
                  {details.delivery_address && <div><p className="text-xs text-gray-600">{details.delivery_address}</p></div>}
                  {(details.order_date || details.order_time) && (
                    <div className="pt-1 border-t" style={{ borderColor: '#F0E9E0' }}>
                      <p className="text-xs text-gray-600"><strong>Date:</strong> {formatDate(details.order_date) || '—'}</p>
                      {details.order_time && <p className="text-xs text-gray-600"><strong>Time:</strong> {formatTime(details.order_time)}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div>
              <h3 className="text-sm font-bold mb-3" style={{ color: '#704214' }}>Order Items</h3>
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: '#F3EDE6' }}>
                {items && items.length > 0 ? items.map((it, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between border-b last:border-b-0" style={{ borderColor: '#F3EDE6', backgroundColor: idx % 2 === 0 ? '#FAFAF8' : '#ffffff' }}>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm" style={{ color: '#704214' }}>{it.menu_item?.name || it.name || 'Item'}</h4>
                      {it.options && <p className="text-xs text-gray-500 mt-1">{it.options}</p>}
                      {it.notes && <p className="text-xs text-gray-500 mt-1">Note: {it.notes}</p>}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-gray-600 font-medium">×{it.quantity}</p>
                      <p className="font-bold text-sm mt-1" style={{ color: '#704214' }}>{formatCurrency((Number(it.price)||0)*(Number(it.quantity)||0))}</p>
                    </div>
                  </div>
                )) : <div className="p-4 text-gray-500 text-center">No items</div>}
              </div>
            </div>
          </section>

          {/* Right: Payment & Summary */}
          <aside className="space-y-4">
            {/* Payment Card */}
            <div className="p-4 rounded-lg border" style={{ borderColor: '#F3EDE6', backgroundColor: '#FFFDF1' }}>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Payment</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#704214' }}>{order.payment_method || '—'}</p>
                </div>
                {order.payment_reference && <p className="text-xs text-gray-600">Ref: {order.payment_reference}</p>}
                {details.gcash_reference && <p className="text-xs text-gray-600">GCash: {details.gcash_reference}</p>}
                {order.payment_status && <p className="text-xs text-gray-600">Status: <strong>{order.payment_status}</strong></p>}
              </div>
            </div>

            {/* Summary Card */}
            <div className="p-4 rounded-lg border" style={{ borderColor: '#F3EDE6', backgroundColor: '#ffffff' }}>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <div>Items</div>
                  <div>{formatCurrency(itemsTotal)}</div>
                </div>
                <div className="flex justify-between text-gray-600">
                  <div>Delivery</div>
                  <div>{formatCurrency(deliveryFee)}</div>
                </div>
                {discount > 0 && <div className="flex justify-between text-gray-600"><div>Discount</div><div className="text-red-600">-{formatCurrency(discount)}</div></div>}
                {tax > 0 && <div className="flex justify-between text-gray-600"><div>Tax</div><div>{formatCurrency(tax)}</div></div>}
                <div className="border-t pt-3 flex justify-between font-bold text-base" style={{ borderColor: '#F3EDE6', color: '#704214' }}>
                  <div>Total</div>
                  <div>{formatCurrency(itemsTotal + deliveryFee - discount + tax)}</div>
                </div>
              </div>
            </div>

            {/* Status History */}
            {statusHistory && statusHistory.length > 0 && (
              <div className="p-4 rounded-lg border" style={{ borderColor: '#F3EDE6', backgroundColor: '#FFFDF1' }}>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Status History</h3>
                <div className="space-y-2">
                  {statusHistory.map((s, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="font-medium" style={{ color: '#704214' }}>{s.status || s.name}</span>
                      <span className="text-gray-400">{s.created_at ? new Date(s.created_at).toLocaleString() : s.timestamp || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </main>

        {/* Footer */}
        <footer className="p-6 border-t flex justify-end" style={{ borderColor: '#F3EDE6' }}>
          <button onClick={onClose} className="px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition" style={{ backgroundColor: '#ffffff', color: '#704214', border: '2px solid #704214' }}>Close</button>
        </footer>
      </div>
    </div>
  );
};

export default OrderPreviewModal;
