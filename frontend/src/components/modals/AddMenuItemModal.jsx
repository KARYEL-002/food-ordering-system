import { useState } from 'react';
import { Upload } from 'lucide-react';

const AddMenuItemModal = ({ isOpen, onConfirm, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    status: 'available',
    image: null,
    imagePreview: null
  });

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
      image: null,
      imagePreview: null
    });
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop overflow-y-auto">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 border-2 modal-content my-8" style={{ borderColor: '#704214' }}>
        <h2 style={{ color: '#704214' }} className="text-2xl font-bold mb-6">
          Add Menu Item
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              Menu Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 rounded-lg outline-none"
              style={{ borderColor: '#704214', color: '#704214' }}
              placeholder="e.g., Adobo (Chicken)"
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
              placeholder="e.g., Main Dishes"
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
              rows={3}
              className="w-full px-4 py-2 border-2 rounded-lg outline-none resize-y"
              style={{ borderColor: '#704214', color: '#704214' }}
              placeholder="Short description of the menu item (optional)"
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
              placeholder="0.00"
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

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              Upload Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-input"
              />
              <label
                htmlFor="image-input"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                style={{ borderColor: '#704214' }}
              >
                <Upload size={20} style={{ color: '#704214' }} />
                <span style={{ color: '#704214' }} className="font-semibold">
                  {formData.image ? formData.image.name : 'Choose Image'}
                </span>
              </label>
            </div>
            {formData.imagePreview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border-2"
                  style={{ borderColor: '#704214' }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={handleCancel}
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
              {isLoading ? 'Adding...' : 'Add Menu Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
