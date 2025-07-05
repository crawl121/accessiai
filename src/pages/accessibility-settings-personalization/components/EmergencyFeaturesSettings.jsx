import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EmergencyFeaturesSettings = ({ settings, onSettingsChange, currentLanguage }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [testingEmergency, setTestingEmergency] = useState(false);

  const handleSliderChange = (setting, value) => {
    onSettingsChange({
      ...settings,
      emergency: {
        ...settings.emergency,
        [setting]: value
      }
    });
  };

  const handleToggleChange = (setting) => {
    onSettingsChange({
      ...settings,
      emergency: {
        ...settings.emergency,
        [setting]: !settings.emergency[setting]
      }
    });
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...settings.emergency.emergencyContacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    onSettingsChange({
      ...settings,
      emergency: {
        ...settings.emergency,
        emergencyContacts: updatedContacts
      }
    });
  };

  const addEmergencyContact = () => {
    const newContact = {
      name: '',
      phone: '',
      relationship: ''
    };
    onSettingsChange({
      ...settings,
      emergency: {
        ...settings.emergency,
        emergencyContacts: [...settings.emergency.emergencyContacts, newContact]
      }
    });
  };

  const removeEmergencyContact = (index) => {
    const updatedContacts = settings.emergency.emergencyContacts.filter((_, i) => i !== index);
    onSettingsChange({
      ...settings,
      emergency: {
        ...settings.emergency,
        emergencyContacts: updatedContacts
      }
    });
  };

  const testEmergencyFeature = () => {
    setTestingEmergency(true);
    setTimeout(() => {
      setTestingEmergency(false);
      alert(currentLanguage === 'hi' ? 'आपातकालीन सुविधा परीक्षण पूरा!' : 'Emergency feature test complete!');
    }, 2000);
  };

  const emergencyTriggers = [
    { value: 'triple-tap', label: currentLanguage === 'hi' ? 'तीन बार टैप' : 'Triple Tap' },
    { value: 'voice-command', label: currentLanguage === 'hi' ? 'आवाज़ कमांड' : 'Voice Command' },
    { value: 'gesture', label: currentLanguage === 'hi' ? 'जेस्चर' : 'Gesture' },
    { value: 'button-combo', label: currentLanguage === 'hi' ? 'बटन संयोजन' : 'Button Combination' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          <Icon name="AlertTriangle" size={24} className="text-red-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            {currentLanguage === 'hi' ? 'आपातकालीन सुविधाएं' : 'Emergency Features'}
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
          {/* Emergency Trigger Method */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'आपातकालीन ट्रिगर विधि' : 'Emergency Trigger Method'}
            </label>
            <select
              value={settings.emergency.triggerMethod}
              onChange={(e) => handleSliderChange('triggerMethod', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {emergencyTriggers.map((trigger) => (
                <option key={trigger.value} value={trigger.value}>
                  {trigger.label}
                </option>
              ))}
            </select>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                {currentLanguage === 'hi' ? 'आपातकालीन संपर्क' : 'Emergency Contacts'}
              </label>
              <Button
                variant="outline"
                onClick={addEmergencyContact}
                className="text-sm"
              >
                <Icon name="Plus" size={16} />
                <span className="ml-1">
                  {currentLanguage === 'hi' ? 'जोड़ें' : 'Add'}
                </span>
              </Button>
            </div>
            
            {settings.emergency.emergencyContacts.map((contact, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {currentLanguage === 'hi' ? `संपर्क ${index + 1}` : `Contact ${index + 1}`}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => removeEmergencyContact(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    type="text"
                    placeholder={currentLanguage === 'hi' ? 'नाम' : 'Name'}
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  />
                  <Input
                    type="tel"
                    placeholder={currentLanguage === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                    value={contact.phone}
                    onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder={currentLanguage === 'hi' ? 'रिश्ता' : 'Relationship'}
                    value={contact.relationship}
                    onChange={(e) => handleContactChange(index, 'relationship', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Message */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'आपातकालीन संदेश' : 'Emergency Message'}
            </label>
            <textarea
              value={settings.emergency.emergencyMessage}
              onChange={(e) => handleSliderChange('emergencyMessage', e.target.value)}
              placeholder={currentLanguage === 'hi' ?'यह एक आपातकालीन संदेश है। मुझे सहायता की आवश्यकता है।' :'This is an emergency message. I need assistance.'
              }
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Emergency Features */}
          <div className="space-y-4">
            {[
              { key: 'autoLocation', label: currentLanguage === 'hi' ? 'स्वचालित स्थान साझाकरण' : 'Auto Location Sharing' },
              { key: 'flashlight', label: currentLanguage === 'hi' ? 'फ्लैशलाइट सक्रिय करें' : 'Activate Flashlight' },
              { key: 'loudAlarm', label: currentLanguage === 'hi' ? 'तेज़ अलार्म' : 'Loud Alarm' },
              { key: 'screenFlash', label: currentLanguage === 'hi' ? 'स्क्रीन फ्लैश' : 'Screen Flash' },
              { key: 'vibration', label: currentLanguage === 'hi' ? 'कंपन' : 'Vibration' }
            ].map((option) => (
              <div key={option.key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {option.label}
                </label>
                <button
                  onClick={() => handleToggleChange(option.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.emergency[option.key] ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                  aria-pressed={settings.emergency[option.key]}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.emergency[option.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Medical Information */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'चिकित्सा जानकारी' : 'Medical Information'}
            </label>
            <textarea
              value={settings.emergency.medicalInfo}
              onChange={(e) => handleSliderChange('medicalInfo', e.target.value)}
              placeholder={currentLanguage === 'hi' ?'एलर्जी, दवाएं, चिकित्सा स्थितियां...' :'Allergies, medications, medical conditions...'
              }
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Test Emergency Feature */}
          <Button
            variant={testingEmergency ? "success" : "danger"}
            onClick={testEmergencyFeature}
            disabled={testingEmergency}
            className="w-full"
          >
            <Icon name={testingEmergency ? "Loader" : "AlertTriangle"} size={16} />
            <span className="ml-2">
              {testingEmergency 
                ? (currentLanguage === 'hi' ? 'परीक्षण चल रहा है...' : 'Testing Emergency...')
                : (currentLanguage === 'hi' ? 'आपातकालीन सुविधा परीक्षण' : 'Test Emergency Feature')
              }
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmergencyFeaturesSettings;