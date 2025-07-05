import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickAccessToolbar = ({ settings, onSettingsChange, currentLanguage }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState('bottom-right');

  useEffect(() => {
    // Load saved toolbar preferences
    const savedPosition = localStorage.getItem('toolbar-position') || 'bottom-right';
    const savedVisibility = localStorage.getItem('toolbar-visible') !== 'false';
    setPosition(savedPosition);
    setIsVisible(savedVisibility);
  }, []);

  const quickActions = [
    {
      id: 'font-size',
      icon: 'Type',
      label: currentLanguage === 'hi' ? 'फ़ॉन्ट आकार' : 'Font Size',
      action: () => {
        const newSize = settings.visual.fontSize >= 24 ? 12 : settings.visual.fontSize + 2;
        onSettingsChange({
          ...settings,
          visual: { ...settings.visual, fontSize: newSize }
        });
      }
    },
    {
      id: 'contrast',
      icon: 'Contrast',
      label: currentLanguage === 'hi' ? 'कंट्रास्ट' : 'Contrast',
      action: () => {
        const contrastModes = ['normal', 'high', 'extra-high'];
        const currentIndex = contrastModes.indexOf(settings.visual.contrast);
        const nextIndex = (currentIndex + 1) % contrastModes.length;
        onSettingsChange({
          ...settings,
          visual: { ...settings.visual, contrast: contrastModes[nextIndex] }
        });
      }
    },
    {
      id: 'voice',
      icon: settings.audio.voiceCommands ? 'VolumeX' : 'Volume2',
      label: currentLanguage === 'hi' ? 'आवाज़' : 'Voice',
      action: () => {
        onSettingsChange({
          ...settings,
          audio: { ...settings.audio, voiceCommands: !settings.audio.voiceCommands }
        });
      }
    },
    {
      id: 'reading-mode',
      icon: 'BookOpen',
      label: currentLanguage === 'hi' ? 'रीडिंग मोड' : 'Reading Mode',
      action: () => {
        onSettingsChange({
          ...settings,
          cognitive: { ...settings.cognitive, simplifiedLanguage: !settings.cognitive.simplifiedLanguage }
        });
      }
    }
  ];

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    localStorage.setItem('toolbar-position', newPosition);
  };

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem('toolbar-visible', newVisibility.toString());
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 z-50"
        aria-label={currentLanguage === 'hi' ? 'त्वरित पहुंच टूलबार दिखाएं' : 'Show quick access toolbar'}
      >
        <Icon name="Settings" size={20} />
      </button>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-2">
        {/* Toolbar Header */}
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-xs font-medium text-gray-700">
            {currentLanguage === 'hi' ? 'त्वरित पहुंच' : 'Quick Access'}
          </span>
          <div className="flex space-x-1">
            {/* Position Selector */}
            <div className="relative group">
              <Button
                variant="ghost"
                className="p-1"
                aria-label={currentLanguage === 'hi' ? 'स्थिति बदलें' : 'Change position'}
              >
                <Icon name="Move" size={14} />
              </Button>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                <div className="bg-gray-900 text-white text-xs rounded p-2 whitespace-nowrap">
                  <div className="grid grid-cols-2 gap-1">
                    {Object.keys(positionClasses).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => handlePositionChange(pos)}
                        className={`p-1 rounded text-xs ${
                          position === pos ? 'bg-blue-600' : 'hover:bg-gray-700'
                        }`}
                      >
                        {pos.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hide Button */}
            <Button
              variant="ghost"
              onClick={toggleVisibility}
              className="p-1"
              aria-label={currentLanguage === 'hi' ? 'टूलबार छुपाएं' : 'Hide toolbar'}
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              onClick={action.action}
              className="flex flex-col items-center p-3 h-auto hover:bg-gray-50"
              aria-label={action.label}
            >
              <Icon name={action.icon} size={20} className="text-gray-600 mb-1" />
              <span className="text-xs text-gray-700 text-center leading-tight">
                {action.label}
              </span>
            </Button>
          ))}
        </div>

        {/* Current Settings Display */}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>{currentLanguage === 'hi' ? 'फ़ॉन्ट:' : 'Font:'}</span>
              <span>{settings.visual.fontSize}px</span>
            </div>
            <div className="flex justify-between">
              <span>{currentLanguage === 'hi' ? 'कंट्रास्ट:' : 'Contrast:'}</span>
              <span className="capitalize">{settings.visual.contrast}</span>
            </div>
            <div className="flex justify-between">
              <span>{currentLanguage === 'hi' ? 'आवाज़:' : 'Voice:'}</span>
              <span>{settings.audio.voiceCommands ? 'On' : 'Off'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessToolbar;