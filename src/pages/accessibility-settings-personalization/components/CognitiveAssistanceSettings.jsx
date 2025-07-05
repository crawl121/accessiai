import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const CognitiveAssistanceSettings = ({ settings, onSettingsChange, currentLanguage }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSliderChange = (setting, value) => {
    onSettingsChange({
      ...settings,
      cognitive: {
        ...settings.cognitive,
        [setting]: value
      }
    });
  };

  const handleToggleChange = (setting) => {
    onSettingsChange({
      ...settings,
      cognitive: {
        ...settings.cognitive,
        [setting]: !settings.cognitive[setting]
      }
    });
  };

  const complexityLevels = [
    { value: 'simple', label: currentLanguage === 'hi' ? 'सरल' : 'Simple' },
    { value: 'moderate', label: currentLanguage === 'hi' ? 'मध्यम' : 'Moderate' },
    { value: 'advanced', label: currentLanguage === 'hi' ? 'उन्नत' : 'Advanced' }
  ];

  const reminderFrequencies = [
    { value: 'never', label: currentLanguage === 'hi' ? 'कभी नहीं' : 'Never' },
    { value: 'low', label: currentLanguage === 'hi' ? 'कम' : 'Low' },
    { value: 'medium', label: currentLanguage === 'hi' ? 'मध्यम' : 'Medium' },
    { value: 'high', label: currentLanguage === 'hi' ? 'उच्च' : 'High' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          <Icon name="Brain" size={24} className="text-orange-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            {currentLanguage === 'hi' ? 'संज्ञानात्मक सहायता' : 'Cognitive Assistance'}
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
          {/* Interface Complexity */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'इंटरफेस जटिलता' : 'Interface Complexity'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {complexityLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleSliderChange('complexity', level.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.cognitive.complexity === level.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700' :'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Speed */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'पढ़ने की गति' : 'Reading Speed'}
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {currentLanguage === 'hi' ? 'धीमा' : 'Slow'}
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.cognitive.readingSpeed}
                onChange={(e) => handleSliderChange('readingSpeed', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500">
                {currentLanguage === 'hi' ? 'तेज़' : 'Fast'}
              </span>
              <span className="text-sm font-medium text-gray-900 min-w-[30px]">
                {settings.cognitive.readingSpeed}
              </span>
            </div>
          </div>

          {/* Attention Span */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'ध्यान अवधि (मिनट)' : 'Attention Span (minutes)'}
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">5</span>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={settings.cognitive.attentionSpan}
                onChange={(e) => handleSliderChange('attentionSpan', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500">60</span>
              <span className="text-sm font-medium text-gray-900 min-w-[50px]">
                {settings.cognitive.attentionSpan}min
              </span>
            </div>
          </div>

          {/* Reminder Frequency */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'अनुस्मारक आवृत्ति' : 'Reminder Frequency'}
            </label>
            <select
              value={settings.cognitive.reminderFrequency}
              onChange={(e) => handleSliderChange('reminderFrequency', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {reminderFrequencies.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cognitive Assistance Features */}
          <div className="space-y-4">
            {[
              { key: 'simplifiedLanguage', label: currentLanguage === 'hi' ? 'सरल भाषा' : 'Simplified Language' },
              { key: 'visualCues', label: currentLanguage === 'hi' ? 'दृश्य संकेत' : 'Visual Cues' },
              { key: 'progressIndicators', label: currentLanguage === 'hi' ? 'प्रगति संकेतक' : 'Progress Indicators' },
              { key: 'taskBreakdown', label: currentLanguage === 'hi' ? 'कार्य विभाजन' : 'Task Breakdown' },
              { key: 'memoryAids', label: currentLanguage === 'hi' ? 'स्मृति सहायक' : 'Memory Aids' },
              { key: 'errorPrevention', label: currentLanguage === 'hi' ? 'त्रुटि रोकथाम' : 'Error Prevention' }
            ].map((option) => (
              <div key={option.key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {option.label}
                </label>
                <button
                  onClick={() => handleToggleChange(option.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.cognitive[option.key] ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                  aria-pressed={settings.cognitive[option.key]}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.cognitive[option.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Content Preferences */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'सामग्री प्राथमिकताएं' : 'Content Preferences'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'images', label: currentLanguage === 'hi' ? 'अधिक चित्र' : 'More Images' },
                { key: 'audio', label: currentLanguage === 'hi' ? 'ऑडियो सामग्री' : 'Audio Content' },
                { key: 'videos', label: currentLanguage === 'hi' ? 'वीडियो सामग्री' : 'Video Content' },
                { key: 'text', label: currentLanguage === 'hi' ? 'पाठ सामग्री' : 'Text Content' }
              ].map((pref) => (
                <button
                  key={pref.key}
                  onClick={() => handleToggleChange(`prefer${pref.key.charAt(0).toUpperCase() + pref.key.slice(1)}`)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.cognitive[`prefer${pref.key.charAt(0).toUpperCase() + pref.key.slice(1)}`]
                      ? 'border-orange-500 bg-orange-50 text-orange-700' :'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CognitiveAssistanceSettings;