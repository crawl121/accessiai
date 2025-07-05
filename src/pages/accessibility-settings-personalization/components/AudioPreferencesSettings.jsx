import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AudioPreferencesSettings = ({ settings, onSettingsChange, currentLanguage, speechSynthesis }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSliderChange = (setting, value) => {
    onSettingsChange({
      ...settings,
      audio: {
        ...settings.audio,
        [setting]: value
      }
    });
  };

  const handleToggleChange = (setting) => {
    onSettingsChange({
      ...settings,
      audio: {
        ...settings.audio,
        [setting]: !settings.audio[setting]
      }
    });
  };

  const voiceOptions = [
  { value: 'female-1', label: currentLanguage === 'hi' ? 'महिला आवाज़ 1' : 'Female Voice 1' },
  { value: 'male-1', label: currentLanguage === 'hi' ? 'पुरुष आवाज़ 1' : 'Male Voice 1' },
  { value: 'female-2', label: currentLanguage === 'hi' ? 'महिला आवाज़ 2' : 'Female Voice 2' },
  { value: 'male-2', label: currentLanguage === 'hi' ? 'पुरुष आवाज़ 2' : 'Male Voice 2' }];


  const testVoice = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(
        currentLanguage === 'hi' ? 'यह आपकी चुनी गई आवाज़ का परीक्षण है।' : 'This is a test of your selected voice.'
      );
      utterance.rate = settings.audio.speechSpeed / 100;
      utterance.volume = settings.audio.volume / 100;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
        aria-expanded={isExpanded}>

        <div className="flex items-center space-x-3">
          <Icon name="Volume2" size={24} className="text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            {currentLanguage === 'hi' ? 'ऑडियो प्राथमिकताएं' : 'Audio Preferences'}
          </h3>
        </div>
        <Icon
          name={isExpanded ? "ChevronUp" : "ChevronDown"}
          size={20}
          className="text-gray-500" />

      </button>

      {isExpanded &&
      <div className="px-6 pb-6 space-y-6">
          {/* Voice Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'आवाज़ चयन' : 'Voice Selection'}
            </label>
            <select
            value={settings.audio.voice}
            onChange={(e) => handleSliderChange('voice', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">

              {voiceOptions.map((option) =>
            <option key={option.value} value={option.value}>
                  {option.label}
                </option>
            )}
            </select>
            <Button
            variant={isPlaying ? "success" : "outline"}
            onClick={testVoice}
            disabled={isPlaying}
            className="w-full sm:w-auto">

              <Icon name={isPlaying ? "Square" : "Play"} size={16} />
              <span className="ml-2">
                {isPlaying ?
              currentLanguage === 'hi' ? 'चल रहा है...' : 'Playing...' :
              currentLanguage === 'hi' ? 'आवाज़ परीक्षण' : 'Test Voice'
              }
              </span>
            </Button>
          </div>

          {/* Speech Speed */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'बोलने की गति' : 'Speech Speed'}
            </label>
            <div className="flex items-center space-x-4">
              <Icon name="Rewind" size={16} className="text-gray-400" />
              <input
              type="range"
              min="50"
              max="200"
              value={settings.audio.speechSpeed}
              onChange={(e) => handleSliderChange('speechSpeed', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />

              <Icon name="FastForward" size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-900 min-w-[50px]">
                {settings.audio.speechSpeed}%
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'आवाज़ की मात्रा' : 'Volume Level'}
            </label>
            <div className="flex items-center space-x-4">
              <Icon name="VolumeX" size={16} className="text-gray-400" />
              <input
              type="range"
              min="0"
              max="100"
              value={settings.audio.volume}
              onChange={(e) => handleSliderChange('volume', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />

              <Icon name="Volume2" size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-900 min-w-[50px]">
                {settings.audio.volume}%
              </span>
            </div>
          </div>

          {/* Audio Features */}
          <div className="space-y-4">
            {[
          { key: 'audioDescriptions', label: currentLanguage === 'hi' ? 'ऑडियो विवरण' : 'Audio Descriptions' },
          { key: 'soundEffects', label: currentLanguage === 'hi' ? 'ध्वनि प्रभाव' : 'Sound Effects' },
          { key: 'navigationSounds', label: currentLanguage === 'hi' ? 'नेवीगेशन ध्वनियां' : 'Navigation Sounds' },
          { key: 'voiceCommands', label: currentLanguage === 'hi' ? 'आवाज़ कमांड' : 'Voice Commands' }].
          map((option) =>
          <div key={option.key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {option.label}
                </label>
                <button
              onClick={() => handleToggleChange(option.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
              settings.audio[option.key] ? 'bg-green-600' : 'bg-gray-200'}`
              }
              aria-pressed={settings.audio[option.key]}>

                  <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                settings.audio[option.key] ? 'translate-x-6' : 'translate-x-1'}`
                } />

                </button>
              </div>
          )}
          </div>

          {/* Audio Language */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'ऑडियो भाषा' : 'Audio Language'}
            </label>
            <select
            value={settings.audio.language}
            onChange={(e) => handleSliderChange('language', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">

              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en-hi">English + Hindi</option>
            </select>
          </div>
        </div>
      }
    </div>);

};

export default AudioPreferencesSettings;