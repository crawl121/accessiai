import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CameraViewport = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  onCameraToggle,
  lightingQuality,
  onCalibrate 
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraError, setcameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    initializeCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setcameraError(null);
    } catch (error) {
      setcameraError(
        currentLanguage === 'hi' ? 'कैमरा एक्सेस नहीं मिल सका' : 'Camera access denied'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getLightingIndicator = () => {
    const indicators = {
      excellent: {
        color: 'text-success',
        bg: 'bg-success-100',
        text: currentLanguage === 'hi' ? 'उत्कृष्ट प्रकाश' : 'Excellent Lighting'
      },
      good: {
        color: 'text-warning',
        bg: 'bg-warning-100',
        text: currentLanguage === 'hi' ? 'अच्छा प्रकाश' : 'Good Lighting'
      },
      poor: {
        color: 'text-error',
        bg: 'bg-error-100',
        text: currentLanguage === 'hi' ? 'कम प्रकाश' : 'Poor Lighting'
      }
    };
    
    return indicators[lightingQuality] || indicators.good;
  };

  const lightingInfo = getLightingIndicator();

  return (
    <div className="bg-surface rounded-xl border border-border shadow-lg overflow-hidden">
      {/* Camera Header */}
      <div className="bg-surface-secondary px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Camera" size={24} className="text-primary" />
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              {currentLanguage === 'hi' ? 'साइन लैंग्वेज कैमरा' : 'Sign Language Camera'}
            </h3>
          </div>
          
          {/* Lighting Quality Indicator */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${lightingInfo.bg}`}>
            <div className={`w-2 h-2 rounded-full ${lightingInfo.color.replace('text-', 'bg-')}`} />
            <span className={`text-sm font-medium ${lightingInfo.color}`}>
              {lightingInfo.text}
            </span>
          </div>
        </div>
      </div>

      {/* Camera Viewport */}
      <div className="relative bg-gray-900 aspect-video">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-white text-sm">
                {currentLanguage === 'hi' ? 'कैमरा लोड हो रहा है...' : 'Loading camera...'}
              </p>
            </div>
          </div>
        )}

        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center p-6">
              <Icon name="CameraOff" size={48} className="text-error mx-auto mb-4" />
              <p className="text-white text-sm mb-4">{cameraError}</p>
              <Button variant="primary" onClick={initializeCamera}>
                {currentLanguage === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
              </Button>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-error bg-opacity-90 text-white px-3 py-2 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              {currentLanguage === 'hi' ? 'रिकॉर्डिंग' : 'Recording'}
            </span>
          </div>
        )}

        {/* Hand Detection Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-48 border-2 border-primary border-dashed rounded-lg opacity-50" />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            {currentLanguage === 'hi' ? 'हाथों को इस क्षेत्र में रखें' : 'Keep hands in this area'}
          </div>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="bg-surface-secondary px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant={isRecording ? "danger" : "primary"}
              onClick={isRecording ? onStopRecording : onStartRecording}
              iconName={isRecording ? "Square" : "Circle"}
              className="touch-target"
            >
              {isRecording 
                ? (currentLanguage === 'hi' ? 'रोकें' : 'Stop')
                : (currentLanguage === 'hi' ? 'रिकॉर्ड करें' : 'Record')
              }
            </Button>

            <Button
              variant="ghost"
              onClick={onCameraToggle}
              iconName="RotateCcw"
              className="touch-target"
              aria-label={currentLanguage === 'hi' ? 'कैमरा स्विच करें' : 'Switch camera'}
            >
              {currentLanguage === 'hi' ? 'स्विच' : 'Switch'}
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onCalibrate}
              iconName="Target"
              className="touch-target"
            >
              {currentLanguage === 'hi' ? 'कैलिब्रेट करें' : 'Calibrate'}
            </Button>

            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="Zap" size={16} className="text-success" />
              <span>{currentLanguage === 'hi' ? 'लाइव' : 'Live'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraViewport;