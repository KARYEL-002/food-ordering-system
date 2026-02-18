import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Truck, CheckCircle2 } from 'lucide-react';
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
      <div style={{backgroundColor: '#FFFDF1'}} className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
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
              <div className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto">
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
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-xl md:text-xl font-bold text-[#704214] mb-3 sm:mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>Best meals for you</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#f4c496] to-[#FFD166] rounded-full mx-auto"></div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              {featuredItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group animate-fade-in-up"
                  style={{animationDelay: `${index * 150}ms`}}
                >
                  <div className="relative pt-10 sm:pt-16 md:pt-20 transform transition-all duration-300 hover:-translate-y-1">
                    {/* Food Image - perfectly circular */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 z-10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2">
                      <div className="w-full h-full rounded-full overflow-hidden shadow-xl border-2 border-[#FFD166] ring-4 ring-[#FFFDF1]">
                        <OptimizedImage
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                      </div>
                    </div>
                    {/* Card background */}
                    <div style={{backgroundColor: '#ffce99', border: '1.5px solid #f0b966'}} className="rounded-3xl sm:rounded-4xl md:rounded-3xl pt-10 sm:pt-14 md:pt-16 pb-8 sm:pb-10 md:pb-12 px-6 sm:px-8 md:px-10 min-h-[220px] sm:min-h-[260px] md:min-h-[300px] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 flex flex-col items-center justify-center text-center">
                      <div className="mb-4 sm:mb-6 w-full">
                        <div className="text-lg sm:text-xl font-bold text-[#704214] mb-4 sm:mb-5" style={{fontFamily: 'Montserrat, sans-serif'}}>
                          {item.name}
                        </div>
                        <p className="text-xs sm:text-sm text-[#704214] leading-relaxed mx-auto font-medium">
                          {item.description || 'Delicious Filipino dish'}
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
                className="text-base font-semibold text-gray-900 hover:text-amber-900 transition-colors"
                style={{fontFamily: 'Montserrat, sans-serif'}}
              >
                View More
              </button>
            </div>
          </>
        )}
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-20 md:py-24" style={{backgroundColor: '#FFFDF1'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-xl md:text-xl font-bold text-[#704214] mb-3 sm:mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>Why Choose Us</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#f4c496] to-[#FFD166] rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <div className="text-center p-8 sm:p-10 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white shadow-md">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <UtensilsCrossed className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#704214]" style={{fontFamily: 'Montserrat, sans-serif'}}>Wide Selection</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Choose from a variety of delicious dishes prepared by expert chefs
              </p>
            </div>
            <div className="text-center p-8 sm:p-10 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white shadow-md">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#704214]" style={{fontFamily: 'Montserrat, sans-serif'}}>Fast Delivery</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Get your food delivered hot and fresh in no time
              </p>
            </div>
            <div className="text-center p-8 sm:p-10 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white shadow-md">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#704214]" style={{fontFamily: 'Montserrat, sans-serif'}}>Secure Payment</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Fast and secure checkout with reliable payment processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
