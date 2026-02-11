import { useState, useEffect } from 'react';
import api from '../utils/api';
import MenuItemCard from '../components/MenuItemCard';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { MdGridView, MdRamenDining, MdFastfood, MdLunchDining, MdRiceBowl, MdLocalPizza, MdIcecream, MdLocalDrink, MdSearch } from 'react-icons/md';
import EditMenuItemModal from '../components/modals/EditMenuItemModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu-items');
      // Handle both response formats: { data: [...] } and direct array
      const items = response.data.data || response.data || [];
      setMenuItems(Array.isArray(items) ? items : []);
    } catch (error) {
      toast.error('Failed to load menu items');
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (!isAdmin) {
      toast.error('Only admins can edit menu items');
      return;
    }
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (updatedItem) => {
    try {
      setIsLoadingAction(true);
      // Convert status to availability_status string ('1' for available, '0' for unavailable)
      const availabilityStatus = updatedItem.status === 'available' ? '1' : '0';
      const payload = {
        name: updatedItem.name,
        description: updatedItem.description || '',
        price: parseFloat(updatedItem.price), // Convert to number
        category: updatedItem.category || '',
        image_url: updatedItem.image_url || '',
        availability_status: availabilityStatus,
        quantity_available: parseInt(updatedItem.quantity_available) || 10
      };
      
      console.log('Sending payload:', payload); // Debug log
      
      await api.put(`/menu-items/${updatedItem.id}`, payload);
      toast.success('Menu item updated successfully');
      setShowEditModal(false);
      setEditingItem(null);
      fetchMenuItems();
    } catch (error) {
      console.error('Edit error details:', error.response?.data);
      const errorMsg = error.response?.data?.details 
        ? Object.entries(error.response.data.details).map(([key, val]) => `${key}: ${val}`).join(', ')
        : 'Failed to update menu item';
      toast.error(errorMsg);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDelete = (itemId) => {
    if (!isAdmin) {
      toast.error('Only admins can delete menu items');
      return;
    }
    setDeletingItemId(itemId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoadingAction(true);
      await api.delete(`/menu-items/${deletingItemId}`);
      toast.success('Menu item deleted successfully');
      setShowDeleteModal(false);
      setDeletingItemId(null);
      fetchMenuItems();
    } catch (error) {
      toast.error('Failed to delete menu item');
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Cart state (local) — used for quick add-to-cart in this page
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const addToCart = (item) => {
    if (isAdmin) {
      toast.error('Admins are not allowed to add items to cart');
      return;
    }
    try {
      const existing = cart.find(ci => ci.id === item.id);
      
      // Check if item already exists and if adding more would exceed limit
      if (existing) {
        const maxOrderPerCustomer = item.max_order_per_customer || 10;
        const maxAvailable = item.quantity_available || 10;
        const maxAllowed = Math.min(maxOrderPerCustomer, maxAvailable);
        
        if (existing.quantity >= maxAllowed) {
          toast.error(`Maximum ${maxAllowed} items per order (${maxAvailable} available). You already have ${existing.quantity} of this item.`);
          return;
        }
      }

      let newCart = [];
      if (existing) {
        newCart = cart.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      } else {
        newCart = [...cart, { ...item, quantity: 1 }];
      }
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      // Dispatch custom event to update cart count in navbar
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${item.name} added to cart`);
    } catch (e) {
      console.error('addToCart error', e);
      toast.error('Failed to add to cart');
    }
  };

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  const getCategoryCount = (category) => {
    if (category === 'all') return menuItems.length;
    return menuItems.filter(item => item.category === category).length;
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : menuItems.filter(item => 
        item.category === selectedCategory &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'name-a-z':
        return a.name.localeCompare(b.name);
      case 'name-z-a':
        return b.name.localeCompare(a.name);
      case 'default':
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{backgroundColor: '#FFFDF1'}}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center animate-fade-in-up" style={{fontFamily: 'Montserrat, sans-serif'}}>Our Menu</h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in-up overflow-visible" style={{animationDelay: '100ms'}}>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-full bg-pink-50 border-2 border-amber-900 focus:outline-none focus:border-amber-700 pr-12"
          />
          <MdSearch className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl text-amber-900" />
        </div>
      </div>

      {/* Category Buttons - Horizontal Scroll */}
      <div className="mb-4 animate-fade-in-up" style={{overflowX: 'auto', overflowY: 'visible', animationDelay: '200ms'}}>
        <div className="flex gap-2 sm:gap-3 md:gap-4 pb-2 px-2 sm:px-0 scrollbar-hide justify-start sm:justify-center">
        {categories.map(category => {
          const categoryConfig = {
            'all': { icon: MdGridView, label: 'ALL' },
            'main dishes': { icon: MdLunchDining, label: 'MAIN DISHES' },
            'soup': { icon: MdRamenDining, label: 'SOUP' },
            'silog': { icon: MdRiceBowl, label: 'SILOG MEALS' },
            'snacks': { icon: MdLocalPizza, label: 'SNACKS' },
            'desserts': { icon: MdIcecream, label: 'DESSERTS' },
            'drinks': { icon: MdLocalDrink, label: 'DRINKS' }
          };
          
          const config = categoryConfig[category.toLowerCase()] || { icon: MdFastfood, label: category.toUpperCase() };
          const IconComponent = config.icon;
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl font-bold transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 min-w-[100px] sm:min-w-[120px] md:min-w-[140px] min-h-[100px] sm:min-h-[120px] md:min-h-[140px] flex-shrink-0 ${
                selectedCategory === category
                  ? 'bg-orange-300 text-gray-900 shadow-lg'
                  : 'bg-pink-50 text-gray-800 hover:bg-pink-100 border-2 border-gray-200'
              }`}
            >
              <IconComponent className="text-3xl sm:text-4xl md:text-5xl" style={{ color: '#562F00' }} />
              <div className="text-center">
                <div className="text-xs sm:text-sm font-bold uppercase whitespace-nowrap">
                  {config.label}
                </div>
                {category === 'all' && (
                  <div className="text-xs mt-1" style={{ color: '#562F00' }}>
                    ({getCategoryCount(category)})
                  </div>
                )}
              </div>
            </button>
          );
        })}
        </div>
      </div>

      {/* Sort Options - Cards */}
      <div className="mb-6 sm:mb-8 md:mb-10 animate-fade-in-up" style={{overflowX: 'auto', overflowY: 'visible', animationDelay: '300ms'}}>
        <div className="flex gap-2 sm:gap-2 md:gap-3 pb-2 px-2 sm:px-0 scrollbar-hide justify-start sm:justify-center flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setSortBy('default')}
            className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2 md:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap ${
              sortBy === 'default'
                ? 'bg-orange-300 text-gray-900 shadow-lg'
                : 'bg-pink-50 text-gray-800 hover:bg-pink-100 border-2 border-gray-200'
            }`}
          >
            Default
          </button>
          <button
            onClick={() => setSortBy('price-low-high')}
            className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2 md:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap ${
              sortBy === 'price-low-high'
                ? 'bg-orange-300 text-gray-900 shadow-lg'
                : 'bg-pink-50 text-gray-800 hover:bg-pink-100 border-2 border-gray-200'
            }`}
          >
            Low to High
          </button>
          <button
            onClick={() => setSortBy('price-high-low')}
            className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2 md:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap ${
              sortBy === 'price-high-low'
                ? 'bg-orange-300 text-gray-900 shadow-lg'
                : 'bg-pink-50 text-gray-800 hover:bg-pink-100 border-2 border-gray-200'
            }`}
          >
            High to Low
          </button>
          <button
            onClick={() => setSortBy('name-a-z')}
            className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2 md:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap ${
              sortBy === 'name-a-z'
                ? 'bg-orange-300 text-gray-900 shadow-lg'
                : 'bg-pink-50 text-gray-800 hover:bg-pink-100 border-2 border-gray-200'
            }`}
          >
            A to Z
          </button>
          <button
            onClick={() => setSortBy('name-z-a')}
            className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2 md:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap ${
              sortBy === 'name-z-a'
                ? 'bg-orange-300 text-gray-900 shadow-lg'
                : 'bg-pink-50 text-gray-800 hover:bg-pink-100 border-2 border-gray-200'
            }`}
          >
            Z to A
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {sortedItems.map((item, index) => (
            <div 
              key={item.id}
              className="animate-fade-in-up"
              style={{animationDelay: `${300 + (index * 100)}ms`}}
            >
              <MenuItemCard
                item={item}
                onAddToCart={addToCart}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentCartQuantity={cart.find(ci => ci.id === item.id)?.quantity || 0}
              />
            </div>
          ))}
          {sortedItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No items found in this category
            </div>
          )}
        </div>
      </div>

      {/* Edit Menu Item Modal */}
      <EditMenuItemModal
        isOpen={showEditModal}
        item={editingItem}
        onConfirm={handleEditSubmit}
        onCancel={() => {
          setShowEditModal(false);
          setEditingItem(null);
        }}
        isLoading={isLoadingAction}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Menu Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeletingItemId(null);
        }}
        isLoading={isLoadingAction}
      />
      </div>
    </div>
  );
};

export default Menu;
