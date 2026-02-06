import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import MenuItemCard from '../components/MenuItemCard';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { MdGridView, MdRamenDining, MdFastfood, MdLunchDining, MdRiceBowl, MdLocalPizza, MdIcecream, MdLocalDrink, MdSearch, MdMenu } from 'react-icons/md';

const Menu = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const { user } = useAuth();

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
    try {
      const existing = cart.find(ci => ci.id === item.id);
      let newCart = [];
      if (existing) {
        newCart = cart.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      } else {
        newCart = [...cart, { ...item, quantity: 1 }];
      }
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
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

  const handleCheckout = async (deliveryType, specialInstructions) => {
    try {
      const orderData = {
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        delivery_type: deliveryType,
        special_instructions: specialInstructions || null,
      };

      await api.post('/orders', orderData);
      setCart([]);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8" style={{backgroundColor: '#FFFDF1'}}>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center animate-fade-in-up" style={{fontFamily: 'Montserrat, sans-serif'}}>Our Menu</h1>

      {/* Search Bar and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '100ms'}}>
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
        <div className="relative z-50">
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-orange-300 rounded-2xl hover:bg-orange-400 transition-colors flex items-center justify-center"
          >
            <MdMenu className="text-2xl text-gray-900" />
          </button>
          
          {/* Filter Dropdown */}
          {showFilter && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border-2 border-gray-200">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Sort By</div>
                <button
                  onClick={() => { setSortBy('default'); setShowFilter(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    sortBy === 'default' ? 'bg-orange-100 text-orange-900 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => { setSortBy('price-low-high'); setShowFilter(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    sortBy === 'price-low-high' ? 'bg-orange-100 text-orange-900 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => { setSortBy('price-high-low'); setShowFilter(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    sortBy === 'price-high-low' ? 'bg-orange-100 text-orange-900 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Price: High to Low
                </button>
                <button
                  onClick={() => { setSortBy('name-a-z'); setShowFilter(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    sortBy === 'name-a-z' ? 'bg-orange-100 text-orange-900 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Name: A to Z
                </button>
                <button
                  onClick={() => { setSortBy('name-z-a'); setShowFilter(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    sortBy === 'name-z-a' ? 'bg-orange-100 text-orange-900 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Name: Z to A
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Buttons - Horizontal Scroll */}
      <div className="mb-8 sm:mb-10 md:mb-12 animate-fade-in-up overflow-x-auto" style={{animationDelay: '200ms'}}>
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

      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {sortedItems.map((item, index) => (
              <div 
                key={item.id}
                className="animate-fade-in-up"
                style={{animationDelay: `${300 + (index * 100)}ms`}}
              >
                <MenuItemCard
                  item={item}
                  onAddToCart={addToCart}
                />
              </div>
            ))}
          </div>
          {sortedItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No items found in this category
            </div>
          )}
        </div>
      </div>
  );
};

export default Menu;
