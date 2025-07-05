import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AccessibilityToolbar = () => {
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState('normal');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedFontSize = localStorage.getItem('accessibility-font-size');
    const savedContrast = localStorage.getItem('accessibility-contrast');
    const savedVoice = localStorage.getItem('accessibility-voice');
    const savedLanguage = localStorage.getItem('accessibility-language');

    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedContrast) setContrast(savedContrast);
    if (savedVoice) setIsVoiceEnabled(savedVoice === 'true');
    if (savedLanguage) setCurrentLanguage(savedLanguage);

    // Apply font size to document
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    // Apply contrast mode
    document.documentElement.setAttribute('data-contrast', contrast);
  }, [fontSize, contrast]);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    localStorage.setItem('accessibility-font-size', newSize.toString());
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    localStorage.setItem('accessibility-font-size', newSize.toString());
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const resetFontSize = () => {
    setFontSize(16);
    localStorage.setItem('accessibility-font-size', '16');
    document.documentElement.style.fontSize = '16px';
  };

  const toggleContrast = () => {
    const newContrast = contrast === 'normal' ? 'high' : 'normal';
    setContrast(newContrast);
    localStorage.setItem('accessibility-contrast', newContrast);
    document.documentElement.setAttribute('data-contrast', newContrast);
  };

  const toggleVoice = () => {
    const newVoiceState = !isVoiceEnabled;
    setIsVoiceEnabled(newVoiceState);
    localStorage.setItem('accessibility-voice', newVoiceState.toString());
    
    if (newVoiceState) {
      // Initialize voice feedback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Voice feedback enabled');
        speechSynthesis.speak(utterance);
      }
    }
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('accessibility-language', lang);
    // Trigger language change event for other components
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
  ];

  return (
    <div className="accessibility-toolbar" role="banner" aria-label="Accessibility Controls">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <div className="flex items-center space-x-4">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <Icon name="Accessibility" size={24} className="text-primary" />
          <span className="font-heading font-semibold text-lg text-primary">
            AccessiAI
          </span>
        </div>

        {/* Font Size Controls */}
        <div className="flex items-center space-x-1" role="group" aria-label="Font Size Controls">
          <Button
            variant="ghost"
            size="sm"
            onClick={decreaseFontSize}
            aria-label="Decrease font size"
            className="touch-target"
          >
            <Icon name="Minus" size={16} />
          </Button>
          
          <span className="text-sm font-mono px-2" aria-live="polite">
            {fontSize}px
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={increaseFontSize}
            aria-label="Increase font size"
            className="touch-target"
          >
            <Icon name="Plus" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFontSize}
            aria-label="Reset font size to default"
            className="touch-target"
          >
            <Icon name="RotateCcw" size={16} />
          </Button>
        </div>

        {/* Contrast Toggle */}
        <Button
          variant={contrast === 'high' ? 'primary' : 'ghost'}
          size="sm"
          onClick={toggleContrast}
          aria-label={`${contrast === 'high' ? 'Disable' : 'Enable'} high contrast mode`}
          aria-pressed={contrast === 'high'}
          className="touch-target"
        >
          <Icon name="Contrast" size={16} />
          <span className="hidden sm:inline ml-2">
            {contrast === 'high' ? 'High Contrast' : 'Normal'}
          </span>
        </Button>

        {/* Voice Feedback Toggle */}
        <Button
          variant={isVoiceEnabled ? 'primary' : 'ghost'}
          size="sm"
          onClick={toggleVoice}
          aria-label={`${isVoiceEnabled ? 'Disable' : 'Enable'} voice feedback`}
          aria-pressed={isVoiceEnabled}
          className="touch-target"
        >
          <Icon name={isVoiceEnabled ? 'Volume2' : 'VolumeX'} size={16} />
          <span className="hidden sm:inline ml-2">
            Voice {isVoiceEnabled ? 'On' : 'Off'}
          </span>
        </Button>

        {/* Language Selector */}
        <div className="relative">
          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="appearance-none bg-surface border border-border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent touch-target"
            aria-label="Select language"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-text-secondary"
          />
        </div>
      </div>

      {/* Emergency Access Button */}
      <Button
        variant="accent"
        size="sm"
        onClick={() => {
          // Trigger emergency access panel
          window.dispatchEvent(new CustomEvent('emergencyAccess'));
        }}
        aria-label="Emergency accessibility tools"
        className="touch-target"
      >
        <Icon name="AlertTriangle" size={16} />
        <span className="hidden sm:inline ml-2">Emergency</span>
      </Button>
    </div>
  );
};

export default AccessibilityToolbar;