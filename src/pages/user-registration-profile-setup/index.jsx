import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RegistrationForm from './components/RegistrationForm';
import AccessibilityProfileWizard from './components/AccessibilityProfileWizard';
import VoiceInstructions from './components/VoiceInstructions';
import ProgressIndicator from './components/ProgressIndicator';

const UserRegistrationProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [registrationData, setRegistrationData] = useState(null);
  const [accessibilityProfile, setAccessibilityProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);

    // Voice welcome message
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      setTimeout(() => {
        const message = currentLanguage === 'hi' ?'AccessiAI पंजीकरण में आपका स्वागत है। आवाज निर्देशों के लिए मदद कहें।' :'Welcome to AccessiAI registration. Say help for voice instructions.';
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        speechSynthesis.speak(utterance);
      }, 1000);
    }

    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, [currentLanguage]);

  const handleRegistrationSubmit = async (formData) => {
    setRegistrationData(formData);
    setCurrentStep(2);
    
    // Voice feedback
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const message = currentLanguage === 'hi' ?'पंजीकरण सफल। अब पहुंच प्रोफाइल सेटअप करें।' :'Registration successful. Now set up accessibility profile.';
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }
  };

  const handleProfileUpdate = async (profileData) => {
    setAccessibilityProfile(profileData);
    setCurrentStep(3);
    setIsSubmitting(true);

    try {
      // Simulate API call to save user data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save user data to localStorage (mock)
      const userData = {
        ...registrationData,
        accessibilityProfile: profileData,
        registrationDate: new Date().toISOString(),
        userId: `user_${Date.now()}`
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('userAccessibilityProfile', JSON.stringify(profileData));
      
      // Voice feedback
      const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const message = currentLanguage === 'hi' ?'खाता सफलतापूर्वक बनाया गया। डैशबोर्ड पर जा रहे हैं।' :'Account created successfully. Redirecting to dashboard.';
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
      }

      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/accessible-dashboard-control-center');
      }, 3000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setCurrentStep(2); // Go back to profile setup
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSuccessScreen = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
          {currentLanguage === 'hi' ? 'स्वागत है!' : 'Welcome!'}
        </h2>
        <p className="text-gray-600 text-lg">
          {currentLanguage === 'hi' ?'आपका AccessiAI खाता सफलतापूर्वक बनाया गया है।' :'Your AccessiAI account has been created successfully.'
          }
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">
          {currentLanguage === 'hi' ? 'आपकी पहुंच प्रोफाइल:' : 'Your Accessibility Profile:'}
        </h3>
        
        {accessibilityProfile?.disabilities?.length > 0 ? (
          <div className="space-y-2">
            {accessibilityProfile.disabilities.map((disability) => (
              <div key={disability} className="flex items-center space-x-2 text-blue-800">
                <Icon name="Check" size={16} />
                <span className="capitalize">
                  {disability === 'visual' && (currentLanguage === 'hi' ? 'दृष्टि सहायता' : 'Visual Assistance')}
                  {disability === 'hearing' && (currentLanguage === 'hi' ? 'श्रवण सहायता' : 'Hearing Assistance')}
                  {disability === 'motor' && (currentLanguage === 'hi' ? 'गतिशीलता सहायता' : 'Motor Assistance')}
                  {disability === 'cognitive' && (currentLanguage === 'hi' ? 'संज्ञानात्मक सहायता' : 'Cognitive Assistance')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue-700">
            {currentLanguage === 'hi' ?'कोई विशिष्ट पहुंच आवश्यकताएं नहीं चुनी गईं। आप बाद में सेटिंग्स में इन्हें कॉन्फ़िगर कर सकते हैं।' :'No specific accessibility needs selected. You can configure these later in settings.'
            }
          </p>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          {currentLanguage === 'hi' ?'आपको 3 सेकंड में डैशबोर्ड पर भेजा जाएगा...' :'You will be redirected to the dashboard in 3 seconds...'
          }
        </p>
        
        <Button
          variant="primary"
          onClick={() => navigate('/accessible-dashboard-control-center')}
          className="text-lg py-3"
          data-voice="dashboard"
        >
          <Icon name="ArrowRight" size={20} />
          <span className="ml-2">
            {currentLanguage === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}
          </span>
        </Button>

        <div className="flex justify-center space-x-4 pt-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/accessibility-settings-personalization')}
            className="touch-target"
          >
            <Icon name="Settings" size={16} />
            <span className="ml-2">
              {currentLanguage === 'hi' ? 'सेटिंग्स' : 'Settings'}
            </span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/voice-to-text-conversion-studio')}
            className="touch-target"
          >
            <Icon name="Mic" size={16} />
            <span className="ml-2">
              {currentLanguage === 'hi' ? 'आवाज उपकरण' : 'Voice Tools'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        {currentLanguage === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
      </a>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Icon name="Accessibility" size={32} className="text-blue-600" />
              <div>
                <h1 className="text-xl font-heading font-bold text-gray-900">
                  AccessiAI
                </h1>
                <p className="text-xs text-gray-500">
                  {currentLanguage === 'hi' ? 'पहुंच सहायता' : 'Accessibility Assistant'}
                </p>
              </div>
            </div>

            {/* Language selector */}
            <div className="flex items-center space-x-4">
              <select
                value={currentLanguage}
                onChange={(e) => {
                  const newLang = e.target.value;
                  setCurrentLanguage(newLang);
                  localStorage.setItem('accessibility-language', newLang);
                  window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: newLang } }));
                }}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>

              <Button
                variant="ghost"
                onClick={() => navigate('/login-authentication')}
                className="touch-target"
              >
                {currentLanguage === 'hi' ? 'साइन इन' : 'Sign In'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Voice instructions */}
          <VoiceInstructions 
            currentLanguage={currentLanguage}
            isActive={currentStep <= 2}
          />

          {/* Progress indicator */}
          {currentStep <= 2 && (
            <ProgressIndicator 
              currentStep={currentStep}
              totalSteps={3}
              currentLanguage={currentLanguage}
            />
          )}

          {/* Step content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <RegistrationForm 
                  onSubmit={handleRegistrationSubmit}
                  currentLanguage={currentLanguage}
                />
              )}
              
              {currentStep === 2 && (
                <AccessibilityProfileWizard 
                  onProfileUpdate={handleProfileUpdate}
                  currentLanguage={currentLanguage}
                />
              )}
              
              {currentStep === 3 && renderSuccessScreen()}
            </div>

            {/* Sidebar */}
            {currentStep <= 2 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                  <h3 className="font-heading font-semibold text-gray-900 mb-4">
                    {currentLanguage === 'hi' ? 'सहायता और सुझाव' : 'Help & Tips'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="Shield" size={20} className="text-green-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {currentLanguage === 'hi' ? 'सुरक्षित और निजी' : 'Secure & Private'}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {currentLanguage === 'hi' ?'आपकी जानकारी एन्क्रिप्टेड और सुरक्षित है।' :'Your information is encrypted and secure.'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Icon name="Accessibility" size={20} className="text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {currentLanguage === 'hi' ? 'पूर्ण पहुंच' : 'Full Accessibility'}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {currentLanguage === 'hi' ?'सभी सुविधाएं सभी उपयोगकर्ताओं के लिए उपलब्ध हैं।' :'All features available to all users.'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Icon name="Headphones" size={20} className="text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {currentLanguage === 'hi' ? '24/7 सहायता' : '24/7 Support'}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {currentLanguage === 'hi' ?'हमारी टीम हमेशा आपकी मदद के लिए तैयार है।' :'Our team is always ready to help you.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency contact */}
                  <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Phone" size={16} className="text-red-600" />
                      <span className="font-medium text-red-900 text-sm">
                        {currentLanguage === 'hi' ? 'आपातकालीन सहायता' : 'Emergency Help'}
                      </span>
                    </div>
                    <p className="text-xs text-red-700">
                      {currentLanguage === 'hi' ?'तत्काल सहायता के लिए: +91-1800-ACCESSIAI' :'For immediate assistance: +91-1800-ACCESSIAI'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} AccessiAI. {currentLanguage === 'hi' ? 'सभी अधिकार सुरक्षित।' : 'All rights reserved.'}
            </p>
            <div className="mt-2 space-x-4">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
                {currentLanguage === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
                {currentLanguage === 'hi' ? 'नियम और शर्तें' : 'Terms of Service'}
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
                {currentLanguage === 'hi' ? 'पहुंच' : 'Accessibility'}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserRegistrationProfileSetup;