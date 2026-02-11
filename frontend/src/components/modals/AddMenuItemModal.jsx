import { useState } from 'react';
import { Upload } from 'lucide-react';
import { MdClose } from 'react-icons/md';

const AddMenuItemModal = ({ isOpen, onConfirm, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    status: 'available',
    quantity_available: 10,
    image: null,
    imagePreview: null
  });
  const [imageError, setImageError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type - only allow PNG and JPG
      const allowedTypes = ['image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        setImageError('Only PNG and JPG image formats are allowed');
        setFormData(prev => ({
          ...prev,
          image: null,
          imagePreview: null
        }));
        return;
      }
      
      // Clear any previous error
      setImageError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', parseFloat(formData.price));
    formDataToSend.append('availability_status', formData.status === 'available' ? 1 : 0);
    formDataToSend.append('quantity_available', parseInt(formData.quantity_available));
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    onConfirm(formDataToSend);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      status: 'available',
      quantity_available: 10,
      image: null,
      imagePreview: null
    });
    setImageError(null);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full border-2 modal-content my-8" style={{ borderColor: '#704214' }}>
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b-2" style={{ borderColor: '#E8DCC8' }}>
          <h2 style={{ color: '#704214' }} className="text-2xl font-bold">
            Add Menu Item
          </h2>
          <button
            onClick={handleCancel}
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
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 rounded-lg outline-none text-sm transition-colors"
                style={{ borderColor: '#704214', color: '#704214' }}
                placeholder="e.g., Adobo (Chicken)"
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
                placeholder="e.g., Main Dishes"
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
                placeholder="0.00"
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
                placeholder="10"
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
          <div className="mb-4">
            <label style={{ color: '#704214' }} className="block font-bold text-xs uppercase mb-1.5 tracking-wide">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border-2 rounded-lg outline-none text-sm resize-none transition-colors"
              style={{ borderColor: '#704214', color: '#704214' }}
              placeholder="Short description (optional)"
            />
          </div>

          {/* Row 5: Image Upload */}
          <div className="mb-6">
            <label style={{ color: '#704214' }} className="block font-bold text-xs uppercase mb-1.5 tracking-wide">
              Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={handleImageChange}
                className="hidden"
                id="image-input"
              />
              <label
                htmlFor="image-input"
                className="flex items-center justify-center gap-2 w-full px-3 py-2 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 text-sm"
                style={{ borderColor: '#704214' }}
              >
                <Upload size={16} style={{ color: '#704214' }} />
                <span style={{ color: '#704214' }} className="font-semibold truncate">
                  {formData.image ? formData.image.name : 'Choose Image'}
                </span>
              </label>
            </div>
            
            {imageError && (
              <div className="mt-2 p-2 bg-red-100 border border-red-400 rounded-lg">
                <p style={{ color: '#d32f2f' }} className="text-xs font-semibold">
                  {imageError}
                </p>
              </div>
            )}
            
            {formData.imagePreview && (
              <div className="mt-2 flex justify-start">
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border-2"
                    style={{ borderColor: '#704214' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t-2" style={{ borderColor: '#E8DCC8' }}>
            <button
              type="button"
              onClick={handleCancel}
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
              className="px-5 py-2 rounded-lg font-bold text-sm text-white transition-all hover:opacity-80 disabled:opacity-50"
              style={{ backgroundColor: '#00BCD4' }}
            >
              {isLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
