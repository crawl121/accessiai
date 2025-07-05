import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AccessibilityToolbar from '../../components/ui/AccessibilityToolbar';
import MainNavigation from '../../components/ui/MainNavigation';
import EmergencyAccessPanel from '../../components/ui/EmergencyAccessPanel';

// Import page-specific components
import RecordingButton from './components/RecordingButton';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import LanguageSelector from './components/LanguageSelector';
import SettingsPanel from './components/SettingsPanel';
import ExportPanel from './components/ExportPanel';

const VoiceToTextConversionStudio = () => {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  
  // Settings states
  const [fontSize, setFontSize] = useState(16);
  const [noiseReduction, setNoiseReduction] = useState('medium');
  const [autoSave, setAutoSave] = useState(true);
  
  // Panel states
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(true);
  const [isExportCollapsed, setIsExportCollapsed] = useState(true);
  
  // Speech recognition
  const recognitionRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Load saved settings
    const savedFontSize = localStorage.getItem('voice-studio-font-size');
    const savedNoiseReduction = localStorage.getItem('voice-studio-noise-reduction');
    const savedAutoSave = localStorage.getItem('voice-studio-auto-save');
    
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedNoiseReduction) setNoiseReduction(savedNoiseReduction);
    if (savedAutoSave) setAutoSave(savedAutoSave === 'true');

    // Check speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscriptionText(prev => prev + finalTranscript + ' ');
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsProcessing(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsProcessing(false);
      };
    }

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, [selectedLanguage]);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem('voice-studio-font-size', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('voice-studio-noise-reduction', noiseReduction);
  }, [noiseReduction]);

  useEffect(() => {
    localStorage.setItem('voice-studio-auto-save', autoSave.toString());
  }, [autoSave]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && transcriptionText.trim()) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('voice-studio-auto-saved-text', transcriptionText);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [transcriptionText, autoSave]);

  const handleStartRecording = () => {
    if (!isSupported) {
      alert(currentLanguage === 'hi' ?'आपका ब्राउज़र वॉइस रिकग्निशन को सपोर्ट नहीं करता' :'Your browser does not support speech recognition'
      );
      return;
    }

    setIsRecording(true);
    setIsProcessing(true);
    
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
    }

    // Voice feedback if enabled
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const message = currentLanguage === 'hi' ? 'रिकॉर्डिंग शुरू' : 'Recording started';
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Voice feedback if enabled
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const message = currentLanguage === 'hi' ? 'रिकॉर्डिंग रुकी' : 'Recording stopped';
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }
  };

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    if (recognitionRef.current) {
      recognitionRef.current.lang = langCode;
    }
  };

  const handleTextEdit = (newText) => {
    setTranscriptionText(newText);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />

      {/* Main Navigation */}
      <MainNavigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {/* Main Content */}
      <main 
        id="main-content"
        className="lg:ml-64 pt-16"
        role="main"
        aria-label="Voice to Text Conversion Studio"
      >
        {/* Header */}
        <header className="bg-surface border-b border-border shadow-sm">
          <div className="px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsNavOpen(true)}
                  aria-label="Open navigation menu"
                  className="lg:hidden touch-target"
                >
                  <Icon name="Menu" size={20} />
                </Button>
                
                <div>
                  <h1 className="text-2xl font-heading font-bold text-text-primary">
                    {currentLanguage === 'hi' ?'वॉइस टू टेक्स्ट स्टूडियो' :'Voice-to-Text Conversion Studio'
                    }
                  </h1>
                  <p className="text-text-secondary mt-1">
                    {currentLanguage === 'hi' ?'अपनी आवाज़ को टेक्स्ट में बदलें' :'Convert your voice to text with AI-powered recognition'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/accessible-dashboard-control-center')}
                  className="touch-target"
                >
                  <Icon name="ArrowLeft" size={16} />
                  <span className="hidden sm:inline ml-2">
                    {currentLanguage === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Browser Support Check */}
            {!isSupported && (
              <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-warning-800 mb-1">
                      {currentLanguage === 'hi' ?'ब्राउज़र सपोर्ट की आवश्यकता' :'Browser Support Required'
                      }
                    </h3>
                    <p className="text-sm text-warning-700">
                      {currentLanguage === 'hi' ?'वॉइस रिकग्निशन के लिए कृपया Chrome, Edge, या Safari का उपयोग करें।' :'Please use Chrome, Edge, or Safari for voice recognition functionality.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Recording Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recording Controls */}
                <div className="bg-surface rounded-lg border border-border shadow-sm p-8">
                  <RecordingButton
                    isRecording={isRecording}
                    onStartRecording={handleStartRecording}
                    onStopRecording={handleStopRecording}
                    isProcessing={isProcessing}
                    currentLanguage={currentLanguage}
                  />
                </div>

                {/* Transcription Display */}
                <TranscriptionDisplay
                  transcriptionText={transcriptionText}
                  isRecording={isRecording}
                  onTextEdit={handleTextEdit}
                  fontSize={fontSize}
                  currentLanguage={currentLanguage}
                />
              </div>

              {/* Sidebar Controls */}
              <div className="space-y-6">
                {/* Language Selector */}
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  currentLanguage={currentLanguage}
                />

                {/* Settings Panel */}
                <SettingsPanel
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  noiseReduction={noiseReduction}
                  onNoiseReductionChange={setNoiseReduction}
                  autoSave={autoSave}
                  onAutoSaveChange={setAutoSave}
                  currentLanguage={currentLanguage}
                  isCollapsed={isSettingsCollapsed}
                  onToggleCollapse={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
                />

                {/* Export Panel */}
                <ExportPanel
                  transcriptionText={transcriptionText}
                  currentLanguage={currentLanguage}
                  isCollapsed={isExportCollapsed}
                  onToggleCollapse={() => setIsExportCollapsed(!isExportCollapsed)}
                />
              </div>
            </div>

            {/* Keyboard Shortcuts Info */}
            <div className="mt-8 p-4 bg-surface-secondary rounded-lg border border-border">
              <div className="flex items-start space-x-3">
                <Icon name="Keyboard" size={20} className="text-text-secondary mt-0.5" />
                <div>
                  <h3 className="font-medium text-text-primary mb-2">
                    {currentLanguage === 'hi' ? 'कीबोर्ड शॉर्टकट्स' : 'Keyboard Shortcuts'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
                    <div>
                      <kbd className="px-2 py-1 bg-surface border border-border rounded text-xs">Space</kbd>
                      <span className="ml-2">
                        {currentLanguage === 'hi' ? 'रिकॉर्डिंग टॉगल करें' : 'Toggle recording'}
                      </span>
                    </div>
                    <div>
                      <kbd className="px-2 py-1 bg-surface border border-border rounded text-xs">Ctrl+S</kbd>
                      <span className="ml-2">
                        {currentLanguage === 'hi' ? 'टेक्स्ट सेव करें' : 'Save text'}
                      </span>
                    </div>
                    <div>
                      <kbd className="px-2 py-1 bg-surface border border-border rounded text-xs">Ctrl+C</kbd>
                      <span className="ml-2">
                        {currentLanguage === 'hi' ? 'टेक्स्ट कॉपी करें' : 'Copy text'}
                      </span>
                    </div>
                    <div>
                      <kbd className="px-2 py-1 bg-surface border border-border rounded text-xs">Esc</kbd>
                      <span className="ml-2">
                        {currentLanguage === 'hi' ? 'रिकॉर्डिंग रोकें' : 'Stop recording'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Emergency Access Panel */}
      <EmergencyAccessPanel />
    </div>
  );
};

export default VoiceToTextConversionStudio;