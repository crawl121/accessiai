import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccessibilityProfileWizard = ({ onProfileUpdate, currentLanguage, speechSynthesis }) => {
  const [selectedDisabilities, setSelectedDisabilities] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [profileSettings, setProfileSettings] = useState({
    visual: {
      screenReader: false,
      highContrast: false,
      largeText: false,
      voiceNavigation: false,
      textSize: 16,
      contrastLevel: 'normal'
    },
    hearing: {
      visualAlerts: false,
      signLanguage: false,
      subtitles: false,
      vibrationFeedback: false,
      signLanguageType: 'ISL'
    },
    motor: {
      voiceControl: false,
      gestureControl: false,
      keyboardOnly: false,
      dwellTime: 1000,
      gesturesensitivity: 'medium'
    },
    cognitive: {
      simplifiedInterface: false,
      slowAnimations: false,
      clearInstructions: false,
      memoryAids: false,
      readingSpeed: 'normal'
    }
  });

  const disabilityTypes = [
  {
    id: 'visual',
    name: currentLanguage === 'hi' ? 'दृष्टि संबंधी' : 'Visual Impairment',
    description: currentLanguage === 'hi' ? 'अंधापन, कम दृष्टि, या रंग अंधता' : 'Blindness, low vision, or color blindness',
    icon: 'Eye',
    color: 'blue'
  },
  {
    id: 'hearing',
    name: currentLanguage === 'hi' ? 'श्रवण संबंधी' : 'Hearing Impairment',
    description: currentLanguage === 'hi' ? 'बहरापन या सुनने में कठिनाई' : 'Deafness or difficulty hearing',
    icon: 'Ear',
    color: 'green'
  },
  {
    id: 'motor',
    name: currentLanguage === 'hi' ? 'गतिशीलता संबंधी' : 'Motor Impairment',
    description: currentLanguage === 'hi' ? 'हाथ, बांह या गतिशीलता की समस्याएं' : 'Hand, arm, or mobility difficulties',
    icon: 'Hand',
    color: 'purple'
  },
  {
    id: 'cognitive',
    name: currentLanguage === 'hi' ? 'संज्ञानात्मक' : 'Cognitive',
    description: currentLanguage === 'hi' ? 'सीखने, स्मृति या ध्यान संबंधी चुनौतियां' : 'Learning, memory, or attention challenges',
    icon: 'Brain',
    color: 'orange'
  }];


  const handleDisabilitySelection = (disabilityId) => {
    setSelectedDisabilities((prev) => {
      const isSelected = prev.includes(disabilityId);
      const newSelection = isSelected ?
      prev.filter((id) => id !== disabilityId) :
      [...prev, disabilityId];

      // Voice feedback
      const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const disability = disabilityTypes.find((d) => d.id === disabilityId);
        const message = isSelected ?
        `${disability.name} ${currentLanguage === 'hi' ? 'हटाया गया' : 'removed'}` :
        `${disability.name} ${currentLanguage === 'hi' ? 'चुना गया' : 'selected'}`;
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
      }

      return newSelection;
    });
  };

  const handleSettingChange = (category, setting, value) => {
    setProfileSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const renderDisabilitySelection = () =>
  <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
          {currentLanguage === 'hi' ? 'अपनी पहुंच आवश्यकताओं का चयन करें' : 'Select Your Accessibility Needs'
        }
        </h3>
        <p className="text-gray-600">
          {currentLanguage === 'hi' ? 'आप एक से अधिक विकल्प चुन सकते हैं। यह वैकल्पिक है।' : 'You can select multiple options. This is optional.'
        }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {disabilityTypes.map((disability) => {
        const isSelected = selectedDisabilities.includes(disability.id);
        const colorClasses = {
          blue: isSelected ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 hover:border-blue-300',
          green: isSelected ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 hover:border-green-300',
          purple: isSelected ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-white border-gray-200 hover:border-purple-300',
          orange: isSelected ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-gray-200 hover:border-orange-300'
        };

        return (
          <button
            key={disability.id}
            onClick={() => handleDisabilitySelection(disability.id)}
            className={`
                p-6 rounded-lg border-2 text-left transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                min-h-[120px] touch-target
                ${colorClasses[disability.color]}
              `}
            aria-pressed={isSelected}
            aria-describedby={`disability-desc-${disability.id}`}>

              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${isSelected ? 'bg-white' : 'bg-gray-100'}`}>
                  <Icon
                  name={disability.icon}
                  size={24}
                  className={isSelected ? `text-${disability.color}-600` : 'text-gray-600'} />

                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">
                    {disability.name}
                  </h4>
                  <p
                  id={`disability-desc-${disability.id}`}
                  className="text-sm opacity-80">

                    {disability.description}
                  </p>
                  {isSelected &&
                <div className="mt-3 flex items-center">
                      <Icon name="Check" size={16} className="mr-2" />
                      <span className="text-sm font-medium">
                        {currentLanguage === 'hi' ? 'चयनित' : 'Selected'}
                      </span>
                    </div>
                }
                </div>
              </div>
            </button>);

      })}
      </div>
    </div>;


  const renderSettingsForDisability = (disabilityId) => {
    const settings = profileSettings[disabilityId];

    switch (disabilityId) {
      case 'visual':
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">
              {currentLanguage === 'hi' ? 'दृष्टि सहायता सेटिंग्स' : 'Visual Assistance Settings'}
            </h4>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.screenReader}
                  onChange={(e) => handleSettingChange('visual', 'screenReader', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />

                <span className="text-gray-700">
                  {currentLanguage === 'hi' ? 'स्क्रीन रीडर समर्थन' : 'Screen Reader Support'}
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => handleSettingChange('visual', 'highContrast', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />

                <span className="text-gray-700">
                  {currentLanguage === 'hi' ? 'उच्च कंट्रास्ट मोड' : 'High Contrast Mode'}
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLanguage === 'hi' ? 'टेक्स्ट का आकार' : 'Text Size'}
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={settings.textSize}
                  onChange={(e) => handleSettingChange('visual', 'textSize', parseInt(e.target.value))}
                  className="w-full" />

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{currentLanguage === 'hi' ? 'छोटा' : 'Small'}</span>
                  <span>{settings.textSize}px</span>
                  <span>{currentLanguage === 'hi' ? 'बड़ा' : 'Large'}</span>
                </div>
              </div>
            </div>
          </div>);


      case 'hearing':
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">
              {currentLanguage === 'hi' ? 'श्रवण सहायता सेटिंग्स' : 'Hearing Assistance Settings'}
            </h4>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.visualAlerts}
                  onChange={(e) => handleSettingChange('hearing', 'visualAlerts', e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />

                <span className="text-gray-700">
                  {currentLanguage === 'hi' ? 'दृश्य अलर्ट' : 'Visual Alerts'}
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.signLanguage}
                  onChange={(e) => handleSettingChange('hearing', 'signLanguage', e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />

                <span className="text-gray-700">
                  {currentLanguage === 'hi' ? 'सांकेतिक भाषा समर्थन' : 'Sign Language Support'}
                </span>
              </label>

              {settings.signLanguage &&
              <div className="ml-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentLanguage === 'hi' ? 'सांकेतिक भाषा का प्रकार' : 'Sign Language Type'}
                  </label>
                  <select
                  value={settings.signLanguageType}
                  onChange={(e) => handleSettingChange('hearing', 'signLanguageType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">

                    <option value="ISL">{currentLanguage === 'hi' ? 'भारतीय सांकेतिक भाषा (ISL)' : 'Indian Sign Language (ISL)'}</option>
                    <option value="ASL">{currentLanguage === 'hi' ? 'अमेरिकी सांकेतिक भाषा (ASL)' : 'American Sign Language (ASL)'}</option>
                    <option value="BSL">{currentLanguage === 'hi' ? 'ब्रिटिश सांकेतिक भाषा (BSL)' : 'British Sign Language (BSL)'}</option>
                  </select>
                </div>
              }
            </div>
          </div>);


      case 'motor':
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">
              {currentLanguage === 'hi' ? 'गतिशीलता सहायता सेटिंग्स' : 'Motor Assistance Settings'}
            </h4>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.voiceControl}
                  onChange={(e) => handleSettingChange('motor', 'voiceControl', e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />

                <span className="text-gray-700">
                  {currentLanguage === 'hi' ? 'आवाज नियंत्रण' : 'Voice Control'}
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.gestureControl}
                  onChange={(e) => handleSettingChange('motor', 'gestureControl', e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />

                <span className="text-gray-700">
                  {currentLanguage === 'hi' ? 'इशारा नियंत्रण' : 'Gesture Control'}
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLanguage === 'hi' ? 'इशारा संवेदनशीलता' : 'Gesture Sensitivity'}
                </label>
                <select
                  value={settings.gesturesensitivity}
                  onChange={(e) => handleSettingChange('motor', 'gesturesensitivity', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">

                  <option value="low">{currentLanguage === 'hi' ? 'कम' : 'Low'}</option>
                  <option value="medium">{currentLanguage === 'hi' ? 'मध्यम' : 'Medium'}</option>
                  <option value="high">{currentLanguage === 'hi' ? 'उच्च' : 'High'}</option>
                </select>
              </div>
            </div>
          </div>);


      case 'cognitive':
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">
              {currentLanguage === 'hi' ? 'संज्ञानात्मक सहायता सेटिंग्स' : 'Cognitive Assistance Settings'}
            </h4>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.simplifiedInterface}
                  onChange={(e) => handleSettingChange('cognitive', 'simplifiedInterface', e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500" />

                <span className="text-gray-700">
                  {currentLanguage === 'hi' ? 'सरल इंटरफेस' : 'Simplified Interface'}
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.clearInstructions}
                  onChange={(e) => handleSettingChange('cognitive', 'clearInstructions', e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500" />

                <span className="text-gray-700">
                  {currentLanguage === 'hi' ? 'स्पष्ट निर्देश' : 'Clear Instructions'}
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLanguage === 'hi' ? 'पढ़ने की गति' : 'Reading Speed'}
                </label>
                <select
                  value={settings.readingSpeed}
                  onChange={(e) => handleSettingChange('cognitive', 'readingSpeed', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500">

                  <option value="slow">{currentLanguage === 'hi' ? 'धीमी' : 'Slow'}</option>
                  <option value="normal">{currentLanguage === 'hi' ? 'सामान्य' : 'Normal'}</option>
                  <option value="fast">{currentLanguage === 'hi' ? 'तेज' : 'Fast'}</option>
                </select>
              </div>
            </div>
          </div>);


      default:
        return null;
    }
  };

  const nextStep = () => {
    if (currentStep < selectedDisabilities.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeSetup = () => {
    const profileData = {
      disabilities: selectedDisabilities,
      settings: profileSettings
    };

    onProfileUpdate(profileData);

    // Voice feedback
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const message = currentLanguage === 'hi' ? 'पहुंच प्रोफाइल सेटअप पूरा हुआ' : 'Accessibility profile setup completed';
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
          {currentLanguage === 'hi' ? 'पहुंच प्रोफाइल सेटअप' : 'Accessibility Profile Setup'}
        </h2>
        <p className="text-gray-600">
          {currentLanguage === 'hi' ? 'अपने अनुभव को व्यक्तिगत बनाने के लिए अपनी पहुंच आवश्यकताओं को कॉन्फ़िगर करें।' : 'Configure your accessibility needs to personalize your experience.'
          }
        </p>
      </div>

      {/* Progress indicator */}
      {selectedDisabilities.length > 0 &&
      <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              {currentLanguage === 'hi' ? 'प्रगति' : 'Progress'}
            </span>
            <span>
              {currentStep + 1} / {selectedDisabilities.length + 1}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep + 1) / (selectedDisabilities.length + 1) * 100}%` }} />

          </div>
        </div>
      }

      {/* Step content */}
      {currentStep === 0 ?
      renderDisabilitySelection() :

      <div className="space-y-6">
          {renderSettingsForDisability(selectedDisabilities[currentStep - 1])}
        </div>
      }

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="touch-target">

          <Icon name="ArrowLeft" size={16} />
          <span className="ml-2">
            {currentLanguage === 'hi' ? 'पिछला' : 'Previous'}
          </span>
        </Button>

        {currentStep === selectedDisabilities.length ?
        <Button
          variant="primary"
          onClick={completeSetup}
          className="touch-target">

            <Icon name="Check" size={16} />
            <span className="ml-2">
              {currentLanguage === 'hi' ? 'सेटअप पूरा करें' : 'Complete Setup'}
            </span>
          </Button> :

        <Button
          variant="primary"
          onClick={nextStep}
          disabled={currentStep === 0 && selectedDisabilities.length === 0}
          className="touch-target">

            <span className="mr-2">
              {currentStep === 0 ?
            currentLanguage === 'hi' ? 'जारी रखें' : 'Continue' :
            currentLanguage === 'hi' ? 'अगला' : 'Next'
            }
            </span>
            <Icon name="ArrowRight" size={16} />
          </Button>
        }
      </div>

      {/* Skip option */}
      {currentStep === 0 &&
      <div className="text-center mt-4">
          <button
          onClick={completeSetup}
          className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">

            {currentLanguage === 'hi' ? 'अभी के लिए छोड़ें (बाद में सेट कर सकते हैं)' : 'Skip for now (can be set up later)'
          }
          </button>
        </div>
      }
    </div>);

};

export default AccessibilityProfileWizard;