import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalibrationModal = ({ isOpen, onClose, onComplete, speechSynthesis }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const calibrationSteps = [
  {
    title: currentLanguage === 'hi' ? 'स्थिति सेटअप' : 'Position Setup',
    description: currentLanguage === 'hi' ? 'कैमरे से 2-3 फीट की दूरी पर बैठें और अपने हाथों को फ्रेम में रखें।' : 'Sit 2-3 feet from the camera and keep your hands within the frame.',
    icon: 'User',
    instruction: currentLanguage === 'hi' ? 'अपने हाथों को कैमरे के सामने रखें' : 'Position your hands in front of the camera'
  },
  {
    title: currentLanguage === 'hi' ? 'हाथ की पहचान' : 'Hand Detection',
    description: currentLanguage === 'hi' ? 'अपने हाथों को धीरे-धीरे हिलाएं ताकि सिस्टम उन्हें पहचान सके।' : 'Move your hands slowly so the system can detect them.',
    icon: 'Hand',
    instruction: currentLanguage === 'hi' ? 'अपने हाथों को धीरे-धीरे हिलाएं' : 'Move your hands slowly'
  },
  {
    title: currentLanguage === 'hi' ? 'बेसिक साइन' : 'Basic Signs',
    description: currentLanguage === 'hi' ? 'कुछ बुनियादी साइन दिखाएं जैसे "हैलो", "धन्यवाद", और "हां"।' : 'Show some basic signs like"Hello", "Thank you", and "Yes".',
    icon: 'MessageCircle',
    instruction: currentLanguage === 'hi' ? '"हैलो" का साइन दिखाएं' : 'Show the"Hello" sign'
  },
  {
    title: currentLanguage === 'hi' ? 'गति कैलिब्रेशन' : 'Speed Calibration',
    description: currentLanguage === 'hi' ? 'अपनी सामान्य साइनिंग गति दिखाएं ताकि सिस्टम इसे समझ सके।' : 'Show your normal signing speed so the system can adapt.',
    icon: 'Zap',
    instruction: currentLanguage === 'hi' ? 'अपनी सामान्य गति से साइन करें' : 'Sign at your normal speed'
  }];


  const startCalibration = async () => {
    setIsCalibrating(true);
    setCalibrationProgress(0);

    // Simulate calibration process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setCalibrationProgress(i);
    }

    setIsCalibrating(false);

    // Voice feedback
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const message = currentLanguage === 'hi' ? 'कैलिब्रेशन पूरी हुई' : 'Calibration completed';
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      onComplete();
      onClose();
    }, 1000);
  };

  const nextStep = () => {
    if (currentStep < calibrationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      startCalibration();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const currentStepData = calibrationSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-surface-secondary px-6 py-4 border-b border-border rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Target" size={24} className="text-primary" />
              <h2 className="text-xl font-heading font-semibold text-text-primary">
                {currentLanguage === 'hi' ? 'साइन कैलिब्रेशन' : 'Sign Calibration'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              className="touch-target"
              aria-label={currentLanguage === 'hi' ? 'बंद करें' : 'Close'} />

          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">
              {currentLanguage === 'hi' ? 'प्रगति' : 'Progress'}
            </span>
            <span className="text-sm font-medium text-text-primary">
              {currentStep + 1} / {calibrationSteps.length}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep + 1) / calibrationSteps.length * 100}%` }} />

          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isCalibrating ?
          <div className="text-center py-8">
              <div className="mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                {currentLanguage === 'hi' ? 'कैलिब्रेशन चल रही है...' : 'Calibrating...'}
              </h3>
              <p className="text-text-secondary mb-4">
                {currentLanguage === 'hi' ? 'कृपया अपनी स्थिति बनाए रखें' : 'Please maintain your position'
              }
              </p>
              <div className="w-full bg-border rounded-full h-3 mb-2">
                <div
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${calibrationProgress}%` }} />

              </div>
              <span className="text-sm text-text-secondary">
                {calibrationProgress}%
              </span>
            </div> :

          <div className="space-y-6">
              {/* Step Icon and Title */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Icon name={currentStepData.icon} size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
                  {currentStepData.title}
                </h3>
                <p className="text-text-secondary max-w-md mx-auto">
                  {currentStepData.description}
                </p>
              </div>

              {/* Visual Instruction */}
              <div className="bg-surface-secondary rounded-lg p-6 border border-border">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                      <Icon name="Info" size={24} className="text-warning" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary mb-1">
                      {currentLanguage === 'hi' ? 'निर्देश:' : 'Instruction:'}
                    </h4>
                    <p className="text-text-secondary">
                      {currentStepData.instruction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Camera Preview Placeholder */}
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <Icon name="Camera" size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">
                    {currentLanguage === 'hi' ? 'कैमरा प्रीव्यू' : 'Camera Preview'}
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Lightbulb" size={20} className="text-success mt-0.5" />
                  <div>
                    <h5 className="font-medium text-success-700 mb-1">
                      {currentLanguage === 'hi' ? 'सुझाव:' : 'Tip:'}
                    </h5>
                    <p className="text-sm text-success-600">
                      {currentStep === 0 && (currentLanguage === 'hi' ? 'अच्छी रोशनी में बैठें और पृष्ठभूमि साफ रखें।' : 'Sit in good lighting and keep the background clear.')}
                      {currentStep === 1 && (currentLanguage === 'hi' ? 'हाथों को कैमरे के फ्रेम के अंदर रखें।' : 'Keep hands within the camera frame.')}
                      {currentStep === 2 && (currentLanguage === 'hi' ? 'साइन स्पष्ट और धीरे-धीरे करें।' : 'Make signs clearly and slowly.')}
                      {currentStep === 3 && (currentLanguage === 'hi' ? 'अपनी सामान्य गति का उपयोग करें।' : 'Use your normal signing speed.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        {/* Footer */}
        {!isCalibrating &&
        <div className="bg-surface-secondary px-6 py-4 border-t border-border rounded-b-xl">
            <div className="flex items-center justify-between">
              <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              iconName="ChevronLeft"
              className="touch-target">

                {currentLanguage === 'hi' ? 'पिछला' : 'Previous'}
              </Button>

              <div className="flex items-center space-x-2">
                {calibrationSteps.map((_, index) =>
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-primary' : 'bg-border'}`
                } />

              )}
              </div>

              <Button
              variant="primary"
              onClick={nextStep}
              iconName={currentStep === calibrationSteps.length - 1 ? "Check" : "ChevronRight"}
              iconPosition="right"
              className="touch-target">

                {currentStep === calibrationSteps.length - 1 ?
              currentLanguage === 'hi' ? 'कैलिब्रेट करें' : 'Calibrate' :
              currentLanguage === 'hi' ? 'अगला' : 'Next'
              }
              </Button>
            </div>
          </div>
        }
      </div>
    </div>);

};

export default CalibrationModal;