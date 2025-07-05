import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProfileManager = ({ settings, onSettingsChange, currentLanguage }) => {
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('default');

  const presetProfiles = [
    {
      id: 'visual-impairment',
      name: currentLanguage === 'hi' ? 'दृश्य हानि' : 'Visual Impairment',
      description: currentLanguage === 'hi' ? 'उच्च कंट्रास्ट, बड़े फ़ॉन्ट, स्क्रीन रीडर' : 'High contrast, large fonts, screen reader',
      icon: 'Eye',
      settings: {
        visual: { fontSize: 20, contrast: 'high', screenReader: true, largeButtons: true },
        audio: { volume: 80, speechSpeed: 100, audioDescriptions: true },
        motor: { gestureSensitivity: 5, dwellTime: 1000 },
        cognitive: { complexity: 'simple', simplifiedLanguage: true }
      }
    },
    {
      id: 'hearing-impairment',
      name: currentLanguage === 'hi' ? 'श्रवण हानि' : 'Hearing Impairment',
      description: currentLanguage === 'hi' ? 'दृश्य संकेत, कंपन, उपशीर्षक' : 'Visual cues, vibration, captions',
      icon: 'Ear',
      settings: {
        visual: { focusIndicators: true, visualCues: true },
        audio: { volume: 0, soundEffects: false },
        motor: { vibration: true },
        cognitive: { visualCues: true, preferImages: true }
      }
    },
    {
      id: 'motor-impairment',
      name: currentLanguage === 'hi' ? 'मोटर हानि' : 'Motor Impairment',
      description: currentLanguage === 'hi' ? 'आवाज़ नियंत्रण, बड़े बटन, ड्वेल क्लिक' : 'Voice control, large buttons, dwell click',
      icon: 'Hand',
      settings: {
        visual: { largeButtons: true, fontSize: 18 },
        audio: { voiceCommands: true },
        motor: { clickAssistance: 'dwell', dwellTime: 1500, stickyKeys: true },
        cognitive: { taskBreakdown: true }
      }
    },
    {
      id: 'cognitive-support',
      name: currentLanguage === 'hi' ? 'संज्ञानात्मक सहायता' : 'Cognitive Support',
      description: currentLanguage === 'hi' ? 'सरल इंटरफेस, स्मृति सहायक, प्रगति संकेतक' : 'Simple interface, memory aids, progress indicators',
      icon: 'Brain',
      settings: {
        visual: { fontSize: 16, animations: false },
        cognitive: { 
          complexity: 'simple', 
          simplifiedLanguage: true, 
          memoryAids: true, 
          progressIndicators: true,
          taskBreakdown: true,
          reminderFrequency: 'high'
        }
      }
    }
  ];

  const customProfiles = [
    {
      id: 'custom-1',
      name: currentLanguage === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile',
      description: currentLanguage === 'hi' ? 'व्यक्तिगत कस्टम सेटिंग्स' : 'Personal custom settings',
      icon: 'User',
      isCustom: true
    }
  ];

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile.id);
    if (profile.settings) {
      onSettingsChange({
        ...settings,
        ...profile.settings
      });
    }
  };

  const createNewProfile = () => {
    if (newProfileName.trim()) {
      const newProfile = {
        id: `custom-${Date.now()}`,
        name: newProfileName,
        description: currentLanguage === 'hi' ? 'कस्टम प्रोफ़ाइल' : 'Custom profile',
        icon: 'User',
        isCustom: true,
        settings: { ...settings }
      };
      
      // In a real app, this would save to backend/localStorage
      setNewProfileName('');
      setShowCreateProfile(false);
      alert(currentLanguage === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक बनाई गई!' : 'Profile created successfully!');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'accessibility-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          onSettingsChange(importedSettings);
          alert(currentLanguage === 'hi' ? 'सेटिंग्स सफलतापूर्वक आयात की गईं!' : 'Settings imported successfully!');
        } catch (error) {
          alert(currentLanguage === 'hi' ? 'अमान्य फ़ाइल प्रारूप!' : 'Invalid file format!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Users" size={24} className="text-indigo-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              {currentLanguage === 'hi' ? 'प्रोफ़ाइल प्रबंधन' : 'Profile Management'}
            </h3>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateProfile(true)}
          >
            <Icon name="Plus" size={16} />
            <span className="ml-2">
              {currentLanguage === 'hi' ? 'नई प्रोफ़ाइल' : 'New Profile'}
            </span>
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Preset Profiles */}
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-gray-900">
            {currentLanguage === 'hi' ? 'प्रीसेट प्रोफ़ाइल' : 'Preset Profiles'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {presetProfiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleProfileSelect(profile)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedProfile === profile.id
                    ? 'border-indigo-500 bg-indigo-50' :'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={profile.icon} 
                    size={20} 
                    className={selectedProfile === profile.id ? 'text-indigo-600' : 'text-gray-500'}
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{profile.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
                  </div>
                  {selectedProfile === profile.id && (
                    <Icon name="Check" size={16} className="text-indigo-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Profiles */}
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-gray-900">
            {currentLanguage === 'hi' ? 'कस्टम प्रोफ़ाइल' : 'Custom Profiles'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customProfiles.map((profile) => (
              <div
                key={profile.id}
                className={`p-4 rounded-lg border-2 ${
                  selectedProfile === profile.id
                    ? 'border-indigo-500 bg-indigo-50' :'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Icon 
                      name={profile.icon} 
                      size={20} 
                      className={selectedProfile === profile.id ? 'text-indigo-600' : 'text-gray-500'}
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{profile.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      onClick={() => handleProfileSelect(profile)}
                      className="text-sm"
                    >
                      {currentLanguage === 'hi' ? 'चुनें' : 'Select'}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create New Profile Modal */}
        {showCreateProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {currentLanguage === 'hi' ? 'नई प्रोफ़ाइल बनाएं' : 'Create New Profile'}
              </h4>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder={currentLanguage === 'hi' ? 'प्रोफ़ाइल नाम' : 'Profile Name'}
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                />
                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    onClick={createNewProfile}
                    className="flex-1"
                  >
                    {currentLanguage === 'hi' ? 'बनाएं' : 'Create'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateProfile(false)}
                    className="flex-1"
                  >
                    {currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import/Export */}
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-gray-900">
            {currentLanguage === 'hi' ? 'सेटिंग्स बैकअप' : 'Settings Backup'}
          </h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={exportSettings}
              className="flex-1"
            >
              <Icon name="Download" size={16} />
              <span className="ml-2">
                {currentLanguage === 'hi' ? 'सेटिंग्स निर्यात करें' : 'Export Settings'}
              </span>
            </Button>
            <label className="flex-1">
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                as="span"
              >
                <Icon name="Upload" size={16} />
                <span className="ml-2">
                  {currentLanguage === 'hi' ? 'सेटिंग्स आयात करें' : 'Import Settings'}
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;