import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import VoiceLoginModal from './components/VoiceLoginModal';
import GestureLoginModal from './components/GestureLoginModal';
import BiometricLoginModal from './components/BiometricLoginModal';
import AccessibilityTipsPanel from './components/AccessibilityTipsPanel';

const LoginAuthentication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [loginMethod, setLoginMethod] = useState('password');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showGestureModal, setShowGestureModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  // Mock credentials for demo
  const mockCredentials = {
    admin: { email: "admin@accessiai.com", password: "admin123" },
    user: { email: "user@accessiai.com", password: "user123" },
    demo: { email: "demo@accessiai.com", password: "demo123" }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const announceToUser = (message) => {
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = currentLanguage === 'hi' ? 'ईमेल आवश्यक है' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = currentLanguage === 'hi' ? 'वैध ईमेल दर्ज करें' : 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = currentLanguage === 'hi' ? 'पासवर्ड आवश्यक है' : 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = currentLanguage === 'hi' ? 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए' : 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      announceToUser(currentLanguage === 'hi' ? 'फॉर्म में त्रुटियां हैं' : 'Form has errors');
      return;
    }

    setIsLoading(true);
    announceToUser(currentLanguage === 'hi' ? 'लॉगिन हो रहा है' : 'Logging in');

    try {
      // Check mock credentials
      const isValidCredentials = Object.values(mockCredentials).some(
        cred => cred.email === formData.email && cred.password === formData.password
      );

      if (isValidCredentials) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
        
        announceToUser(currentLanguage === 'hi' ? 'लॉगिन सफल' : 'Login successful');
        navigate('/accessible-dashboard-control-center');
      } else {
        setErrors({
          general: currentLanguage === 'hi' ?'गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।' :'Invalid email or password. Please try again.'
        });
        announceToUser(currentLanguage === 'hi' ? 'लॉगिन असफल' : 'Login failed');
      }
    } catch (error) {
      setErrors({
        general: currentLanguage === 'hi' ?'लॉगिन में त्रुटि हुई। कृपया पुनः प्रयास करें।' :'Login error occurred. Please try again.'
      });
      announceToUser(currentLanguage === 'hi' ? 'लॉगिन त्रुटि' : 'Login error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceLogin = (voiceData) => {
    announceToUser(currentLanguage === 'hi' ? 'आवाज लॉगिन सफल' : 'Voice login successful');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('loginMethod', 'voice');
    setShowVoiceModal(false);
    navigate('/accessible-dashboard-control-center');
  };

  const handleGestureLogin = (gesturePattern) => {
    announceToUser(currentLanguage === 'hi' ? 'हाथ के इशारे से लॉगिन सफल' : 'Gesture login successful');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('loginMethod', 'gesture');
    setShowGestureModal(false);
    navigate('/accessible-dashboard-control-center');
  };

  const handleBiometricLogin = (biometricType) => {
    announceToUser(currentLanguage === 'hi' ? 'बायोमेट्रिक लॉगिन सफल' : 'Biometric login successful');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('loginMethod', 'biometric');
    setShowBiometricModal(false);
    navigate('/accessible-dashboard-control-center');
  };

  const handleKeyDown = (e) => {
    // Voice activation shortcut
    if (e.altKey && e.key === 'm') {
      e.preventDefault();
      setShowVoiceModal(true);
    }
    // Gesture activation shortcut
    if (e.altKey && e.key === 'g') {
      e.preventDefault();
      setShowGestureModal(true);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <Icon name="Accessibility" size={48} className="text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentLanguage === 'hi' ? 'AccessiAI में आपका स्वागत है' : 'Welcome to AccessiAI'}
            </h1>
            <p className="text-gray-600">
              {currentLanguage === 'hi' ?'अपने खाते में साइन इन करें' :'Sign in to your account'
              }
            </p>
          </div>

          {/* Login Method Selector */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {currentLanguage === 'hi' ? 'लॉगिन विधि चुनें:' : 'Choose login method:'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={loginMethod === 'password' ? 'primary' : 'outline'}
                onClick={() => setLoginMethod('password')}
                className="text-sm"
              >
                <Icon name="Lock" size={16} className="mr-2" />
                {currentLanguage === 'hi' ? 'पासवर्ड' : 'Password'}
              </Button>
              <Button
                variant={loginMethod === 'voice' ? 'primary' : 'outline'}
                onClick={() => setShowVoiceModal(true)}
                className="text-sm"
              >
                <Icon name="Mic" size={16} className="mr-2" />
                {currentLanguage === 'hi' ? 'आवाज' : 'Voice'}
              </Button>
              <Button
                variant={loginMethod === 'gesture' ? 'primary' : 'outline'}
                onClick={() => setShowGestureModal(true)}
                className="text-sm"
              >
                <Icon name="Hand" size={16} className="mr-2" />
                {currentLanguage === 'hi' ? 'इशारे' : 'Gesture'}
              </Button>
              <Button
                variant={loginMethod === 'biometric' ? 'primary' : 'outline'}
                onClick={() => setShowBiometricModal(true)}
                className="text-sm"
              >
                <Icon name="Fingerprint" size={16} className="mr-2" />
                {currentLanguage === 'hi' ? 'बायोमेट्रिक' : 'Biometric'}
              </Button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              {/* General Error */}
              {errors.general && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <Icon name="AlertCircle" size={16} className="text-red-600 mr-2" />
                    <p className="text-sm text-red-800">{errors.general}</p>
                  </div>
                </div>
              )}

              {/* Mock Credentials Info */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  {currentLanguage === 'hi' ? 'डेमो क्रेडेंशियल:' : 'Demo Credentials:'}
                </h4>
                <div className="text-xs text-blue-800 space-y-1">
                  <p>admin@accessiai.com / admin123</p>
                  <p>user@accessiai.com / user123</p>
                  <p>demo@accessiai.com / demo123</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {currentLanguage === 'hi' ? 'ईमेल पता' : 'Email address'}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={currentLanguage === 'hi' ? 'आपका ईमेल दर्ज करें' : 'Enter your email'}
                    className={errors.email ? 'border-red-300' : ''}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    required
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {currentLanguage === 'hi' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={currentLanguage === 'hi' ? 'आपका पासवर्ड दर्ज करें' : 'Enter your password'}
                      className={errors.password ? 'border-red-300 pr-10' : 'pr-10'}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                    </Button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="mt-4">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  {currentLanguage === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot your password?'}
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
                loading={isLoading}
                className="mt-6"
              >
                {isLoading 
                  ? (currentLanguage === 'hi' ? 'साइन इन हो रहा है...' : 'Signing in...')
                  : (currentLanguage === 'hi' ? 'साइन इन करें' : 'Sign in')
                }
              </Button>
            </div>
          </form>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {currentLanguage === 'hi' ? 'खाता नहीं है?' : "Don't have an account?"}{' '}
              <Link
                to="/user-registration-profile-setup"
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              >
                {currentLanguage === 'hi' ? 'साइन अप करें' : 'Sign up'}
              </Link>
            </p>
          </div>

          {/* Quick Access Buttons */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {currentLanguage === 'hi' ? 'त्वरित पहुंच:' : 'Quick Access:'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setShowVoiceModal(true)}
                className="text-sm"
                aria-label={currentLanguage === 'hi' ? 'आवाज लॉगिन खोलें' : 'Open voice login'}
              >
                <Icon name="Mic" size={16} className="mr-2" />
                Alt + M
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowGestureModal(true)}
                className="text-sm"
                aria-label={currentLanguage === 'hi' ? 'हाथ के इशारे लॉगिन खोलें' : 'Open gesture login'}
              >
                <Icon name="Hand" size={16} className="mr-2" />
                Alt + G
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Tips Panel - Desktop Only */}
      <div className="hidden lg:block w-80 p-6 bg-white border-l border-gray-200">
        <AccessibilityTipsPanel />
      </div>

      {/* Modals */}
      <VoiceLoginModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onVoiceLogin={handleVoiceLogin}
      />

      <GestureLoginModal
        isOpen={showGestureModal}
        onClose={() => setShowGestureModal(false)}
        onGestureLogin={handleGestureLogin}
      />

      <BiometricLoginModal
        isOpen={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
        onBiometricLogin={handleBiometricLogin}
      />
    </div>
  );
};

export default LoginAuthentication;