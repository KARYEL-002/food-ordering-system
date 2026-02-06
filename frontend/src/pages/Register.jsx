import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated && user) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userData = await register(formData);
      
      // Verify registration was successful
      if (userData && userData.id) {
        toast.success(`Welcome, ${userData.name}! Account created successfully!`);
        
        // Small delay to ensure state is updated before navigation and reload
        setTimeout(() => {
          navigate('/menu');
          window.location.reload();
        }, 500);
      } else {
        throw new Error('Registration verification failed');
      }
    } catch (error) {
      // Show backend-provided error message when available
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      toast.error(backendMessage || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center" 
      style={{
        backgroundColor: '#FFFDF1', 
        minHeight: 'calc(100vh - 120px)',
        paddingTop: '10px',
        paddingBottom: '200px'
      }}
    >
      <div className="w-full max-w-md mx-4 animate-fade-in-up">
        <h2 className="text-2xl font-semibold text-center mb-6" style={{fontFamily: 'Montserrat, sans-serif', color: '#704214'}}>
          Create your account
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-800 focus:border-transparent outline-none transition-all"
                placeholder="Full Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-800 focus:border-transparent outline-none transition-all"
                placeholder="Email Address"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-800 focus:border-transparent outline-none transition-all"
                placeholder="Phone"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-800 focus:border-transparent outline-none transition-all"
                placeholder="Password"
              />
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-800 focus:border-transparent outline-none transition-all"
                placeholder="Confirm Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{backgroundColor: '#704214', fontFamily: 'Montserrat, sans-serif'}}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium hover:underline" style={{color: '#704214'}}>
              Login here
            </Link>
          </p>
      </div>
    </div>
  );
};

export default Register;
