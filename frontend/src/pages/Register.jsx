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
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated && user) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Live validation for the changed field
    let err = '';
    switch (name) {
      case 'name':
        err = validateName(value);
        break;
      case 'email':
        err = validateEmail(value);
        break;
      case 'phone':
        err = validatePhone(value);
        break;
      case 'password':
        err = validatePassword(value);
        // also re-validate confirmation
        if (formData.password_confirmation && value !== formData.password_confirmation) {
          setErrors(prev => ({ ...prev, password_confirmation: 'Passwords do not match' }));
        } else {
          setErrors(prev => ({ ...prev, password_confirmation: '' }));
        }
        break;
      case 'password_confirmation':
        err = value === formData.password ? '' : 'Passwords do not match';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const validateName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 3) return 'Full name must be at least 3 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Full name contains invalid characters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return '';
    const phoneRegex = /^(?:09\d{9}|\+639\d{9}|09\d{2}\s\d{3}\s\d{4})$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Please enter a valid Philippine phone number';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const isFormValidNow = () => {
    // Check required fields and no errors
    if (validateName(formData.name)) return false;
    if (validateEmail(formData.email)) return false;
    if (validatePassword(formData.password)) return false;
    if (formData.password !== formData.password_confirmation) return false;
    if (validatePhone(formData.phone)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Run final validation and show inline errors
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      password_confirmation: formData.password === formData.password_confirmation ? '' : 'Passwords do not match'
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(v => v)) {
      toast.error('Please fix the highlighted errors');
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
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
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
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
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
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
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
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
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
              {errors.password_confirmation && <p className="text-xs text-red-600 mt-1">{errors.password_confirmation}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValidNow()}
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
