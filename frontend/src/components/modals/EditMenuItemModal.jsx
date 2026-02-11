import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { Save } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full border-2 modal-content overflow-hidden" style={{ borderColor: '#704214' }}>
        {/* Header */}
        <div className="bg-gradient-to-r flex justify-between items-center p-5 border-b-2" style={{ borderColor: '#E8DCC8' }}>
          <h2 style={{ color: '#704214' }} className="text-2xl font-bold">
            Edit Menu Item
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ color: '#704214' }}
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label style={{ color: '#704214' }} className="block font-bold text-xs uppercase mb-1.5 tracking-wide">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 rounded-lg outline-none text-sm transition-colors focus:shadow-sm"
                style={{ borderColor: '#704214', color: '#704214' }}
                required
              />
            </div>
            <div>
              <label style={{ color: '#704214' }} className="block font-bold text-xs uppercase mb-1.5 tracking-wide">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 rounded-lg outline-none text-sm transition-colors"
                style={{ borderColor: '#704214', color: '#704214' }}
              />
            </div>
          </div>

          {/* Row 2: Price & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label style={{ color: '#704214' }} className="block font-bold text-xs uppercase mb-1.5 tracking-wide">
                Price (₱)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border-2 rounded-lg outline-none text-sm transition-colors"
                style={{ borderColor: '#704214', color: '#704214' }}
                required
              />
            </div>
            <div>
              <label style={{ color: '#704214' }} className="block font-bold text-xs uppercase mb-1.5 tracking-wide">
                Available Qty
              </label>
              <input
                type="number"
                name="quantity_available"
                value={formData.quantity_available}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border-2 rounded-lg outline-none text-sm transition-colors"
                style={{ borderColor: '#704214', color: '#704214' }}
                required
              />
            </div>
          </div>

          {/* Row 3: Status */}
          <div className="mb-4">
            <label style={{ color: '#704214' }} className="block font-bold text-xs uppercase mb-1.5 tracking-wide">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 rounded-lg outline-none text-sm cursor-pointer transition-colors"
              style={{ borderColor: '#704214', color: '#704214' }}
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {/* Row 4: Description */}
          <div className="mb-6">
            <label style={{ color: '#704214' }} className="block font-bold text-xs uppercase mb-1.5 tracking-wide">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 rounded-lg outline-none text-sm resize-none transition-colors"
              style={{ borderColor: '#704214', color: '#704214' }}
              rows="2"
              placeholder="Item description..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t-2" style={{ borderColor: '#E8DCC8' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-80 disabled:opacity-50"
              style={{ 
                backgroundColor: '#FFFDF1',
                color: '#704214',
                border: '2px solid #704214'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-lg font-bold text-sm text-white transition-all hover:opacity-80 disabled:opacity-50 flex items-center gap-2"
              style={{ backgroundColor: '#00BCD4' }}
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItemModal;
