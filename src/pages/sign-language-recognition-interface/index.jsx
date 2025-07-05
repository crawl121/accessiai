import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AccessibilityToolbar from '../../components/ui/AccessibilityToolbar';
import MainNavigation from '../../components/ui/MainNavigation';
import EmergencyAccessPanel from '../../components/ui/EmergencyAccessPanel';
import CameraViewport from './components/CameraViewport';
import RecognitionDisplay from './components/RecognitionDisplay';
import LanguageSelector from './components/LanguageSelector';
import CalibrationModal from './components/CalibrationModal';
import EmergencySignPanel from './components/EmergencySignPanel';

const SignLanguageRecognitionInterface = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSignLanguage, setSelectedSignLanguage] = useState('isl');
  const [sensitivity, setSensitivity] = useState(0.5);
  const [lightingQuality, setLightingQuality] = useState('good');
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    signsRecognized: 0,
    accuracy: 0,
    sessionTime: 0
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Mock recognition simulation
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        simulateRecognition();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isRecording, selectedSignLanguage]);

  const simulateRecognition = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const mockTexts = {
        isl: [
          currentLanguage === 'hi' ? "नमस्ते" : "Hello",
          currentLanguage === 'hi' ? "धन्यवाद" : "Thank you",
          currentLanguage === 'hi' ? "कृपया" : "Please",
          currentLanguage === 'hi' ? "मदद" : "Help",
          currentLanguage === 'hi' ? "हां" : "Yes",
          currentLanguage === 'hi' ? "नहीं" : "No"
        ],
        asl: ["Hello", "Thank you", "Please", "Help", "Yes", "No"],
        bsl: ["Hello", "Cheers", "Please", "Help", "Yes", "No"],
        fingerspelling: ["A", "B", "C", "1", "2", "3"]
      };

      const texts = mockTexts[selectedSignLanguage] || mockTexts.isl;
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      const randomConfidence = 0.7 + Math.random() * 0.3;

      setRecognizedText(randomText);
      setConfidence(randomConfidence);
      setIsProcessing(false);

      // Update session stats
      setSessionStats(prev => ({
        ...prev,
        signsRecognized: prev.signsRecognized + 1,
        accuracy: (prev.accuracy + randomConfidence) / 2
      }));

      // Voice feedback if enabled
      const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(randomText);
        speechSynthesis.speak(utterance);
      }
    }, 1500);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecognizedText('');
    setConfidence(0);
    
    // Voice feedback
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const message = currentLanguage === 'hi' ?'साइन पहचान शुरू हुई' :'Sign recognition started';
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(false);
    
    // Voice feedback
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const message = currentLanguage === 'hi' ?'साइन पहचान रुकी' :'Sign recognition stopped';
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }
  };

  const handleCameraToggle = () => {
    // Simulate camera switching
    setLightingQuality(prev => {
      const qualities = ['excellent', 'good', 'poor'];
      const currentIndex = qualities.indexOf(prev);
      return qualities[(currentIndex + 1) % qualities.length];
    });
  };

  const handleCalibrate = () => {
    setIsCalibrationOpen(true);
  };

  const handleCalibrationComplete = () => {
    // Update sensitivity based on calibration
    setSensitivity(0.6);
    setLightingQuality('excellent');
  };

  const handleClearText = () => {
    setRecognizedText('');
    setConfidence(0);
  };

  const handleSaveText = (text = recognizedText) => {
    // Mock save functionality
    const savedTexts = JSON.parse(localStorage.getItem('saved-sign-texts') || '[]');
    savedTexts.push({
      text,
      timestamp: new Date().toISOString(),
      language: selectedSignLanguage,
      confidence
    });
    localStorage.setItem('saved-sign-texts', JSON.stringify(savedTexts));
    
    // Voice feedback
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const message = currentLanguage === 'hi' ? 'टेक्स्ट सेव हुआ' : 'Text saved';
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }
  };

  const handleTextToSpeech = (text = recognizedText) => {
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const handleEmergencySign = (emergency) => {
    setRecognizedText(emergency.sign);
    setConfidence(0.98);
    
    // Auto-save emergency signs
    handleSaveText(emergency.sign);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />

      {/* Main Navigation */}
      <MainNavigation 
        isOpen={isNavOpen} 
        onClose={() => setIsNavOpen(false)} 
      />

      {/* Main Content */}
      <main 
        id="main-content"
        className="lg:ml-64 pt-16"
        role="main"
        aria-label="Sign Language Recognition Interface"
      >
        {/* Header */}
        <header className="bg-surface border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNavOpen(true)}
                iconName="Menu"
                className="lg:hidden touch-target"
                aria-label="Open navigation menu"
              />
              
              <div className="flex items-center space-x-3">
                <Icon name="Hand" size={28} className="text-primary" />
                <div>
                  <h1 className="text-2xl font-heading font-bold text-text-primary">
                    {currentLanguage === 'hi' ?'साइन लैंग्वेज पहचान' :'Sign Language Recognition'
                    }
                  </h1>
                  <p className="text-sm text-text-secondary">
                    {currentLanguage === 'hi' ?'AI-संचालित साइन लैंग्वेज डिटेक्शन और अनुवाद' :'AI-powered sign language detection and translation'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Session Stats */}
              <div className="hidden md:flex items-center space-x-4 text-sm text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Icon name="Target" size={16} />
                  <span>{Math.round(sessionStats.accuracy * 100)}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Hash" size={16} />
                  <span>{sessionStats.signsRecognized}</span>
                </div>
              </div>

              <Button
                variant={showEmergencyPanel ? "danger" : "outline"}
                onClick={() => setShowEmergencyPanel(!showEmergencyPanel)}
                iconName="AlertTriangle"
                className="touch-target"
              >
                {currentLanguage === 'hi' ? 'आपातकाल' : 'Emergency'}
              </Button>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="p-6 space-y-6">
          {/* Emergency Panel */}
          {showEmergencyPanel && (
            <EmergencySignPanel
              onEmergencySign={handleEmergencySign}
              isVisible={showEmergencyPanel}
            />
          )}

          {/* Main Interface Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Camera and Recognition - Left Column */}
            <div className="xl:col-span-2 space-y-6">
              {/* Camera Viewport */}
              <CameraViewport
                isRecording={isRecording}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                onCameraToggle={handleCameraToggle}
                lightingQuality={lightingQuality}
                onCalibrate={handleCalibrate}
              />

              {/* Recognition Display */}
              <RecognitionDisplay
                recognizedText={recognizedText}
                confidence={confidence}
                isProcessing={isProcessing}
                onClearText={handleClearText}
                onSaveText={handleSaveText}
                onTextToSpeech={handleTextToSpeech}
              />
            </div>

            {/* Settings and Controls - Right Column */}
            <div className="space-y-6">
              {/* Language Selector */}
              <LanguageSelector
                selectedLanguage={selectedSignLanguage}
                onLanguageChange={setSelectedSignLanguage}
                sensitivity={sensitivity}
                onSensitivityChange={setSensitivity}
              />

              {/* Quick Stats */}
              <div className="bg-surface rounded-xl border border-border shadow-lg p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  {currentLanguage === 'hi' ? 'सत्र आंकड़े' : 'Session Stats'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">
                      {currentLanguage === 'hi' ? 'पहचाने गए साइन:' : 'Signs Recognized:'}
                    </span>
                    <span className="font-semibold text-text-primary">
                      {sessionStats.signsRecognized}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">
                      {currentLanguage === 'hi' ? 'औसत सटीकता:' : 'Average Accuracy:'}
                    </span>
                    <span className="font-semibold text-text-primary">
                      {Math.round(sessionStats.accuracy * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">
                      {currentLanguage === 'hi' ? 'स्थिति:' : 'Status:'}
                    </span>
                    <span className={`font-semibold ${
                      isRecording ? 'text-success' : 'text-text-secondary'
                    }`}>
                      {isRecording 
                        ? (currentLanguage === 'hi' ? 'सक्रिय' : 'Active')
                        : (currentLanguage === 'hi' ? 'निष्क्रिय' : 'Inactive')
                      }
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/accessible-dashboard-control-center')}
                    iconName="BarChart3"
                    className="touch-target"
                  >
                    {currentLanguage === 'hi' ? 'विस्तृत आंकड़े देखें' : 'View Detailed Stats'}
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-surface rounded-xl border border-border shadow-lg p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  {currentLanguage === 'hi' ? 'त्वरित क्रियाएं' : 'Quick Actions'}
                </h3>
                
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => navigate('/voice-to-text-conversion-studio')}
                    iconName="Mic"
                    className="touch-target"
                  >
                    {currentLanguage === 'hi' ? 'वॉइस टूल्स' : 'Voice Tools'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/accessibility-settings-personalization')}
                    iconName="Settings"
                    className="touch-target"
                  >
                    {currentLanguage === 'hi' ? 'सेटिंग्स' : 'Settings'}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => setIsCalibrationOpen(true)}
                    iconName="Target"
                    className="touch-target"
                  >
                    {currentLanguage === 'hi' ? 'पुनः कैलिब्रेट करें' : 'Recalibrate'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Calibration Modal */}
      <CalibrationModal
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
        onComplete={handleCalibrationComplete}
      />

      {/* Emergency Access Panel */}
      <EmergencyAccessPanel />
    </div>
  );
};

export default SignLanguageRecognitionInterface;