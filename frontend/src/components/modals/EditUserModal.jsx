import { useState, useEffect } from 'react';
import api from '../../utils/api';

const EditUserModal = ({ isOpen, user, onConfirm, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    role_id: ''
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        role_id: user.role_id || (user.role?.id) || ''
      });
    }
  }, [user]);

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

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
      ...user,
      ...formData,
      role_id: parseInt(formData.role_id)
    });
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 border-2 modal-content" style={{ borderColor: '#704214' }}>
        <h2 style={{ color: '#704214' }} className="text-2xl font-bold mb-6">
          Edit User
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              User ID
            </label>
            <input
              type="text"
              value={`#${String(user.id).padStart(4, '0')}`}
              disabled
              className="w-full px-4 py-2 border-2 rounded-lg bg-gray-100 outline-none"
              style={{ borderColor: '#704214', color: '#704214' }}
            />
          </div>

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
              Role
            </label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 rounded-lg outline-none cursor-pointer"
              style={{ borderColor: '#704214', color: '#704214' }}
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email || 'N/A'}
              disabled
              className="w-full px-4 py-2 border-2 rounded-lg bg-gray-100 outline-none"
              style={{ borderColor: '#704214', color: '#704214' }}
            />
          </div>

          <div>
            <label style={{ color: '#704214' }} className="block font-bold text-sm mb-2">
              Date Created
            </label>
            <input
              type="text"
              value={new Date(user.created_at).toLocaleDateString('en-US')}
              disabled
              className="w-full px-4 py-2 border-2 rounded-lg bg-gray-100 outline-none"
              style={{ borderColor: '#704214', color: '#704214' }}
            />
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

export default EditUserModal;
