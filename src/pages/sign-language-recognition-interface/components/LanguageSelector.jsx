import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange, 
  sensitivity,
  onSensitivityChange 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const signLanguages = [
    {
      code: 'isl',
      name: currentLanguage === 'hi' ? 'भारतीय साइन लैंग्वेज (ISL)' : 'Indian Sign Language (ISL)',
      flag: '🇮🇳',
      description: currentLanguage === 'hi' ?'भारत में उपयोग होने वाली मुख्य साइन लैंग्वेज' :'Primary sign language used in India',
      accuracy: 95
    },
    {
      code: 'asl',
      name: currentLanguage === 'hi' ? 'अमेरिकी साइन लैंग्वेज (ASL)' : 'American Sign Language (ASL)',
      flag: '🇺🇸',
      description: currentLanguage === 'hi' ?'अमेरिका और कनाडा में उपयोग होने वाली साइन लैंग्वेज' :'Sign language used in USA and Canada',
      accuracy: 92
    },
    {
      code: 'bsl',
      name: currentLanguage === 'hi' ? 'ब्रिटिश साइन लैंग्वेज (BSL)' : 'British Sign Language (BSL)',
      flag: '🇬🇧',
      description: currentLanguage === 'hi' ?'यूके में उपयोग होने वाली साइन लैंग्वेज' :'Sign language used in United Kingdom',
      accuracy: 88
    },
    {
      code: 'fingerspelling',
      name: currentLanguage === 'hi' ? 'फिंगरस्पेलिंग' : 'Fingerspelling',
      flag: '✋',
      description: currentLanguage === 'hi' ?'अक्षरों और संख्याओं की पहचान' :'Letter and number recognition',
      accuracy: 97
    }
  ];

  const sensitivityLevels = [
    {
      value: 0.3,
      label: currentLanguage === 'hi' ? 'कम' : 'Low',
      description: currentLanguage === 'hi' ? 'धीमे साइन के लिए' : 'For slow signs'
    },
    {
      value: 0.5,
      label: currentLanguage === 'hi' ? 'मध्यम' : 'Medium',
      description: currentLanguage === 'hi' ? 'सामान्य गति के लिए' : 'For normal speed'
    },
    {
      value: 0.7,
      label: currentLanguage === 'hi' ? 'उच्च' : 'High',
      description: currentLanguage === 'hi' ? 'तेज़ साइन के लिए' : 'For fast signs'
    }
  ];

  const selectedLang = signLanguages.find(lang => lang.code === selectedLanguage) || signLanguages[0];

  return (
    <div className="bg-surface rounded-xl border border-border shadow-lg">
      {/* Header */}
      <div className="bg-surface-secondary px-6 py-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Languages" size={24} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            {currentLanguage === 'hi' ? 'भाषा सेटिंग्स' : 'Language Settings'}
          </h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Selection Display */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{selectedLang.flag}</span>
              <div>
                <h4 className="font-medium text-primary-700">{selectedLang.name}</h4>
                <p className="text-sm text-primary-600">{selectedLang.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-primary-600">
                {currentLanguage === 'hi' ? 'सटीकता' : 'Accuracy'}
              </div>
              <div className="text-lg font-semibold text-primary-700">
                {selectedLang.accuracy}%
              </div>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-text-primary">
              {currentLanguage === 'hi' ? 'साइन लैंग्वेज चुनें' : 'Select Sign Language'}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              className="touch-target"
            >
              {isExpanded 
                ? (currentLanguage === 'hi' ? 'छुपाएं' : 'Hide')
                : (currentLanguage === 'hi' ? 'सभी देखें' : 'Show All')
              }
            </Button>
          </div>

          <div className="grid gap-3">
            {(isExpanded ? signLanguages : signLanguages.slice(0, 2)).map((language) => (
              <button
                key={language.code}
                onClick={() => onLanguageChange(language.code)}
                className={`
                  w-full text-left p-4 rounded-lg border transition-all duration-200
                  ${selectedLanguage === language.code
                    ? 'border-primary bg-primary-50 shadow-sm'
                    : 'border-border bg-surface hover:bg-surface-secondary hover:border-primary-200'
                  }
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  touch-target
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{language.flag}</span>
                    <div>
                      <div className={`font-medium ${
                        selectedLanguage === language.code ? 'text-primary-700' : 'text-text-primary'
                      }`}>
                        {language.name}
                      </div>
                      <div className={`text-sm ${
                        selectedLanguage === language.code ? 'text-primary-600' : 'text-text-secondary'
                      }`}>
                        {language.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`text-sm ${
                      selectedLanguage === language.code ? 'text-primary-600' : 'text-text-secondary'
                    }`}>
                      {language.accuracy}%
                    </div>
                    {selectedLanguage === language.code && (
                      <Icon name="Check" size={16} className="text-primary" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sensitivity Settings */}
        <div>
          <h4 className="font-medium text-text-primary mb-4">
            {currentLanguage === 'hi' ? 'पहचान संवेदनशीलता' : 'Recognition Sensitivity'}
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {currentLanguage === 'hi' ? 'वर्तमान स्तर:' : 'Current Level:'}
              </span>
              <span className="text-sm font-medium text-text-primary">
                {sensitivityLevels.find(level => level.value === sensitivity)?.label || 
                 (currentLanguage === 'hi' ? 'मध्यम' : 'Medium')}
              </span>
            </div>

            <div className="relative">
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={sensitivity}
                onChange={(e) => onSensitivityChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(sensitivity - 0.1) / 0.8 * 100}%, var(--color-border) ${(sensitivity - 0.1) / 0.8 * 100}%, var(--color-border) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-text-secondary mt-2">
                <span>{currentLanguage === 'hi' ? 'कम' : 'Low'}</span>
                <span>{currentLanguage === 'hi' ? 'मध्यम' : 'Medium'}</span>
                <span>{currentLanguage === 'hi' ? 'उच्च' : 'High'}</span>
              </div>
            </div>

            <div className="bg-surface-secondary rounded-lg p-3">
              <p className="text-sm text-text-secondary">
                {sensitivity <= 0.3 
                  ? (currentLanguage === 'hi' ?'धीमे और स्पष्ट साइन के लिए बेहतर। शुरुआती लोगों के लिए उपयुक्त।' :'Better for slow and clear signs. Suitable for beginners.')
                  : sensitivity <= 0.6
                  ? (currentLanguage === 'hi' ?'सामान्य गति के साइन के लिए संतुलित सेटिंग।' :'Balanced setting for normal speed signs.')
                  : (currentLanguage === 'hi' ?'तेज़ साइन के लिए उपयुक्त। अनुभवी उपयोगकर्ताओं के लिए।' :'Suitable for fast signs. For experienced users.')
                }
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => {
              onLanguageChange('isl');
              onSensitivityChange(0.5);
            }}
            iconName="RotateCcw"
            className="touch-target"
          >
            {currentLanguage === 'hi' ? 'डिफ़ॉल्ट रीसेट करें' : 'Reset to Default'}
          </Button>

          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Zap" size={16} className="text-success" />
            <span>
              {currentLanguage === 'hi' ? 'रियल-टाइम अपडेट' : 'Real-time Updates'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;