import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencySignPanel = ({ onEmergencySign, isVisible, speechSynthesis }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const emergencySigns = [
  {
    id: 'help',
    text: currentLanguage === 'hi' ? 'मदद' : 'Help',
    sign: currentLanguage === 'hi' ? 'मदद चाहिए' : 'I need help',
    icon: 'AlertTriangle',
    color: 'error',
    priority: 'high',
    description: currentLanguage === 'hi' ? 'तत्काल सहायता की आवश्यकता' : 'Immediate assistance needed'
  },
  {
    id: 'emergency',
    text: currentLanguage === 'hi' ? 'आपातकाल' : 'Emergency',
    sign: currentLanguage === 'hi' ? 'यह आपातकाल है' : 'This is an emergency',
    icon: 'Phone',
    color: 'error',
    priority: 'critical',
    description: currentLanguage === 'hi' ? 'गंभीर आपातकालीन स्थिति' : 'Critical emergency situation'
  },
  {
    id: 'medical',
    text: currentLanguage === 'hi' ? 'चिकित्सा' : 'Medical',
    sign: currentLanguage === 'hi' ? 'चिकित्सा सहायता चाहिए' : 'Need medical help',
    icon: 'Heart',
    color: 'error',
    priority: 'high',
    description: currentLanguage === 'hi' ? 'चिकित्सा सहायता की आवश्यकता' : 'Medical assistance required'
  },
  {
    id: 'police',
    text: currentLanguage === 'hi' ? 'पुलिस' : 'Police',
    sign: currentLanguage === 'hi' ? 'पुलिस को बुलाएं' : 'Call police',
    icon: 'Shield',
    color: 'warning',
    priority: 'high',
    description: currentLanguage === 'hi' ? 'पुलिस सहायता की आवश्यकता' : 'Police assistance needed'
  },
  {
    id: 'fire',
    text: currentLanguage === 'hi' ? 'आग' : 'Fire',
    sign: currentLanguage === 'hi' ? 'आग लगी है' : 'There is a fire',
    icon: 'Flame',
    color: 'error',
    priority: 'critical',
    description: currentLanguage === 'hi' ? 'अग्निशमन सेवा की आवश्यकता' : 'Fire department needed'
  },
  {
    id: 'lost',
    text: currentLanguage === 'hi' ? 'खो गया' : 'Lost',
    sign: currentLanguage === 'hi' ? 'मैं खो गया हूं' : 'I am lost',
    icon: 'MapPin',
    color: 'warning',
    priority: 'medium',
    description: currentLanguage === 'hi' ? 'दिशा की सहायता चाहिए' : 'Need direction assistance'
  }];


  const handleEmergencySelect = (emergency) => {
    setSelectedEmergency(emergency);
    onEmergencySign(emergency);

    // Voice announcement
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(emergency.sign);
      utterance.rate = 0.8;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const getColorClasses = (color, priority) => {
    const baseClasses = {
      error: {
        bg: priority === 'critical' ? 'bg-error-100 hover:bg-error-200' : 'bg-error-50 hover:bg-error-100',
        border: priority === 'critical' ? 'border-error-300' : 'border-error-200',
        text: priority === 'critical' ? 'text-error-800' : 'text-error-700',
        icon: priority === 'critical' ? 'text-error-600' : 'text-error-500'
      },
      warning: {
        bg: 'bg-warning-50 hover:bg-warning-100',
        border: 'border-warning-200',
        text: 'text-warning-700',
        icon: 'text-warning-500'
      }
    };

    return baseClasses[color] || baseClasses.warning;
  };

  if (!isVisible) return null;

  return (
    <div className="bg-surface rounded-xl border border-border shadow-lg">
      {/* Header */}
      <div className="bg-error-50 border-b border-error-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <Icon name="AlertTriangle" size={24} className="text-error animate-pulse" />
          <div>
            <h3 className="text-lg font-heading font-semibold text-error-700">
              {currentLanguage === 'hi' ? 'आपातकालीन साइन' : 'Emergency Signs'}
            </h3>
            <p className="text-sm text-error-600">
              {currentLanguage === 'hi' ? 'तत्काल सहायता के लिए साइन चुनें' : 'Select a sign for immediate assistance'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Signs Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {emergencySigns.map((emergency) => {
            const colorClasses = getColorClasses(emergency.color, emergency.priority);
            const isSelected = selectedEmergency?.id === emergency.id;

            return (
              <button
                key={emergency.id}
                onClick={() => handleEmergencySelect(emergency)}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-200
                  ${isSelected ?
                'border-primary bg-primary-50 shadow-md' :
                `${colorClasses.border} ${colorClasses.bg}`}
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  touch-target hover:shadow-md
                  ${
                emergency.priority === 'critical' ? 'animate-pulse-slow' : ''}
                `}>

                {/* Priority Indicator */}
                {emergency.priority === 'critical' &&
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-error rounded-full animate-ping" />
                }
                
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                  isSelected ? 'bg-primary-100' : 'bg-surface'}`
                  }>
                    <Icon
                      name={emergency.icon}
                      size={24}
                      className={isSelected ? 'text-primary' : colorClasses.icon} />

                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className={`font-semibold ${
                    isSelected ? 'text-primary-700' : colorClasses.text}`
                    }>
                      {emergency.text}
                    </div>
                    <div className={`text-sm ${
                    isSelected ? 'text-primary-600' : 'text-text-secondary'}`
                    }>
                      {emergency.description}
                    </div>
                  </div>
                  
                  {isSelected &&
                  <Icon name="Check" size={20} className="text-primary" />
                  }
                </div>

                {/* Sign Text Preview */}
                <div className={`mt-3 p-2 rounded text-sm font-medium ${
                isSelected ?
                'bg-primary-100 text-primary-700' : 'bg-surface text-text-secondary'}`
                }>
                  "{emergency.sign}"
                </div>
              </button>);

          })}
        </div>

        {/* Selected Emergency Actions */}
        {selectedEmergency &&
        <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Info" size={20} className="text-primary" />
                <div>
                  <div className="font-medium text-primary-700">
                    {currentLanguage === 'hi' ? 'चयनित आपातकाल:' : 'Selected Emergency:'}
                  </div>
                  <div className="text-sm text-primary-600">
                    {selectedEmergency.sign}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                variant="primary"
                size="sm"
                onClick={() => handleEmergencySelect(selectedEmergency)}
                iconName="Volume2"
                className="touch-target">

                  {currentLanguage === 'hi' ? 'दोहराएं' : 'Repeat'}
                </Button>
                
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEmergency(null)}
                iconName="X"
                className="touch-target"
                aria-label={currentLanguage === 'hi' ? 'साफ़ करें' : 'Clear'} />

              </div>
            </div>
          </div>
        }

        {/* Emergency Contacts Info */}
        <div className="mt-6 p-4 bg-surface-secondary border border-border rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Phone" size={20} className="text-text-secondary mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary mb-1">
                {currentLanguage === 'hi' ? 'आपातकालीन संपर्क:' : 'Emergency Contacts:'}
              </h4>
              <div className="text-sm text-text-secondary space-y-1">
                <div>
                  {currentLanguage === 'hi' ? 'पुलिस: 100' : 'Police: 100'}
                </div>
                <div>
                  {currentLanguage === 'hi' ? 'अग्निशमन: 101' : 'Fire: 101'}
                </div>
                <div>
                  {currentLanguage === 'hi' ? 'एम्बुलेंस: 102' : 'Ambulance: 102'}
                </div>
                <div>
                  {currentLanguage === 'hi' ? 'आपातकाल हेल्पलाइन: 112' : 'Emergency Helpline: 112'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default EmergencySignPanel;