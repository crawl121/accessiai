import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VisualAccessibilitySettings from './components/VisualAccessibilitySettings';
import AudioPreferencesSettings from './components/AudioPreferencesSettings';
import MotorControlSettings from './components/MotorControlSettings';
import CognitiveAssistanceSettings from './components/CognitiveAssistanceSettings';
import EmergencyFeaturesSettings from './components/EmergencyFeaturesSettings';
import ProfileManager from './components/ProfileManager';
import QuickAccessToolbar from './components/QuickAccessToolbar';

const AccessibilitySettingsPersonalization = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [settings, setSettings] = useState({
    visual: {
      fontSize: 16,
      contrast: 'normal',
      colorBlindness: 'none',
      screenReader: false,
      animations: true,
      focusIndicators: true,
      largeButtons: false
    },
    audio: {
      voice: 'female-1',
      speechSpeed: 100,
      volume: 70,
      audioDescriptions: false,
      soundEffects: true,
      navigationSounds: true,
      voiceCommands: false,
      language: 'en'
    },
    motor: {
      primaryInput: 'mouse',
      gestureSensitivity: 5,
      dwellTime: 1000,
      clickAssistance: 'none',
      stickyKeys: false,
      mouseKeys: false,
      slowKeys: false,
      bounceKeys: false,
      oneHandedMode: false
    },
    cognitive: {
      complexity: 'moderate',
      readingSpeed: 5,
      attentionSpan: 30,
      reminderFrequency: 'medium',
      simplifiedLanguage: false,
      visualCues: true,
      progressIndicators: true,
      taskBreakdown: false,
      memoryAids: false,
      errorPrevention: true,
      preferImages: false,
      preferAudio: false,
      preferVideos: false,
      preferText: true
    },
    emergency: {
      triggerMethod: 'triple-tap',
      emergencyContacts: [
        { name: 'Emergency Contact', phone: '+91-9876543210', relationship: 'Family' }
      ],
      emergencyMessage: 'This is an emergency message. I need assistance.',
      autoLocation: true,
      flashlight: true,
      loudAlarm: true,
      screenFlash: false,
      vibration: true,
      medicalInfo: ''
    }
  });

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Load saved settings
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    setHasUnsavedChanges(true);
    
    // Apply settings immediately for preview
    if (isPreviewMode) {
      applySettingsToDOM(newSettings);
    }
  };

  const applySettingsToDOM = (settingsToApply) => {
    // Apply font size
    document.documentElement.style.fontSize = `${settingsToApply.visual.fontSize}px`;
    
    // Apply contrast
    document.documentElement.setAttribute('data-contrast', settingsToApply.visual.contrast);
    
    // Apply other visual settings
    if (settingsToApply.visual.animations === false) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
      setHasUnsavedChanges(false);
      setShowSaveConfirmation(true);
      
      // Apply settings to DOM
      applySettingsToDOM(settings);
      
      // Voice feedback
      if (settings.audio.voiceCommands && 'speechSynthesis' in window) {
        const message = currentLanguage === 'hi' ?'सेटिंग्स सफलतापूर्वक सेव की गईं' :'Settings saved successfully';
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
      }
      
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(currentLanguage === 'hi' ? 'सेटिंग्स सेव करने में त्रुटि!' : 'Error saving settings!');
    }
  };

  const resetToDefaults = () => {
    if (window.confirm(currentLanguage === 'hi' ?'क्या आप सभी सेटिंग्स को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?' :'Are you sure you want to reset all settings to default?'
    )) {
      const defaultSettings = {
        visual: {
          fontSize: 16,
          contrast: 'normal',
          colorBlindness: 'none',
          screenReader: false,
          animations: true,
          focusIndicators: true,
          largeButtons: false
        },
        audio: {
          voice: 'female-1',
          speechSpeed: 100,
          volume: 70,
          audioDescriptions: false,
          soundEffects: true,
          navigationSounds: true,
          voiceCommands: false,
          language: 'en'
        },
        motor: {
          primaryInput: 'mouse',
          gestureSensitivity: 5,
          dwellTime: 1000,
          clickAssistance: 'none',
          stickyKeys: false,
          mouseKeys: false,
          slowKeys: false,
          bounceKeys: false,
          oneHandedMode: false
        },
        cognitive: {
          complexity: 'moderate',
          readingSpeed: 5,
          attentionSpan: 30,
          reminderFrequency: 'medium',
          simplifiedLanguage: false,
          visualCues: true,
          progressIndicators: true,
          taskBreakdown: false,
          memoryAids: false,
          errorPrevention: true,
          preferImages: false,
          preferAudio: false,
          preferVideos: false,
          preferText: true
        },
        emergency: {
          triggerMethod: 'triple-tap',
          emergencyContacts: [],
          emergencyMessage: 'This is an emergency message. I need assistance.',
          autoLocation: true,
          flashlight: true,
          loudAlarm: true,
          screenFlash: false,
          vibration: true,
          medicalInfo: ''
        }
      };
      
      setSettings(defaultSettings);
      setHasUnsavedChanges(true);
    }
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      applySettingsToDOM(settings);
    } else {
      // Reset to saved settings
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        applySettingsToDOM(JSON.parse(savedSettings));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/accessible-dashboard-control-center')}
                aria-label={currentLanguage === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Go back to dashboard'}
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <button
                      onClick={() => navigate('/accessible-dashboard-control-center')}
                      className="hover:text-gray-700 transition-colors duration-200"
                    >
                      {currentLanguage === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
                    </button>
                  </li>
                  <Icon name="ChevronRight" size={16} />
                  <li className="text-gray-900 font-medium">
                    {currentLanguage === 'hi' ? 'पहुंच सेटिंग्स' : 'Accessibility Settings'}
                  </li>
                </ol>
              </nav>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <Button
                variant={isPreviewMode ? "success" : "outline"}
                onClick={togglePreviewMode}
              >
                <Icon name="Eye" size={16} />
                <span className="ml-2 hidden sm:inline">
                  {isPreviewMode 
                    ? (currentLanguage === 'hi' ? 'पूर्वावलोकन बंद करें' : 'Exit Preview')
                    : (currentLanguage === 'hi' ? 'पूर्वावलोकन' : 'Preview')
                  }
                </span>
              </Button>
              
              <Button
                variant="outline"
                onClick={resetToDefaults}
              >
                <Icon name="RotateCcw" size={16} />
                <span className="ml-2 hidden sm:inline">
                  {currentLanguage === 'hi' ? 'रीसेट' : 'Reset'}
                </span>
              </Button>
              
              <Button
                variant="primary"
                onClick={saveSettings}
                disabled={!hasUnsavedChanges}
              >
                <Icon name="Save" size={16} />
                <span className="ml-2">
                  {currentLanguage === 'hi' ? 'सेव करें' : 'Save'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentLanguage === 'hi' ? 'पहुंच सेटिंग्स और व्यक्तिगतकरण' : 'Accessibility Settings & Personalization'}
          </h1>
          <p className="text-lg text-gray-600">
            {currentLanguage === 'hi' ?'अपनी आवश्यकताओं के अनुसार पहुंच सुविधाओं को कस्टमाइज़ करें' :'Customize accessibility features according to your needs'
            }
          </p>
        </div>

        {/* Save Confirmation */}
        {showSaveConfirmation && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Icon name="CheckCircle" size={20} className="text-green-600 mr-3" />
              <span className="text-green-800 font-medium">
                {currentLanguage === 'hi' ? 'सेटिंग्स सफलतापूर्वक सेव की गईं!' : 'Settings saved successfully!'}
              </span>
            </div>
          </div>
        )}

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Icon name="AlertTriangle" size={20} className="text-yellow-600 mr-3" />
              <span className="text-yellow-800">
                {currentLanguage === 'hi' ?'आपके पास असेव किए गए परिवर्तन हैं। सेव करना न भूलें।' :'You have unsaved changes. Don\'t forget to save.'
                }
              </span>
            </div>
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Management */}
          <ProfileManager
            settings={settings}
            onSettingsChange={handleSettingsChange}
            currentLanguage={currentLanguage}
          />

          {/* Visual Accessibility Settings */}
          <VisualAccessibilitySettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            currentLanguage={currentLanguage}
          />

          {/* Audio Preferences Settings */}
          <AudioPreferencesSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            currentLanguage={currentLanguage}
          />

          {/* Motor Control Settings */}
          <MotorControlSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            currentLanguage={currentLanguage}
          />

          {/* Cognitive Assistance Settings */}
          <CognitiveAssistanceSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            currentLanguage={currentLanguage}
          />

          {/* Emergency Features Settings */}
          <EmergencyFeaturesSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            currentLanguage={currentLanguage}
          />
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate('/accessible-dashboard-control-center')}
            className="sm:w-auto w-full"
          >
            <Icon name="ArrowLeft" size={16} />
            <span className="ml-2">
              {currentLanguage === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}
            </span>
          </Button>
          
          <Button
            variant="primary"
            onClick={saveSettings}
            disabled={!hasUnsavedChanges}
            className="sm:w-auto w-full"
          >
            <Icon name="Save" size={16} />
            <span className="ml-2">
              {currentLanguage === 'hi' ? 'सभी सेटिंग्स सेव करें' : 'Save All Settings'}
            </span>
          </Button>
        </div>
      </main>

      {/* Quick Access Toolbar */}
      <QuickAccessToolbar
        settings={settings}
        onSettingsChange={handleSettingsChange}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default AccessibilitySettingsPersonalization;