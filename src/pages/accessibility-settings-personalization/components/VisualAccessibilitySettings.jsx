import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const VisualAccessibilitySettings = ({ settings, onSettingsChange, currentLanguage }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSliderChange = (setting, value) => {
    onSettingsChange({
      ...settings,
      visual: {
        ...settings.visual,
        [setting]: value
      }
    });
  };

  const handleToggleChange = (setting) => {
    onSettingsChange({
      ...settings,
      visual: {
        ...settings.visual,
        [setting]: !settings.visual[setting]
      }
    });
  };

  const contrastOptions = [
    { value: 'normal', label: currentLanguage === 'hi' ? 'सामान्य' : 'Normal' },
    { value: 'high', label: currentLanguage === 'hi' ? 'उच्च' : 'High' },
    { value: 'extra-high', label: currentLanguage === 'hi' ? 'अतिरिक्त उच्च' : 'Extra High' }
  ];

  const colorBlindnessOptions = [
    { value: 'none', label: currentLanguage === 'hi' ? 'कोई नहीं' : 'None' },
    { value: 'protanopia', label: 'Protanopia' },
    { value: 'deuteranopia', label: 'Deuteranopia' },
    { value: 'tritanopia', label: 'Tritanopia' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          <Icon name="Eye" size={24} className="text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            {currentLanguage === 'hi' ? 'दृश्य पहुंच सेटिंग्स' : 'Visual Accessibility Settings'}
          </h3>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-gray-500"
        />
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6">
          {/* Font Size Control */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'फ़ॉन्ट आकार' : 'Font Size'}
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">12px</span>
              <input
                type="range"
                min="12"
                max="24"
                value={settings.visual.fontSize}
                onChange={(e) => handleSliderChange('fontSize', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500">24px</span>
              <span className="text-sm font-medium text-gray-900 min-w-[40px]">
                {settings.visual.fontSize}px
              </span>
            </div>
          </div>

          {/* Contrast Settings */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'कंट्रास्ट मोड' : 'Contrast Mode'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {contrastOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSliderChange('contrast', option.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.visual.contrast === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700' :'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Blindness Support */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'रंग अंधता सहायता' : 'Color Blindness Support'}
            </label>
            <select
              value={settings.visual.colorBlindness}
              onChange={(e) => handleSliderChange('colorBlindness', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {colorBlindnessOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4">
            {[
              { key: 'screenReader', label: currentLanguage === 'hi' ? 'स्क्रीन रीडर अनुकूलन' : 'Screen Reader Optimization' },
              { key: 'animations', label: currentLanguage === 'hi' ? 'एनिमेशन कम करें' : 'Reduce Animations' },
              { key: 'focusIndicators', label: currentLanguage === 'hi' ? 'फोकस संकेतक बढ़ाएं' : 'Enhanced Focus Indicators' },
              { key: 'largeButtons', label: currentLanguage === 'hi' ? 'बड़े बटन' : 'Large Buttons' }
            ].map((option) => (
              <div key={option.key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {option.label}
                </label>
                <button
                  onClick={() => handleToggleChange(option.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.visual[option.key] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  aria-pressed={settings.visual[option.key]}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.visual[option.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Preview Button */}
          <Button
            variant={previewMode ? "success" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
            className="w-full"
          >
            <Icon name="Eye" size={16} />
            <span className="ml-2">
              {previewMode 
                ? (currentLanguage === 'hi' ? 'पूर्वावलोकन बंद करें' : 'Exit Preview')
                : (currentLanguage === 'hi' ? 'पूर्वावलोकन' : 'Preview Changes')
              }
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default VisualAccessibilitySettings;