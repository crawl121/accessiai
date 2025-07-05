import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BiometricLoginModal = ({ isOpen, onClose, onBiometricLogin, speechSynthesis }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [biometricType, setBiometricType] = useState('fingerprint');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [supportedMethods, setSupportedMethods] = useState([]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    // Check for available biometric methods
    const checkBiometricSupport = async () => {
      const methods = [];

      // Check for WebAuthn support
      if (window.PublicKeyCredential) {
        methods.push('fingerprint');
      }

      // Check for face recognition (mock)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        methods.push('face');
      }

      setSupportedMethods(methods);
      if (methods.length > 0) {
        setBiometricType(methods[0]);
      }
    };

    checkBiometricSupport();
  }, []);

  const announceToUser = (message) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const startBiometricScan = async () => {
    setIsScanning(true);
    announceToUser(
      currentLanguage === 'hi' ?
      `${biometricType === 'fingerprint' ? 'फिंगरप्रिंट' : 'चेहरा'} स्कैन शुरू` :
      `${biometricType === 'fingerprint' ? 'Fingerprint' : 'Face'} scan started`
    );

    try {
      // Simulate biometric authentication
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate for demo

        if (success) {
          onBiometricLogin(biometricType);
          announceToUser(
            currentLanguage === 'hi' ? 'बायोमेट्रिक प्रमाणीकरण सफल' : 'Biometric authentication successful'
          );
        } else {
          announceToUser(
            currentLanguage === 'hi' ? 'बायोमेट्रिक प्रमाणीकरण असफल' : 'Biometric authentication failed'
          );
        }
        setIsScanning(false);
      }, 3000);
    } catch (error) {
      console.error('Biometric authentication error:', error);
      setIsScanning(false);
      announceToUser(
        currentLanguage === 'hi' ? 'बायोमेट्रिक त्रुटि' : 'Biometric error'
      );
    }
  };

  const getBiometricIcon = (type) => {
    switch (type) {
      case 'fingerprint':
        return 'Fingerprint';
      case 'face':
        return 'Scan';
      default:
        return 'Shield';
    }
  };

  const getBiometricLabel = (type) => {
    if (currentLanguage === 'hi') {
      switch (type) {
        case 'fingerprint':
          return 'फिंगरप्रिंट';
        case 'face':
          return 'चेहरा पहचान';
        default:
          return 'बायोमेट्रिक';
      }
    } else {
      switch (type) {
        case 'fingerprint':
          return 'Fingerprint';
        case 'face':
          return 'Face Recognition';
        default:
          return 'Biometric';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        role="dialog"
        aria-labelledby="biometric-login-title"
        aria-describedby="biometric-login-description">

        <div className="flex items-center justify-between mb-4">
          <h3
            id="biometric-login-title"
            className="text-xl font-semibold text-gray-900">

            {currentLanguage === 'hi' ? 'बायोमेट्रिक लॉगिन' : 'Biometric Login'}
          </h3>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label={currentLanguage === 'hi' ? 'बंद करें' : 'Close'}>

            <Icon name="X" size={20} />
          </Button>
        </div>

        <p
          id="biometric-login-description"
          className="text-gray-600 mb-6">

          {currentLanguage === 'hi' ? 'अपनी पहचान सत्यापित करने के लिए बायोमेट्रिक विधि चुनें।' : 'Choose a biometric method to verify your identity.'
          }
        </p>

        {supportedMethods.length > 1 &&
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'hi' ? 'प्रमाणीकरण विधि:' : 'Authentication Method:'}
            </label>
            <div className="flex space-x-2">
              {supportedMethods.map((method) =>
            <Button
              key={method}
              variant={biometricType === method ? "primary" : "outline"}
              onClick={() => setBiometricType(method)}
              className="flex-1">

                  <Icon name={getBiometricIcon(method)} size={16} className="mr-2" />
                  {getBiometricLabel(method)}
                </Button>
            )}
            </div>
          </div>
        }

        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Button
              variant={isScanning ? "danger" : "primary"}
              onClick={startBiometricScan}
              disabled={isScanning}
              className="w-24 h-24 rounded-full"
              aria-label={
              isScanning ?
              currentLanguage === 'hi' ? 'स्कैन हो रहा है' : 'Scanning' :
              currentLanguage === 'hi' ? 'स्कैन शुरू करें' : 'Start scan'
              }>

              <Icon
                name={getBiometricIcon(biometricType)}
                size={32}
                className={isScanning ? "animate-pulse" : ""} />

            </Button>
            
            {isScanning &&
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            }
          </div>
          
          <p className="mt-4 text-sm text-gray-600">
            {isScanning ?
            currentLanguage === 'hi' ?
            `${getBiometricLabel(biometricType)} स्कैन हो रहा है...` :
            `Scanning ${getBiometricLabel(biometricType).toLowerCase()}...` :
            currentLanguage === 'hi' ?
            `${getBiometricLabel(biometricType)} स्कैन करने के लिए टैप करें` :
            `Tap to scan ${getBiometricLabel(biometricType).toLowerCase()}`
            }
          </p>
        </div>

        {supportedMethods.length === 0 &&
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <Icon name="AlertTriangle" size={16} className="text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                {currentLanguage === 'hi' ? 'इस डिवाइस पर बायोमेट्रिक प्रमाणीकरण उपलब्ध नहीं है।' : 'Biometric authentication is not available on this device.'
              }
              </p>
            </div>
          </div>
        }

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            fullWidth>

            {currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              // Fallback to password login
              onClose();
            }}
            fullWidth>

            {currentLanguage === 'hi' ? 'पासवर्ड उपयोग करें' : 'Use Password'}
          </Button>
        </div>
      </div>
    </div>);

};

export default BiometricLoginModal;