import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import OptimizedImage from '../components/OptimizedImage';
import { preloadImages, prefetchImages } from '../utils/imageLoader';
import adobo from '../assets/images/adobo.png';
import bulalo from '../assets/images/sinigang.png';
import kare from '../assets/images/karekare.png';
const Home = () => {
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Preload critical hero image for better performance
    preloadImages([adobo]);
    // Prefetch other featured images
    prefetchImages([bulalo, kare]);
    
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const response = await api.get('/menu-items');
      // Backend returns { data: [...], message: "..." }
      const items = response.data.data || response.data;
      // Add placeholder images to items and guard against empty/null image values
      const placeholderImages = [bulalo, kare, adobo];
      const itemsWithImages = items.slice(0, 3).map((item, index) => {
        const imageFromApi = item && item.image_url ? String(item.image_url).trim() : '';
        return {
          ...item,
          image_url: imageFromApi ? imageFromApi : placeholderImages[index], // Use database image if non-empty, otherwise placeholder
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

  const handleViewMoreClick = () => {
    navigate('/menu');
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FFFDF1'}}>
      {/* Hero Section */}
      <div style={{backgroundColor: '#FFFDF1'}} className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left: Text Content */}
            <div className="space-y-3 sm:space-y-4 animate-fade-in-up">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-amber-950" style={{fontFamily: 'Montserrat, sans-serif'}}>
                Enjoy <span style={{color: '#f4c496'}}>Delicious<br/>Food</span> In Your<br/>Healthy Life
              </h1>
              <p className="text-[#704214] text-sm sm:text-base md:text-lg max-w-md leading-relaxed">
                Enjoy a wide selection of delicious Filipino dishes made with fresh ingredients. Order now and experience authentic flavors delivered right to your door.
              </p>
              <Link 
                to="/menu"
                className="inline-block font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                style={{backgroundColor: '#f4c496', color: '#704214', fontFamily: 'Montserrat, sans-serif'}}
                onMouseOver={e => { e.target.style.backgroundColor = '#ffce99'; }}
                onMouseOut={e => { e.target.style.backgroundColor = '#f4c496'; }}
              >
                Order Now →
              </Link>
            </div>

            {/* Right: Food Image */}
            <div className="relative animate-fade-in-up" style={{animationDelay: '200ms'}}>
              <div className="relative max-w-sm sm:max-w-md mx-auto">
                <OptimizedImage
                  src={adobo}
                  alt="Delicious Filipino Food"
                  className="w-full h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-base sm:text-lg font-bold text-amber-900 mb-2 sm:mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>Best meals for you</h2>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
              {featuredItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group animate-fade-in-up"
                  style={{animationDelay: `${index * 150}ms`}}
                >
                  <div className="relative pt-16 sm:pt-28 transform transition-all duration-300 hover:-translate-y-2">
                    {/* Food Image - perfectly circular */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <div className="w-full h-full rounded-full overflow-hidden shadow-lg border-4 border-orange-200">
                        <OptimizedImage
                            src={index === 0 ? adobo : index === 1 ? bulalo : kare}
                            alt={index === 0 ? 'Adobo' : index === 1 ? 'Sinigang' : 'Kare-Kare'}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 p-2 rounded-full"
                          />
                      </div>
                    </div>
                    {/* Card background */}
                    <div style={{backgroundColor: '#ffce99'}} className="rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] pt-16 sm:pt-24 md:pt-36 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-6 md:px-10 min-h-[300px] sm:min-h-[350px] md:min-h-[420px] transition-all duration-300 hover:shadow-2xl flex flex-col">
                      <div className="mb-4 sm:mb-6">
                        <div className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3" style={{fontFamily: 'Montserrat, sans-serif'}}>
                          {index === 0 ? 'Adobo' : index === 1 ? 'Sinigang' : 'Kare-Kare'}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                          {index === 0 && 'Adobo is a classic Filipino dish made with chicken or pork slowly simmered in a savory blend of soy sauce, vinegar, garlic, bay leaves, and peppercorns. Its rich, tangy, and slightly salty flavor makes it one of the most iconic and well-loved dishes in Filipino cuisine, best served with steamed rice.'}
                          {index === 1 && 'Sinigang is a popular Filipino sour soup consisting of braised meat or seafood in a savory tamarind-based broth. When mixed with vegetables such as kangkong, radish, and eggplant, it provides a comforting contrast of flavors that are best served hot over a plate of steamed rice.'}
                          {index === 2 && 'Kare-Kare is a traditional Filipino stew known for its rich and creamy peanut-based sauce. Made with tender oxtail, tripe, or pork and simmered with vegetables like eggplant, string beans, and banana blossoms, it\'s best enjoyed with bagoong (shrimp paste) to enhance its deep, savory flavor.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleViewMoreClick}
                className="text-xl font-semibold text-gray-900 hover:text-amber-900 transition-colors"
                style={{fontFamily: 'Montserrat, sans-serif'}}
              >
                View More
              </button>
            </div>
          </>
        )}
      </div>

      {/* Features Section */}
      <div className="py-20" style={{backgroundColor: '#FFFDF1'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Why Choose Us</h2>
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
