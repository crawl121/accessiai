import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecognitionDisplay = ({ 
  recognizedText, 
  confidence, 
  isProcessing,
  onClearText,
  onSaveText,
  onTextToSpeech 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [savedTexts, setSavedTexts] = useState([]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const mockRecognitionHistory = [
    {
      id: 1,
      text: currentLanguage === 'hi' ? "नमस्ते, आप कैसे हैं?" : "Hello, how are you?",
      timestamp: new Date(Date.now() - 300000),
      confidence: 0.95
    },
    {
      id: 2,
      text: currentLanguage === 'hi' ? "मुझे मदद चाहिए" : "I need help",
      timestamp: new Date(Date.now() - 600000),
      confidence: 0.88
    },
    {
      id: 3,
      text: currentLanguage === 'hi' ? "धन्यवाद" : "Thank you",
      timestamp: new Date(Date.now() - 900000),
      confidence: 0.92
    }
  ];

  const getConfidenceColor = (conf) => {
    if (conf >= 0.9) return 'text-success';
    if (conf >= 0.7) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceLabel = (conf) => {
    if (conf >= 0.9) return currentLanguage === 'hi' ? 'उच्च' : 'High';
    if (conf >= 0.7) return currentLanguage === 'hi' ? 'मध्यम' : 'Medium';
    return currentLanguage === 'hi' ? 'कम' : 'Low';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-lg">
      {/* Header */}
      <div className="bg-surface-secondary px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="MessageSquare" size={24} className="text-primary" />
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              {currentLanguage === 'hi' ? 'पहचाना गया टेक्स्ट' : 'Recognized Text'}
            </h3>
          </div>
          
          {confidence > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">
                {currentLanguage === 'hi' ? 'विश्वसनीयता:' : 'Confidence:'}
              </span>
              <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                {Math.round(confidence * 100)}% ({getConfidenceLabel(confidence)})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Current Recognition */}
      <div className="p-6">
        <div className="bg-surface-secondary rounded-lg p-4 min-h-[120px] border border-border">
          {isProcessing ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                <span className="text-text-secondary">
                  {currentLanguage === 'hi' ? 'साइन पहचान रहे हैं...' : 'Recognizing signs...'}
                </span>
              </div>
            </div>
          ) : recognizedText ? (
            <div className="space-y-3">
              <p className="text-lg text-text-primary leading-relaxed">
                {recognizedText}
              </p>
              {confidence > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        confidence >= 0.9 ? 'bg-success' : 
                        confidence >= 0.7 ? 'bg-warning' : 'bg-error'
                      }`}
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-text-secondary">
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-text-secondary">
              <div className="text-center">
                <Icon name="Hand" size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {currentLanguage === 'hi' ?'साइन लैंग्वेज दिखाना शुरू करें' :'Start showing sign language'
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {recognizedText && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="primary"
                onClick={onTextToSpeech}
                iconName="Volume2"
                className="touch-target"
              >
                {currentLanguage === 'hi' ? 'बोलें' : 'Speak'}
              </Button>
              
              <Button
                variant="secondary"
                onClick={onSaveText}
                iconName="Save"
                className="touch-target"
              >
                {currentLanguage === 'hi' ? 'सेव करें' : 'Save'}
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={onClearText}
              iconName="Trash2"
              className="touch-target"
            >
              {currentLanguage === 'hi' ? 'साफ़ करें' : 'Clear'}
            </Button>
          </div>
        )}
      </div>

      {/* Recognition History */}
      <div className="border-t border-border">
        <div className="px-6 py-4">
          <h4 className="text-md font-heading font-semibold text-text-primary mb-4">
            {currentLanguage === 'hi' ? 'हाल की पहचान' : 'Recent Recognition'}
          </h4>
          
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {mockRecognitionHistory.map((item) => (
              <div 
                key={item.id}
                className="flex items-start justify-between p-3 bg-surface-secondary rounded-lg border border-border hover:bg-surface transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">
                    {item.text}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-text-secondary">
                      {formatTime(item.timestamp)}
                    </span>
                    <span className={`text-xs ${getConfidenceColor(item.confidence)}`}>
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTextToSpeech(item.text)}
                    iconName="Volume2"
                    className="touch-target"
                    aria-label={currentLanguage === 'hi' ? 'बोलें' : 'Speak text'}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSaveText(item.text)}
                    iconName="Copy"
                    className="touch-target"
                    aria-label={currentLanguage === 'hi' ? 'कॉपी करें' : 'Copy text'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecognitionDisplay;