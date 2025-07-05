import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MotorControlSettings = ({ settings, onSettingsChange, currentLanguage }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [testingGesture, setTestingGesture] = useState(false);

  const handleSliderChange = (setting, value) => {
    onSettingsChange({
      ...settings,
      motor: {
        ...settings.motor,
        [setting]: value
      }
    });
  };

  const handleToggleChange = (setting) => {
    onSettingsChange({
      ...settings,
      motor: {
        ...settings.motor,
        [setting]: !settings.motor[setting]
      }
    });
  };

  const inputMethods = [
    { value: 'mouse', label: currentLanguage === 'hi' ? 'माउस' : 'Mouse' },
    { value: 'keyboard', label: currentLanguage === 'hi' ? 'कीबोर्ड' : 'Keyboard' },
    { value: 'touch', label: currentLanguage === 'hi' ? 'टच' : 'Touch' },
    { value: 'voice', label: currentLanguage === 'hi' ? 'आवाज़' : 'Voice' },
    { value: 'eye-tracking', label: currentLanguage === 'hi' ? 'आंख ट्रैकिंग' : 'Eye Tracking' },
    { value: 'switch', label: currentLanguage === 'hi' ? 'स्विच' : 'Switch Control' }
  ];

  const testGesture = () => {
    setTestingGesture(true);
    setTimeout(() => {
      setTestingGesture(false);
      alert(currentLanguage === 'hi' ? 'जेस्चर परीक्षण पूरा!' : 'Gesture test complete!');
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          <Icon name="Hand" size={24} className="text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            {currentLanguage === 'hi' ? 'मोटर नियंत्रण सेटिंग्स' : 'Motor Control Settings'}
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
          {/* Input Method Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'प्राथमिक इनपुट विधि' : 'Primary Input Method'}
            </label>
            <select
              value={settings.motor.primaryInput}
              onChange={(e) => handleSliderChange('primaryInput', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {inputMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Gesture Sensitivity */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'जेस्चर संवेदनशीलता' : 'Gesture Sensitivity'}
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {currentLanguage === 'hi' ? 'कम' : 'Low'}
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.motor.gestureSensitivity}
                onChange={(e) => handleSliderChange('gestureSensitivity', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500">
                {currentLanguage === 'hi' ? 'उच्च' : 'High'}
              </span>
              <span className="text-sm font-medium text-gray-900 min-w-[30px]">
                {settings.motor.gestureSensitivity}
              </span>
            </div>
          </div>

          {/* Dwell Time */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'ड्वेल टाइम (मिलीसेकंड)' : 'Dwell Time (milliseconds)'}
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">100ms</span>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={settings.motor.dwellTime}
                onChange={(e) => handleSliderChange('dwellTime', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500">2000ms</span>
              <span className="text-sm font-medium text-gray-900 min-w-[60px]">
                {settings.motor.dwellTime}ms
              </span>
            </div>
          </div>

          {/* Click Assistance */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'क्लिक सहायता' : 'Click Assistance'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: 'none', label: currentLanguage === 'hi' ? 'कोई नहीं' : 'None' },
                { value: 'hover', label: currentLanguage === 'hi' ? 'होवर क्लिक' : 'Hover Click' },
                { value: 'dwell', label: currentLanguage === 'hi' ? 'ड्वेल क्लिक' : 'Dwell Click' },
                { value: 'switch', label: currentLanguage === 'hi' ? 'स्विच क्लिक' : 'Switch Click' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSliderChange('clickAssistance', option.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.motor.clickAssistance === option.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700' :'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Motor Assistance Features */}
          <div className="space-y-4">
            {[
              { key: 'stickyKeys', label: currentLanguage === 'hi' ? 'स्टिकी कीज़' : 'Sticky Keys' },
              { key: 'mouseKeys', label: currentLanguage === 'hi' ? 'माउस कीज़' : 'Mouse Keys' },
              { key: 'slowKeys', label: currentLanguage === 'hi' ? 'स्लो कीज़' : 'Slow Keys' },
              { key: 'bounceKeys', label: currentLanguage === 'hi' ? 'बाउंस कीज़' : 'Bounce Keys' },
              { key: 'oneHandedMode', label: currentLanguage === 'hi' ? 'एक हाथ मोड' : 'One-Handed Mode' }
            ].map((option) => (
              <div key={option.key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {option.label}
                </label>
                <button
                  onClick={() => handleToggleChange(option.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.motor[option.key] ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                  aria-pressed={settings.motor[option.key]}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.motor[option.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Gesture Test */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'जेस्चर परीक्षण' : 'Gesture Testing'}
            </label>
            <Button
              variant={testingGesture ? "success" : "outline"}
              onClick={testGesture}
              disabled={testingGesture}
              className="w-full"
            >
              <Icon name={testingGesture ? "Loader" : "TestTube"} size={16} />
              <span className="ml-2">
                {testingGesture 
                  ? (currentLanguage === 'hi' ? 'परीक्षण चल रहा है...' : 'Testing Gestures...')
                  : (currentLanguage === 'hi' ? 'जेस्चर परीक्षण शुरू करें' : 'Start Gesture Test')
                }
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotorControlSettings;