import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { Trash2, Edit2 } from 'lucide-react';
import api from '../../utils/api';
import EditUserModal from '../../components/modals/EditUserModal';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import Pagination from '../../components/Pagination';

const UsersManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(users.length / pageSize) || 1;
  const pagedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => setCurrentPage(1), [users, pageSize]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (user) => {
    setDeletingUser(user);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    try {
      setIsDeleting(true);
      await api.delete(`/users/${deletingUser.id}`);
      setUsers(users.filter(user => user.id !== deletingUser.id));
      setDeletingUser(null);
      // Hot reload - fetch fresh data
      setTimeout(() => fetchUsers(), 300);
    } catch (err) {
      alert('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const confirmEdit = async (updatedUser) => {
    try {
      setIsEditing(true);
      await api.put(`/users/${updatedUser.id}`, {
        name: updatedUser.name,
        role_id: updatedUser.role_id
      });
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setEditingUser(null);
      // Hot reload - fetch fresh data
      setTimeout(() => fetchUsers(), 300);
    } catch (err) {
      alert('Failed to update user');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#FFFDF1' }}>
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar - Fixed on mobile, hidden on desktop */}
      <div
        className={`fixed z-40 transform transition-transform h-screen w-56 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-20">
          <AdminTopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Title */}
            <h1
              style={{ color: '#704214' }}
              className="text-4xl font-bold mb-8"
            >
              USER MANAGEMENT
            </h1>

            {/* Table Section */}
            {loading ? (
              <div className="text-center py-12">
                <p style={{ color: '#704214' }} className="font-bold">
                  Loading users...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p style={{ color: '#704214' }} className="font-bold">
                  {error}
                </p>
                <button
                  onClick={fetchUsers}
                  className="mt-4 px-6 py-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700"
                >
                  Retry
                </button>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: '#704214' }} className="font-bold">
                  No users found
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border-2" style={{ borderColor: '#704214' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#FFFDF1', borderBottom: '2px solid #704214' }}>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">User ID</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Name</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Roles</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Date Created</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Actions</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className="table-row-hover fade-transition"
                        style={{
                          backgroundColor: index % 2 === 0 ? '#FFFDF1' : 'white',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="font-semibold text-base">#{String(user.id).padStart(4, '0')}</p>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="text-base">{user.name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="text-base">{user.role?.name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="text-base">
                            {new Date(user.created_at).toLocaleString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-5 flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 rounded-lg transition-opacity hover:opacity-80 btn-hover scale-transition"
                            style={{ backgroundColor: '#D3D3D3', color: '#704214' }}
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 rounded-lg transition-opacity hover:opacity-80 btn-hover scale-transition"
                            style={{ backgroundColor: '#FF6B6B', color: 'white' }}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </div>
        </div>
      </div>

      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onConfirm={confirmEdit}
        onCancel={() => setEditingUser(null)}
        isLoading={isEditing}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingUser}
        title="Delete User"
        message={`Are you sure you want to delete user "${deletingUser?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingUser(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UsersManagement;
