import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccessibilityTipsPanel = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const tips = [
    {
      icon: 'Volume2',
      title: currentLanguage === 'hi' ? 'आवाज फीडबैक' : 'Voice Feedback',
      description: currentLanguage === 'hi' ?'सभी बटन और फॉर्म फील्ड में आवाज फीडबैक उपलब्ध है। टूलबार से आवाज सक्षम करें।' :'Voice feedback is available for all buttons and form fields. Enable voice from the toolbar.',
      shortcut: currentLanguage === 'hi' ? 'Alt + V' : 'Alt + V'
    },
    {
      icon: 'Keyboard',
      title: currentLanguage === 'hi' ? 'कीबोर्ड नेवीगेशन' : 'Keyboard Navigation',
      description: currentLanguage === 'hi' ?'Tab का उपयोग करके फॉर्म फील्ड के बीच नेवीगेट करें। Enter दबाकर बटन दबाएं।' :'Use Tab to navigate between form fields. Press Enter to activate buttons.',
      shortcut: currentLanguage === 'hi' ? 'Tab / Enter' : 'Tab / Enter'
    },
    {
      icon: 'Eye',
      title: currentLanguage === 'hi' ? 'उच्च कंट्रास्ट' : 'High Contrast',
      description: currentLanguage === 'hi' ?'बेहतर दृश्यता के लिए उच्च कंट्रास्ट मोड सक्षम करें। टूलबार से टॉगल करें।' :'Enable high contrast mode for better visibility. Toggle from the toolbar.',
      shortcut: currentLanguage === 'hi' ? 'Alt + C' : 'Alt + C'
    },
    {
      icon: 'Type',
      title: currentLanguage === 'hi' ? 'फॉन्ट साइज़' : 'Font Size',
      description: currentLanguage === 'hi' ?'टूलबार से फॉन्ट साइज़ बढ़ाएं या घटाएं। + और - बटन का उपयोग करें।' :'Increase or decrease font size from the toolbar. Use + and - buttons.',
      shortcut: currentLanguage === 'hi' ? 'Ctrl + / Ctrl -' : 'Ctrl + / Ctrl -'
    },
    {
      icon: 'Mic',
      title: currentLanguage === 'hi' ? 'आवाज लॉगिन' : 'Voice Login',
      description: currentLanguage === 'hi' ?'माइक्रोफोन बटन दबाकर आवाज से लॉगिन करें। "लॉगिन" कहें।' : 'Press the microphone button to login with voice. Say"login".',
      shortcut: currentLanguage === 'hi' ? 'Alt + M' : 'Alt + M'
    },
    {
      icon: 'Hand',
      title: currentLanguage === 'hi' ? 'हाथ के इशारे' : 'Hand Gestures',
      description: currentLanguage === 'hi' ?'कैमरे के सामने हाथ के इशारे दिखाकर लॉगिन करें। हाथ हिलाएं।' :'Login by showing hand gestures to the camera. Wave your hand.',
      shortcut: currentLanguage === 'hi' ? 'Alt + G' : 'Alt + G'
    }
  ];

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const announceToUser = (message) => {
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const handleTipChange = (direction) => {
    if (direction === 'next') {
      nextTip();
    } else {
      prevTip();
    }
    announceToUser(tips[currentTip].title);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center">
          <Icon name="Lightbulb" size={20} className="text-blue-600 mr-2" />
          {currentLanguage === 'hi' ? 'पहुंच सुझाव' : 'Accessibility Tips'}
        </h3>
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={
            isExpanded 
              ? (currentLanguage === 'hi' ? 'सुझाव छुपाएं' : 'Hide tips')
              : (currentLanguage === 'hi' ? 'सुझाव दिखाएं' : 'Show tips')
          }
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon 
                  name={tips[currentTip].icon} 
                  size={20} 
                  className="text-blue-600"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">
                  {tips[currentTip].title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {tips[currentTip].description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
                    {tips[currentTip].shortcut}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => handleTipChange('prev')}
              aria-label={currentLanguage === 'hi' ? 'पिछला सुझाव' : 'Previous tip'}
            >
              <Icon name="ChevronLeft" size={16} />
              {currentLanguage === 'hi' ? 'पिछला' : 'Previous'}
            </Button>

            <div className="flex space-x-1">
              {tips.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentTip(index);
                    announceToUser(tips[index].title);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTip ? 'bg-blue-600' : 'bg-blue-200'
                  }`}
                  aria-label={`${currentLanguage === 'hi' ? 'सुझाव' : 'Tip'} ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => handleTipChange('next')}
              aria-label={currentLanguage === 'hi' ? 'अगला सुझाव' : 'Next tip'}
            >
              {currentLanguage === 'hi' ? 'अगला' : 'Next'}
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-blue-600">
              {currentLanguage === 'hi' 
                ? `सुझाव ${currentTip + 1} का ${tips.length}`
                : `Tip ${currentTip + 1} of ${tips.length}`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityTipsPanel;