import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLockoutModal, setShowLockoutModal] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState({
    minutesRemaining: 0,
    secondsRemaining: 0,
    attemptCount: 0,
    lockLevel: 1, // 1 for 3 mins, 2 for 5 mins
  });
  const [isLocked, setIsLocked] = useState(false);

  // Redirect if already logged in - use useEffect instead of render-time check
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Check for existing lockout on mount
  useEffect(() => {
    const lockoutData = localStorage.getItem('loginLockout');
    if (lockoutData) {
      const { lockTime, attemptCount, lockLevel } = JSON.parse(lockoutData);
      const now = Date.now();
      const lockDuration = lockLevel === 1 ? 3 * 60 * 1000 : 5 * 60 * 1000; // 3 or 5 minutes
      const timeRemaining = lockTime + lockDuration - now;

      if (timeRemaining > 0) {
        setIsLocked(true);
        setLockoutInfo({
          minutesRemaining: Math.floor(timeRemaining / 60000),
          secondsRemaining: Math.floor((timeRemaining % 60000) / 1000),
          attemptCount,
          lockLevel,
        });
        setShowLockoutModal(true);
      } else {
        // Lockout expired, clear it
        localStorage.removeItem('loginLockout');
        setIsLocked(false);
      }
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!isLocked) return;

    const interval = setInterval(() => {
      const lockoutData = localStorage.getItem('loginLockout');
      if (!lockoutData) {
        setIsLocked(false);
        setShowLockoutModal(false);
        return;
      }

      const { lockTime, attemptCount, lockLevel } = JSON.parse(lockoutData);
      const now = Date.now();
      const lockDuration = lockLevel === 1 ? 3 * 60 * 1000 : 5 * 60 * 1000;
      const timeRemaining = lockTime + lockDuration - now;

      if (timeRemaining <= 0) {
        localStorage.removeItem('loginLockout');
        setIsLocked(false);
        setShowLockoutModal(false);
        toast.success('Account unlocked. You can try logging in again.');
        clearInterval(interval);
      } else {
        setLockoutInfo({
          minutesRemaining: Math.floor(timeRemaining / 60000),
          secondsRemaining: Math.floor((timeRemaining % 60000) / 1000),
          attemptCount,
          lockLevel,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const recordFailedAttempt = () => {
    const lockoutData = localStorage.getItem('loginLockout');
    let attemptCount = 1;
    let lockLevel = 1; // Start with 3 minutes

    if (lockoutData) {
      const { attemptCount: prevCount } = JSON.parse(lockoutData);
      attemptCount = prevCount + 1;
      // After first lockout (3 mins), second lockout is 5 mins
      lockLevel = attemptCount >= 2 ? 2 : 1;
    }

    const lockoutPayload = {
      lockTime: Date.now(),
      attemptCount,
      lockLevel,
    };

    localStorage.setItem('loginLockout', JSON.stringify(lockoutPayload));
    setIsLocked(true);
    setLockoutInfo({
      minutesRemaining: lockLevel === 1 ? 3 : 5,
      secondsRemaining: 0,
      attemptCount,
      lockLevel,
    });
    setShowLockoutModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if still locked
    const lockoutData = localStorage.getItem('loginLockout');
    if (lockoutData) {
      const { lockTime, attemptCount, lockLevel } = JSON.parse(lockoutData);
      const now = Date.now();
      const lockDuration = lockLevel === 1 ? 3 * 60 * 1000 : 5 * 60 * 1000;
      const timeRemaining = lockTime + lockDuration - now;

      if (timeRemaining > 0) {
        setIsLocked(true);
        setLockoutInfo({
          minutesRemaining: Math.floor(timeRemaining / 60000),
          secondsRemaining: Math.floor((timeRemaining % 60000) / 1000),
          attemptCount,
          lockLevel,
        });
        setShowLockoutModal(true);
        setError(`Your account is locked. Please try again in ${Math.ceil(timeRemaining / 60000)} minute(s).`);
        return;
      } else {
        localStorage.removeItem('loginLockout');
        setIsLocked(false);
      }
    }

    setLoading(true);
    setError('');

    try {
      const userData = await login(formData.email, formData.password);
      
      // Verify login was successful
      if (userData && userData.id) {
        // Clear lockout on successful login
        localStorage.removeItem('loginLockout');
        toast.success(`Welcome back, ${userData.name}!`);
        // Auto-redirect happens via the isAuthenticated check at top of component
        // No need to manually navigate
      } else {
        throw new Error('Login verification failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      const response = error.response?.data;
      
      // Handle different error types
      if (response?.type === 'account_locked') {
        setLockoutInfo({
          minutesRemaining: response.minutesRemaining || 5,
          secondsRemaining: response.secondsRemaining || 0,
          attemptCount: response.attemptCount || 1,
          lockLevel: response.lockLevel || 2,
        });
        setShowLockoutModal(true);
        toast.error('Account locked due to too many failed attempts');
      } else if (response?.type === 'wrong_credentials' || response?.error?.includes('Invalid credentials')) {
        // Record failed attempt
        recordFailedAttempt();
        const errorMsg = response?.error || 'Wrong credentials. Please try again.';
        setError(errorMsg);
        toast.error('Invalid credentials. Account locked for security.');
      } else if (response?.error) {
        // Record failed attempt for other errors too
        recordFailedAttempt();
        setError(response.error);
        toast.error(response.error);
      } else {
        recordFailedAttempt();
        const errorMsg = 'Login failed. Please check your email and password.';
        setError(errorMsg);
        toast.error('Invalid credentials. Account locked for security.');
      }
      
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="flex items-center justify-center" 
        style={{
          backgroundColor: '#FFFDF1', 
          minHeight: 'calc(100vh - 120px)',
          paddingTop: '5px',
          paddingBottom: '150px'
        }}
      >
        <div className="w-full max-w-md mx-4 animate-fade-in-up">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-6">
              <h2 className="text-2xl font-semibold" style={{fontFamily: 'Montserrat, sans-serif'}}>
                Sign in to your Account
              </h2>
              {isLocked && (
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full" style={{backgroundColor: '#D9534F'}}>
                  {lockoutInfo.attemptCount}
                </span>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError('')}
                  className="text-red-400 hover:text-red-600 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-md focus:outline-none transition-all ${
                    error 
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                      : 'border-gray-300 focus:ring-2 focus:ring-amber-800 focus:border-transparent'
                  }`}
                  placeholder=""
                  disabled={loading}
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
                  className={`w-full px-4 py-2.5 border rounded-md focus:outline-none transition-all ${
                    error 
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                      : 'border-gray-300 focus:ring-2 focus:ring-amber-800 focus:border-transparent'
                  }`}
                  placeholder=""
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-full text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: '#704214', fontFamily: 'Montserrat, sans-serif'}}
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium hover:underline" style={{color: '#704214'}}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Account Locked Modal */}
      {showLockoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-3">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">Account Locked</h3>
              <p className="text-sm text-gray-600 mb-4">Failed Attempt {lockoutInfo.attemptCount}</p>

              {/* Countdown Timer */}
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                <p className="text-2xl font-bold text-yellow-700" style={{fontFamily: 'monospace'}}>
                  {String(lockoutInfo.minutesRemaining).padStart(2, '0')}:{String(lockoutInfo.secondsRemaining).padStart(2, '0')}
                </p>
                <p className="text-xs text-gray-500 mt-1">({lockoutInfo.lockLevel === 1 ? '3 min' : '5 min'} lock)</p>
              </div>

              {lockoutInfo.lockLevel === 1 && (
                <p className="text-xs text-amber-600 mb-4">
                  Next attempt: 5 minute lock
                </p>
              )}

              <button
                onClick={() => setShowLockoutModal(false)}
                className="w-full py-2.5 rounded-full text-white font-medium transition-all hover:opacity-90"
                style={{backgroundColor: '#704214'}}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
