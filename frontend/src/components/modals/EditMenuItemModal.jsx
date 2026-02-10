import { useState, useEffect } from 'react';

const EditMenuItemModal = ({ isOpen, item, onConfirm, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    image_url: '',
    status: 'available',
    quantity_available: 10
  });

  useEffect(() => {
    if (item) {
      // Map availability_status (from backend) to status format  
      let status = 'available';
      if (item.availability_status === false) {
        status = 'unavailable';
      }
      
      setFormData({
        name: item.name || '',
        category: item.category || '',
        description: item.description || '',
        image_url: item.image_url || '',
        price: item.price ? parseFloat(item.price).toFixed(2) : '',
        status: status,
        quantity_available: item.quantity_available || 10
      });
    }
  }, [item]);

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
      ...item,
      ...formData,
      price: parseFloat(formData.price),
      quantity_available: parseInt(formData.quantity_available)
    });
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 border-2 modal-content" style={{ borderColor: '#704214' }}>
        <h2 style={{ color: '#704214' }} className="text-2xl font-bold mb-6">
          Edit Menu Item
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 rounded-lg outline-none"
              style={{ borderColor: '#704214', color: '#704214' }}
              required
            />
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 rounded-lg outline-none"
              style={{ borderColor: '#704214', color: '#704214' }}
            />
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 rounded-lg outline-none resize-none"
              style={{ borderColor: '#704214', color: '#704214' }}
              rows="3"
              placeholder="Enter item description..."
            />
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border-2 rounded-lg outline-none"
              style={{ borderColor: '#704214', color: '#704214' }}
              required
            />
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              Available Quantity
            </label>
            <input
              type="number"
              name="quantity_available"
              value={formData.quantity_available}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border-2 rounded-lg outline-none"
              style={{ borderColor: '#704214', color: '#704214' }}
              required
            />
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 rounded-lg outline-none cursor-pointer"
              style={{ borderColor: '#704214', color: '#704214' }}
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
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

export default EditMenuItemModal;
