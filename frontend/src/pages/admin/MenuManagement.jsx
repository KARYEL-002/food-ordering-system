import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { Trash2, Edit2, Search, Plus } from 'lucide-react';
import api from '../../utils/api';
import EditMenuItemModal from '../../components/modals/EditMenuItemModal';
import AddMenuItemModal from '../../components/modals/AddMenuItemModal';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';

const StatCard = ({ title, value, bgColor = '#FFFDF1' }) => (
  <div
    className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 rounded-lg border-2 flex flex-col justify-center"
    style={{ backgroundColor: bgColor, borderColor: '#704214' }}
  >
    <p style={{ color: '#704214' }} className="font-bold text-xs sm:text-sm uppercase tracking-wider">
      {title}
    </p>
    <p style={{ color: '#704214' }} className="text-xl sm:text-2xl font-bold mt-2 sm:mt-4">
      {value}
    </p>
  </div>
);

const MenuManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/menu-items');
      setMenuItems(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load menu items');
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    setDeletingItem(item);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setIsDeleting(true);
      await api.delete(`/menu-items/${deletingItem.id}`);
      setMenuItems(menuItems.filter(item => item.id !== deletingItem.id));
      setDeletingItem(null);
      // Hot reload - fetch fresh data
      setTimeout(() => fetchMenuItems(), 300);
    } catch (err) {
      alert('Failed to delete menu item');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const confirmEdit = async (updatedItem) => {
    try {
      setIsEditing(true);
      // Map status values to backend fields
      let availability_status = true;
      if (updatedItem.status === 'unavailable') {
        availability_status = false;
      }
      
      await api.put(`/menu-items/${updatedItem.id}`, {
        name: updatedItem.name,
        category: updatedItem.category,
        price: updatedItem.price,
        availability_status: availability_status,
        status: updatedItem.status
      });
      setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item));
      setEditingItem(null);
      // Hot reload - fetch fresh data
      setTimeout(() => fetchMenuItems(), 300);
    } catch (err) {
      alert('Failed to update menu item');
    } finally {
      setIsEditing(false);
    }
  };

  const confirmAddItem = async (formData) => {
    try {
      setIsAdding(true);
      await api.post('/menu-items', formData);
      setIsAddingItem(false);
      // Hot reload - fetch fresh data
      setTimeout(() => {
        fetchMenuItems();
      }, 300);
    } catch (err) {
      console.error('Add menu item error:', err);
      let errorMessage = 'Failed to add menu item';
      if (err.response?.data?.error) {
        errorMessage += ': ' + err.response.data.error;
      } else if (err.response?.data?.details) {
        // Validation errors
        const details = err.response.data.details;
        errorMessage += ': ' + Object.values(details).flat().join(', ');
      } else if (err.message) {
        errorMessage += ': ' + err.message;
      }
      alert(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.availability_status && item.status !== 'sold_out').length;
  const soldOutItems = menuItems.filter(item => item.status === 'sold_out').length;
  const unavailableItems = menuItems.filter(item => !item.availability_status).length;

  return (
    <div className="flex h-screen flex-col lg:flex-row" style={{ backgroundColor: '#FFFDF1' }}>
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block w-full lg:w-56">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar - Fixed on mobile, hidden on desktop */}
      <div
        className={`fixed z-40 transform transition-transform h-screen w-56 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-20">
          <AdminTopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Title */}
            <h1
              style={{ color: '#704214' }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8"
            >
              MENU MANAGEMENT
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
              <StatCard title="TOTAL ITEMS" value={totalItems} />
              <StatCard title="AVAILABLE" value={availableItems} />
              <StatCard title="SOLD OUT" value={soldOutItems} />
              <StatCard title="UNAVAILABLE" value={unavailableItems} />
            </div>

          {/* Search Bar and Add Button */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
            <div className="flex-1 relative border-2 rounded-lg" style={{ borderColor: '#704214' }}>
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-white outline-none text-xs sm:text-sm"
                style={{ color: '#704214' }}
              />
              <Search
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 sm:w-5 sm:h-5"
                size={16}
                style={{ color: '#704214' }}
              />
            </div>
            <button
              onClick={() => setIsAddingItem(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-white transition-opacity hover:opacity-80 flex items-center justify-center gap-2 flex-shrink-0 text-sm sm:text-base whitespace-nowrap"
              style={{ backgroundColor: '#00BCD4' }}
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Menu</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {/* Scrollable List Section */}
          {loading ? (
            <div className="text-center py-12">
              <p style={{ color: '#704214' }} className="font-bold">
                Loading menu items...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p style={{ color: '#704214' }} className="font-bold">
                {error}
              </p>
              <button
                onClick={fetchMenuItems}
                className="mt-4 px-6 py-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700"
              >
                Retry
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: '#704214' }} className="font-bold">
                No menu items found
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border-2" style={{ borderColor: '#704214' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#FFFDF1', borderBottom: '2px solid #704214' }}>
                    <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                      <p className="font-bold text-base">Menu Item</p>
                    </th>
                    <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                      <p className="font-bold text-base">Category</p>
                    </th>
                    <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                      <p className="font-bold text-base">Price</p>
                    </th>
                    <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                      <p className="font-bold text-base">Status</p>
                    </th>
                    <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                      <p className="font-bold text-base">Actions</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="table-row-hover fade-transition"
                      style={{
                        backgroundColor: index % 2 === 0 ? '#FFFDF1' : 'white',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <td className="px-6 py-5" style={{ color: '#704214' }}>
                        <p className="font-semibold text-base">{item.name}</p>
                      </td>
                      <td className="px-6 py-5" style={{ color: '#704214' }}>
                        <p className="text-base">{item.category || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-5" style={{ color: '#704214' }}>
                        <p className="text-base font-semibold">{parseFloat(item.price).toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-bold"
                          style={{
                            backgroundColor: 
                              item.status === 'sold_out' ? '#FFB886' :
                              item.availability_status ? '#C0F4C4' : '#FFB3B3',
                            color: 
                              item.status === 'sold_out' ? '#704214' :
                              item.availability_status ? '#065F46' : '#7C2D12'
                          }}
                        >
                          {item.status === 'sold_out' ? 'Sold Out' :
                           item.availability_status ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-5 flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1.5 rounded-lg font-bold text-white transition-opacity hover:opacity-80 flex items-center gap-1 text-sm btn-hover scale-transition"
                          style={{ backgroundColor: '#00BCD4' }}
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="px-3 py-1.5 rounded-lg font-bold text-white transition-opacity hover:opacity-80 flex items-center gap-1 text-sm btn-hover scale-transition"
                          style={{ backgroundColor: '#FF6B6B' }}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </div>
      </div>

      <EditMenuItemModal
        isOpen={!!editingItem}
        item={editingItem}
        onConfirm={confirmEdit}
        onCancel={() => setEditingItem(null)}
        isLoading={isEditing}
      />

      <AddMenuItemModal
        isOpen={isAddingItem}
        onConfirm={confirmAddItem}
        onCancel={() => setIsAddingItem(false)}
        isLoading={isAdding}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingItem}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingItem(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MenuManagement;
