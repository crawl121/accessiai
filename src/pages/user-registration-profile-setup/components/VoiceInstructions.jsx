import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceInstructions = ({ currentLanguage, isActive, speechSynthesis }) => {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check if voice is enabled
    const voiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    setIsVoiceEnabled(voiceEnabled);

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [currentLanguage]);

  const handleVoiceCommand = (command) => {
    const commands = {
      en: {
        'help': () => speakInstructions(),
        'instructions': () => speakInstructions(),
        'next': () => document.querySelector('[data-voice="next"]')?.click(),
        'previous': () => document.querySelector('[data-voice="previous"]')?.click(),
        'submit': () => document.querySelector('[data-voice="submit"]')?.click(),
        'first name': () => document.getElementById('firstName')?.focus(),
        'last name': () => document.getElementById('lastName')?.focus(),
        'email': () => document.getElementById('email')?.focus(),
        'password': () => document.getElementById('password')?.focus(),
        'visual': () => document.querySelector('[data-voice="visual"]')?.click(),
        'hearing': () => document.querySelector('[data-voice="hearing"]')?.click(),
        'motor': () => document.querySelector('[data-voice="motor"]')?.click(),
        'cognitive': () => document.querySelector('[data-voice="cognitive"]')?.click()
      },
      hi: {
        'मदद': () => speakInstructions(),
        'निर्देश': () => speakInstructions(),
        'अगला': () => document.querySelector('[data-voice="next"]')?.click(),
        'पिछला': () => document.querySelector('[data-voice="previous"]')?.click(),
        'जमा करें': () => document.querySelector('[data-voice="submit"]')?.click(),
        'पहला नाम': () => document.getElementById('firstName')?.focus(),
        'अंतिम नाम': () => document.getElementById('lastName')?.focus(),
        'ईमेल': () => document.getElementById('email')?.focus(),
        'पासवर्ड': () => document.getElementById('password')?.focus(),
        'दृष्टि': () => document.querySelector('[data-voice="visual"]')?.click(),
        'श्रवण': () => document.querySelector('[data-voice="hearing"]')?.click(),
        'गतिशीलता': () => document.querySelector('[data-voice="motor"]')?.click(),
        'संज्ञानात्मक': () => document.querySelector('[data-voice="cognitive"]')?.click()
      }
    };

    const languageCommands = commands[currentLanguage] || commands.en;

    for (const [trigger, action] of Object.entries(languageCommands)) {
      if (command.includes(trigger)) {
        action();
        break;
      }
    }
  };

  const speakInstructions = () => {
    if (!('speechSynthesis' in window)) return;

    const instructions = currentLanguage === 'hi' ?
    `AccessiAI पंजीकरण में आपका स्वागत है। आप आवाज कमांड का उपयोग कर सकते हैं। कहें "पहला नाम" फील्ड पर जाने के लिए, "अगला" अगले चरण के लिए, "मदद" निर्देशों के लिए। दृष्टि, श्रवण, गतिशीलता, या संज्ञानात्मक कहकर पहुंच विकल्प चुनें।` : `Welcome to AccessiAI registration. You can use voice commands. Say"first name" to go to the field, "next" for next step, "help" for instructions. Choose accessibility options by saying visual, hearing, motor, or cognitive.`;

    const utterance = new SpeechSynthesisUtterance(instructions);
    utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const toggleVoiceEnabled = () => {
    const newState = !isVoiceEnabled;
    setIsVoiceEnabled(newState);
    localStorage.setItem('accessibility-voice', newState.toString());

    if (newState) {
      speakInstructions();
    }
  };

  if (!isActive) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <Icon name="Volume2" size={20} className="text-blue-600 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">
            {currentLanguage === 'hi' ? 'आवाज सहायता' : 'Voice Assistance'}
          </h3>
          <p className="text-sm text-blue-800 mb-4">
            {currentLanguage === 'hi' ? 'आवाज कमांड का उपयोग करके फॉर्म भरें और नेविगेट करें।' : 'Use voice commands to fill forms and navigate.'
            }
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={isVoiceEnabled ? 'primary' : 'ghost'}
                size="sm"
                onClick={toggleVoiceEnabled}
                className="touch-target">

                <Icon name={isVoiceEnabled ? 'Volume2' : 'VolumeX'} size={16} />
                <span className="ml-1">
                  {isVoiceEnabled ?
                  currentLanguage === 'hi' ? 'चालू' : 'On' :
                  currentLanguage === 'hi' ? 'बंद' : 'Off'
                  }
                </span>
              </Button>

              {isVoiceEnabled &&
              <Button
                variant={isListening ? 'danger' : 'secondary'}
                size="sm"
                onClick={toggleListening}
                className="touch-target"
                disabled={!recognition}>

                  <Icon name={isListening ? 'MicOff' : 'Mic'} size={16} />
                  <span className="ml-1">
                    {isListening ?
                  currentLanguage === 'hi' ? 'सुन रहा है' : 'Listening' :
                  currentLanguage === 'hi' ? 'सुनना शुरू करें' : 'Start Listening'
                  }
                  </span>
                </Button>
              }

              <Button
                variant="ghost"
                size="sm"
                onClick={speakInstructions}
                className="touch-target">

                <Icon name="HelpCircle" size={16} />
                <span className="ml-1">
                  {currentLanguage === 'hi' ? 'निर्देश' : 'Instructions'}
                </span>
              </Button>
            </div>
          </div>

          {/* Voice commands list */}
          <div className="bg-white rounded-md p-3 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2 text-sm">
              {currentLanguage === 'hi' ? 'आवाज कमांड:' : 'Voice Commands:'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-800">
              <div>
                <span className="font-medium">
                  {currentLanguage === 'hi' ? 'नेविगेशन:' : 'Navigation:'}
                </span>
                <ul className="ml-2 space-y-1">
                  <li>"{currentLanguage === 'hi' ? 'अगला' : 'Next'}"</li>
                  <li>"{currentLanguage === 'hi' ? 'पिछला' : 'Previous'}"</li>
                  <li>"{currentLanguage === 'hi' ? 'मदद' : 'Help'}"</li>
                </ul>
              </div>
              <div>
                <span className="font-medium">
                  {currentLanguage === 'hi' ? 'फील्ड:' : 'Fields:'}
                </span>
                <ul className="ml-2 space-y-1">
                  <li>"{currentLanguage === 'hi' ? 'पहला नाम' : 'First name'}"</li>
                  <li>"{currentLanguage === 'hi' ? 'ईमेल' : 'Email'}"</li>
                  <li>"{currentLanguage === 'hi' ? 'पासवर्ड' : 'Password'}"</li>
                </ul>
              </div>
            </div>
          </div>

          {isListening &&
          <div className="mt-3 flex items-center space-x-2 text-sm text-blue-700">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>
                {currentLanguage === 'hi' ? 'आवाज सुन रहा है...' : 'Listening for voice commands...'}
              </span>
            </div>
          }
        </div>
      </div>
    </div>);

};

export default VoiceInstructions;