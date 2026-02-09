import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const usersData = response.data.data || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'customer',
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'customer',
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
        toast.success('User updated successfully');
      } else {
        await api.post('/users', {
          ...formData,
          password: Math.random().toString(36).slice(-8), // Generate temporary password
        });
        toast.success('User created successfully');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(editingUser ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex h-screen" style={{ backgroundColor: '#FFF5E6' }}>
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#704214' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#FFF5E6' }}>
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold" style={{ color: '#704214' }}>USER MANAGEMENT</h1>
          <button
            onClick={handleAddUser}
            className="px-6 py-3 rounded-2xl font-bold transition-all hover:opacity-80 whitespace-nowrap"
            style={{ backgroundColor: '#FFD9B3', color: '#704214' }}
          >
            + Add User
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border-2" style={{ borderColor: '#704214' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#FFF5E6', borderBottom: '2px solid #704214' }}>
                <th className="px-6 py-4 text-left font-bold" style={{ color: '#704214' }}>User ID</th>
                <th className="px-6 py-4 text-left font-bold" style={{ color: '#704214' }}>Name</th>
                <th className="px-6 py-4 text-left font-bold" style={{ color: '#704214' }}>Email</th>
                <th className="px-6 py-4 text-left font-bold" style={{ color: '#704214' }}>Role</th>
                <th className="px-6 py-4 text-left font-bold" style={{ color: '#704214' }}>Date Created</th>
                <th className="px-6 py-4 text-left font-bold" style={{ color: '#704214' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center" style={{ color: '#704214' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td className="px-6 py-4" style={{ color: '#704214' }}>#{String(user.id).padStart(4, '0')}</td>
                    <td className="px-6 py-4" style={{ color: '#704214' }}>{user.name}</td>
                    <td className="px-6 py-4" style={{ color: '#704214' }}>{user.email}</td>
                    <td className="px-6 py-4">
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: user.role === 'admin' ? '#FFD9B3' : '#E8F5E9',
                          color: user.role === 'admin' ? '#704214' : '#2E7D32'
                        }}
                      >
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#704214' }}>{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-3 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                          style={{ backgroundColor: '#E8E8E8', color: '#704214' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-2 rounded-lg font-semibold transition-all hover:opacity-80 text-white"
                          style={{ backgroundColor: '#E74C3C' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#704214' }}>
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#704214' }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#704214' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#704214' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#704214' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#704214' }}>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#704214' }}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg font-bold transition-all"
                    style={{ backgroundColor: '#E8E8E8', color: '#704214' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg font-bold transition-all text-white hover:opacity-80"
                    style={{ backgroundColor: '#704214' }}
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
