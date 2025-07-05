import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceLoginModal = ({ isOpen, onClose, onVoiceLogin, speechSynthesis }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);

        if (event.results[current].isFinal) {
          handleVoiceCommand(transcriptResult);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        announceToUser(currentLanguage === 'hi' ? 'आवाज पहचान में त्रुटि' : 'Voice recognition error');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [currentLanguage]);

  const announceToUser = (message) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setTranscript('');
      recognition.start();
      announceToUser(currentLanguage === 'hi' ? 'आवाज सुनाई जा रही है' : 'Listening for voice command');
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();

    // Check for login commands
    if (lowerCommand.includes('login') || lowerCommand.includes('sign in') ||
    lowerCommand.includes('लॉगिन') || lowerCommand.includes('साइन इन')) {
      onVoiceLogin(command);
      announceToUser(currentLanguage === 'hi' ? 'आवाज लॉगिन प्रक्रिया शुरू की गई' : 'Voice login initiated');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        role="dialog"
        aria-labelledby="voice-login-title"
        aria-describedby="voice-login-description">

        <div className="flex items-center justify-between mb-4">
          <h3
            id="voice-login-title"
            className="text-xl font-semibold text-gray-900">

            {currentLanguage === 'hi' ? 'आवाज लॉगिन' : 'Voice Login'}
          </h3>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label={currentLanguage === 'hi' ? 'बंद करें' : 'Close'}>

            <Icon name="X" size={20} />
          </Button>
        </div>

        <p
          id="voice-login-description"
          className="text-gray-600 mb-6">

          {currentLanguage === 'hi' ? 'अपनी आवाज का उपयोग करके लॉगिन करने के लिए माइक्रोफोन बटन दबाएं।' : 'Press the microphone button to login using your voice.'
          }
        </p>

        <div className="text-center mb-6">
          <Button
            variant={isListening ? "danger" : "primary"}
            onClick={isListening ? stopListening : startListening}
            className="w-20 h-20 rounded-full"
            aria-label={
            isListening ?
            currentLanguage === 'hi' ? 'सुनना बंद करें' : 'Stop listening' :
            currentLanguage === 'hi' ? 'सुनना शुरू करें' : 'Start listening'
            }>

            <Icon
              name={isListening ? "MicOff" : "Mic"}
              size={32}
              className={isListening ? "animate-pulse" : ""} />

          </Button>
        </div>

        {transcript &&
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">
              {currentLanguage === 'hi' ? 'सुनाई गई आवाज:' : 'Detected speech:'}
            </p>
            <p className="text-gray-900 font-medium">{transcript}</p>
          </div>
        }

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            fullWidth>

            {currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            onClick={() => onVoiceLogin(transcript)}
            fullWidth
            disabled={!transcript}>

            {currentLanguage === 'hi' ? 'लॉगिन करें' : 'Login'}
          </Button>
        </div>
      </div>
    </div>);

};

export default VoiceLoginModal;