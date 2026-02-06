import { useState, useEffect } from 'react';

const EditPaymentModal = ({ isOpen, payment, onConfirm, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    payment_status: 'pending'
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        payment_status: payment.payment_status || 'pending'
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      ...payment,
      ...formData
    });
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 border-2 modal-content" style={{ borderColor: '#704214' }}>
        <h2 style={{ color: '#704214' }} className="text-2xl font-bold mb-6">
          Edit Payment
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              Payment Status
            </label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 rounded-lg outline-none cursor-pointer"
              style={{ borderColor: '#704214', color: '#704214' }}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-bold border-2 transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ borderColor: '#704214', color: '#704214' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ backgroundColor: '#00BCD4' }}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPaymentModal;
