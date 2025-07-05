import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecordingButton = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  isProcessing,
  currentLanguage 
}) => {
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    if (isRecording) {
      setPulseAnimation(true);
      const interval = setInterval(() => {
        setPulseAnimation(prev => !prev);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setPulseAnimation(false);
    }
  }, [isRecording]);

  const handleClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  const getButtonText = () => {
    if (isProcessing) {
      return currentLanguage === 'hi' ? 'प्रोसेसिंग...' : 'Processing...';
    }
    if (isRecording) {
      return currentLanguage === 'hi' ? 'रिकॉर्डिंग रोकें' : 'Stop Recording';
    }
    return currentLanguage === 'hi' ? 'रिकॉर्डिंग शुरू करें' : 'Start Recording';
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Recording Button */}
      <div className="relative">
        {/* Pulse rings for recording state */}
        {isRecording && (
          <>
            <div className={`absolute inset-0 rounded-full bg-accent-500 opacity-30 ${pulseAnimation ? 'animate-ping' : ''}`} />
            <div className="absolute inset-0 rounded-full bg-accent-500 opacity-20 animate-pulse" />
          </>
        )}
        
        <Button
          variant={isRecording ? "accent" : "primary"}
          onClick={handleClick}
          disabled={isProcessing}
          className={`
            w-32 h-32 rounded-full shadow-xl hover:shadow-2xl
            transition-all duration-300 ease-out
            ${isRecording ? 'bg-accent-600 hover:bg-accent-700' : ''}
            ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}
          `}
          aria-label={getButtonText()}
          aria-pressed={isRecording}
        >
          {isProcessing ? (
            <div className="animate-spin">
              <Icon name="Loader2" size={48} className="text-white" />
            </div>
          ) : (
            <Icon 
              name={isRecording ? "Square" : "Mic"} 
              size={48} 
              className="text-white"
            />
          )}
        </Button>
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-lg font-medium text-text-primary mb-2">
          {getButtonText()}
        </p>
        
        {isRecording && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            <span className="text-sm text-text-secondary">
              {currentLanguage === 'hi' ? 'सुन रहा है...' : 'Listening...'}
            </span>
          </div>
        )}
      </div>

      {/* Recording Instructions */}
      <div className="text-center max-w-md">
        <p className="text-sm text-text-secondary leading-relaxed">
          {currentLanguage === 'hi' ?'स्पष्ट रूप से बोलें। रिकॉर्डिंग शुरू करने के लिए बटन दबाएं।' :'Speak clearly and at a normal pace. Press the button to start recording.'
          }
        </p>
      </div>
    </div>
  );
};

export default RecordingButton;