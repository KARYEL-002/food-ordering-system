import { useState } from 'react';
import { Upload } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop overflow-y-auto">
      <div className="bg-white rounded-lg p-5 max-w-xs w-full mx-4 border-2 modal-content my-4" style={{ borderColor: '#704214' }}>
        <h2 style={{ color: '#704214' }} className="text-lg font-bold mb-4">
          Add Menu Item
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-xs mb-1">
              Menu Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border-2 rounded-lg outline-none text-sm"
              style={{ borderColor: '#704214', color: '#704214' }}
              placeholder="e.g., Adobo (Chicken)"
              required
            />
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-xs mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border-2 rounded-lg outline-none text-sm"
              style={{ borderColor: '#704214', color: '#704214' }}
              placeholder="e.g., Main Dishes"
            />
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-xs mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-1.5 border-2 rounded-lg outline-none resize-y text-sm"
              style={{ borderColor: '#704214', color: '#704214' }}
              placeholder="Short description (optional)"
            />
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-xs mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-1.5 border-2 rounded-lg outline-none text-sm"
              style={{ borderColor: '#704214', color: '#704214' }}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-xs mb-1">
              Available Quantity
            </label>
            <input
              type="number"
              name="quantity_available"
              value={formData.quantity_available}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-1.5 border-2 rounded-lg outline-none text-sm"
              style={{ borderColor: '#704214', color: '#704214' }}
              placeholder="10"
              required
            />
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-xs mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border-2 rounded-lg outline-none cursor-pointer text-sm"
              style={{ borderColor: '#704214', color: '#704214' }}
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-xs mb-1">
              Upload Image
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
              <div className="mt-1 p-2 bg-red-100 border border-red-400 rounded-lg">
                <p style={{ color: '#d32f2f' }} className="text-xs font-semibold">
                  {imageError}
                </p>
              </div>
            )}
            {formData.imagePreview && (
              <div className="mt-2 flex justify-center">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border-2"
                  style={{ borderColor: '#704214' }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-1.5 rounded-lg font-bold border-2 transition-opacity hover:opacity-80 disabled:opacity-50 text-sm"
              style={{ borderColor: '#704214', color: '#704214' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-1.5 rounded-lg font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-50 text-sm"
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
