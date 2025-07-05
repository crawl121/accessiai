import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LanguageSelector = ({
  selectedLanguage,
  onLanguageChange,
  currentLanguage, speechSynthesis
}) => {
  const languages = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English', flag: '🇺🇸' },
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' }];


  const handleLanguageSelect = (langCode) => {
    onLanguageChange(langCode);

    // Voice feedback if enabled
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const selectedLang = languages.find((lang) => lang.code === langCode);
      const message = currentLanguage === 'hi' ?
      `भाषा बदली गई: ${selectedLang?.nativeName}` :
      `Language changed to: ${selectedLang?.name}`;
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }
  };

  const selectedLangData = languages.find((lang) => lang.code === selectedLanguage);

  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Globe" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-lg text-text-primary">
            {currentLanguage === 'hi' ? 'भाषा चुनें' : 'Select Language'}
          </h3>
        </div>
        <p className="text-sm text-text-secondary mt-1">
          {currentLanguage === 'hi' ? 'वॉइस रिकग्निशन के लिए भाषा चुनें' : 'Choose language for voice recognition'
          }
        </p>
      </div>

      <div className="p-4">
        {/* Current Selection */}
        <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{selectedLangData?.flag}</span>
            <div>
              <div className="font-medium text-primary-700">
                {selectedLangData?.nativeName}
              </div>
              <div className="text-sm text-primary-600">
                {selectedLangData?.name}
              </div>
            </div>
            <Icon name="Check" size={16} className="text-primary ml-auto" />
          </div>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {languages.map((language) => {
            const isSelected = language.code === selectedLanguage;

            return (
              <Button
                key={language.code}
                variant={isSelected ? "primary" : "ghost"}
                onClick={() => handleLanguageSelect(language.code)}
                className={`
                  justify-start p-3 h-auto touch-target
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}
                aria-pressed={isSelected}
                aria-label={`${currentLanguage === 'hi' ? 'भाषा चुनें' : 'Select language'}: ${language.name}`}>

                <div className="flex items-center space-x-3 w-full">
                  <span className="text-lg">{language.flag}</span>
                  <div className="text-left flex-1">
                    <div className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                      {language.nativeName}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-primary-100' : 'text-text-secondary'}`}>
                      {language.name}
                    </div>
                  </div>
                  {isSelected &&
                  <Icon name="Check" size={16} className="text-white" />
                  }
                </div>
              </Button>);

          })}
        </div>

        {/* Language Tips */}
        <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-warning-600 mt-0.5" />
            <div className="text-sm text-warning-700">
              <div className="font-medium mb-1">
                {currentLanguage === 'hi' ? 'सुझाव:' : 'Tips:'}
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  {currentLanguage === 'hi' ? '• स्पष्ट और धीमी गति से बोलें' : '• Speak clearly and at moderate pace'
                  }
                </li>
                <li>
                  {currentLanguage === 'hi' ? '• शोर से दूर रहें' : '• Minimize background noise'
                  }
                </li>
                <li>
                  {currentLanguage === 'hi' ? '• माइक को मुंह के पास रखें' : '• Keep microphone close to your mouth'
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default LanguageSelector;