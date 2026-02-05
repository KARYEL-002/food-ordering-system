import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import adobo from '../assets/images/adobo.png';
import bulalo from '../assets/images/sinigang.png';
import kare from '../assets/images/karekare.png';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const response = await api.get('/menu-items');
      // Backend returns { data: [...], message: "..." }
      const items = response.data.data || response.data;
      // Add placeholder images to items
      const itemsWithImages = items.slice(0, 3).map((item, index) => {
        const placeholderImages = [
          bulalo,
          kare,
          adobo
        ];
        return {
          ...item,
          image_url: item.image_url || placeholderImages[index], // Use database image if exists, otherwise placeholder
        };
      });
      setFeaturedItems(itemsWithImages);
    } catch (error) {
      console.error('Failed to load featured items', error);
      // Set placeholder items if API fails
      setFeaturedItems([
        { id: 1, name: 'Bulalo', image_url: bulalo, price: 150 },
        { id: 2, name: 'Kare-Kare', image_url: kare, price: 180 },
        { id: 3, name: 'Adobo', image_url: adobo, price: 120 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FFFDF1'}}>
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{backgroundColor: '#FFFDF1'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="relative flex items-center justify-center">
            {/* Background Rounded Box */}
            <div className="absolute left-0 right-0 mx-auto w-full max-w-4xl h-72 bg-gradient-to-r from-orange-200 to-orange-300 rounded-[8rem] shadow-lg"></div>
            
            {/* Content Container */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full max-w-5xl">
              {/* Left Image */}
              <div className="relative flex items-center justify-start pl-8 z-10">
                <div 
                  className="w-72 h-72 rounded-full overflow-hidden"
                  style={{boxShadow: '15px 15px 30px rgba(0, 0, 0, 0.2)'}}
                >
                  <img
                    src={adobo}
                    alt="Delicious adobo"
                    className="w-full h-full object-cover object-center scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center"><span class="text-9xl">🍜</span></div>';
                    }}
                  />
                </div>
              </div>

              {/* Right Content - FoodHub Title */}
              <div className="relative flex items-center justify-center z-10">
                <h1 className="text-xs font-bold text-amber-900" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  FoodHub
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-lg font-bold text-amber-900 mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>Best meals for you</h2>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
              {featuredItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group animate-fade-in-up"
                  style={{animationDelay: `${index * 150}ms`}}
                >
                  <div className="relative pt-20 transform transition-all duration-300 hover:-translate-y-2">
                    {/* Food Image - positioned to overlap the card */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-44 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                            <span className="text-6xl">🍽️</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Card background */}
                    <div style={{backgroundColor: '#ffce99'}} className="rounded-[2rem] pt-24 pb-8 px-8 transition-all duration-300 hover:shadow-2xl">
                      {/* Description text for first card only */}
                      {item.id === 1 && (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3" style={{fontFamily: 'Montserrat, sans-serif'}}>Sinigang</h3>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            Sinigang is a popular Filipino sour soup consisting of braised meat or seafood in a savory tamarind-based broth. When mixed with vegetables such as kangkong, radish, and eggplant, it provides a comforting contrast of flavors that are best served hot over a plate of steamed rice.
                          </p>
                        </div>
                      )}
                      
                      {/* Description text for second card */}
                      {item.id === 2 && (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3" style={{fontFamily: 'Montserrat, sans-serif'}}>Kare-Kare</h3>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            Kare-Kare is a traditional Filipino stew known for its rich and creamy peanut-based sauce. Made with tender oxtail, tripe, or pork and simmered with vegetables like eggplant, string beans, and banana blossoms, it's best enjoyed with bagoong (shrimp paste) to enhance its deep, savory flavor.
                          </p>
                        </div>
                      )}
                      
                      {/* Description text for third card */}
                      {item.id === 3 && (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3" style={{fontFamily: 'Montserrat, sans-serif'}}>Adobo</h3>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            Adobo is a classic Filipino dish made with chicken or pork slowly simmered in a savory blend of soy sauce, vinegar, garlic, bay leaves, and peppercorns. Its rich, tangy, and slightly salty flavor makes it one of the most iconic and well-loved dishes in Filipino cuisine, best served with steamed rice.
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>
                          PHP
                        </span>
                        <button
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
                        >
                          <span className="text-xl font-light text-gray-600">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/menu"
                className="text-xl font-semibold text-gray-900 hover:text-amber-900 transition-colors"
                style={{fontFamily: 'Montserrat, sans-serif'}}
              >
                View More
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Features Section */}
      <div className="py-20" style={{backgroundColor: '#FFFDF1'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">🍕</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Wide Selection</h3>
              <p className="text-gray-600">
                Choose from a variety of delicious dishes prepared by expert chefs
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your food delivered hot and fresh in no time
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">💳</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Easy Payment</h3>
              <p className="text-gray-600">
                Multiple payment options for your convenience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
