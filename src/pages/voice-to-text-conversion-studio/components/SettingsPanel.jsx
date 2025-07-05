import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SettingsPanel = ({
  fontSize,
  onFontSizeChange,
  noiseReduction,
  onNoiseReductionChange,
  autoSave,
  onAutoSaveChange,
  currentLanguage,
  isCollapsed,
  onToggleCollapse, speechSynthesis
}) => {
  const fontSizes = [
  { value: 14, label: currentLanguage === 'hi' ? 'छोटा' : 'Small' },
  { value: 16, label: currentLanguage === 'hi' ? 'सामान्य' : 'Normal' },
  { value: 18, label: currentLanguage === 'hi' ? 'बड़ा' : 'Large' },
  { value: 20, label: currentLanguage === 'hi' ? 'बहुत बड़ा' : 'Extra Large' },
  { value: 24, label: currentLanguage === 'hi' ? 'विशाल' : 'Huge' }];


  const noiseReductionLevels = [
  { value: 'off', label: currentLanguage === 'hi' ? 'बंद' : 'Off' },
  { value: 'low', label: currentLanguage === 'hi' ? 'कम' : 'Low' },
  { value: 'medium', label: currentLanguage === 'hi' ? 'मध्यम' : 'Medium' },
  { value: 'high', label: currentLanguage === 'hi' ? 'उच्च' : 'High' }];


  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-lg text-text-primary">
            {currentLanguage === 'hi' ? 'सेटिंग्स' : 'Settings'}
          </h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand settings' : 'Collapse settings'}
          className="lg:hidden touch-target">

          <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
        </Button>
      </div>

      {/* Content */}
      <div className={`${isCollapsed ? 'hidden lg:block' : 'block'}`}>
        <div className="p-4 space-y-6">
          {/* Font Size Setting */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              {currentLanguage === 'hi' ? 'फ़ॉन्ट साइज़' : 'Font Size'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fontSizes.map((size) =>
              <Button
                key={size.value}
                variant={fontSize === size.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => onFontSizeChange(size.value)}
                className="touch-target"
                aria-pressed={fontSize === size.value}>

                  <span style={{ fontSize: `${Math.min(size.value, 16)}px` }}>
                    {size.label}
                  </span>
                </Button>
              )}
            </div>
            <div className="mt-2 text-xs text-text-secondary">
              {currentLanguage === 'hi' ? 'वर्तमान: ' : 'Current: '}{fontSize}px
            </div>
          </div>

          {/* Noise Reduction Setting */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              {currentLanguage === 'hi' ? 'शोर कम करना' : 'Noise Reduction'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {noiseReductionLevels.map((level) =>
              <Button
                key={level.value}
                variant={noiseReduction === level.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => onNoiseReductionChange(level.value)}
                className="touch-target"
                aria-pressed={noiseReduction === level.value}>

                  {level.label}
                </Button>
              )}
            </div>
            <div className="mt-2 text-xs text-text-secondary">
              {currentLanguage === 'hi' ? 'उच्च स्तर बेहतर गुणवत्ता देता है लेकिन अधिक प्रोसेसिंग की आवश्यकता होती है' : 'Higher levels provide better quality but require more processing'
              }
            </div>
          </div>

          {/* Auto Save Toggle */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary">
                {currentLanguage === 'hi' ? 'ऑटो सेव' : 'Auto Save'}
              </label>
              <Button
                variant={autoSave ? "primary" : "ghost"}
                size="sm"
                onClick={() => onAutoSaveChange(!autoSave)}
                className="touch-target"
                aria-pressed={autoSave}
                aria-label={`${autoSave ? 'Disable' : 'Enable'} auto save`}>

                <Icon name={autoSave ? "ToggleRight" : "ToggleLeft"} size={20} />
              </Button>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {currentLanguage === 'hi' ? 'ट्रांसक्रिप्शन को स्वचालित रूप से सेव करें' : 'Automatically save transcriptions as you speak'
              }
            </p>
          </div>

          {/* Quick Actions */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              {currentLanguage === 'hi' ? 'त्वरित कार्य' : 'Quick Actions'}
            </label>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Reset to defaults
                  onFontSizeChange(16);
                  onNoiseReductionChange('medium');
                  onAutoSaveChange(true);
                }}
                className="w-full justify-start touch-target">

                <Icon name="RotateCcw" size={16} />
                <span className="ml-2">
                  {currentLanguage === 'hi' ? 'डिफ़ॉल्ट रीसेट करें' : 'Reset to Defaults'}
                </span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Test microphone
                  if ('speechSynthesis' in window) {
                    const message = currentLanguage === 'hi' ? 'माइक्रोफोन टेस्ट - यदि आप यह सुन सकते हैं तो ऑडियो काम कर रहा है' : 'Microphone test - if you can hear this, audio is working';
                    const utterance = new SpeechSynthesisUtterance(message);
                    speechSynthesis.speak(utterance);
                  }
                }}
                className="w-full justify-start touch-target">

                <Icon name="TestTube" size={16} />
                <span className="ml-2">
                  {currentLanguage === 'hi' ? 'माइक टेस्ट करें' : 'Test Microphone'}
                </span>
              </Button>
            </div>
          </div>

          {/* Accessibility Info */}
          <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Accessibility" size={16} className="text-primary-600 mt-0.5" />
              <div className="text-sm text-primary-700">
                <div className="font-medium mb-1">
                  {currentLanguage === 'hi' ? 'पहुंच सुविधाएं:' : 'Accessibility Features:'}
                </div>
                <ul className="space-y-1 text-xs">
                  <li>
                    {currentLanguage === 'hi' ? '• कीबोर्ड नेवीगेशन समर्थित' : '• Keyboard navigation supported'
                    }
                  </li>
                  <li>
                    {currentLanguage === 'hi' ? '• स्क्रीन रीडर अनुकूल' : '• Screen reader compatible'
                    }
                  </li>
                  <li>
                    {currentLanguage === 'hi' ? '• वॉइस फीडबैक उपलब्ध' : '• Voice feedback available'
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default SettingsPanel;