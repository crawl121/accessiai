import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GestureLoginModal = ({ isOpen, onClose, onGestureLogin, speechSynthesis }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [gesturePattern, setGesturePattern] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const announceToUser = (message) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const startGestureDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsDetecting(true);
        announceToUser(currentLanguage === 'hi' ? 'हाथ के इशारे की पहचान शुरू' : 'Gesture detection started');

        // Simulate gesture detection
        setTimeout(() => {
          const mockGesture = ['wave', 'point', 'thumbs_up'];
          setGesturePattern(mockGesture);
          announceToUser(currentLanguage === 'hi' ? 'हाथ के इशारे पहचाने गए' : 'Gestures detected');
        }, 3000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      announceToUser(currentLanguage === 'hi' ? 'कैमरा एक्सेस त्रुटि' : 'Camera access error');
    }
  };

  const stopGestureDetection = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsDetecting(false);
    announceToUser(currentLanguage === 'hi' ? 'हाथ के इशारे की पहचान बंद' : 'Gesture detection stopped');
  };

  const handleGestureLogin = () => {
    if (gesturePattern.length > 0) {
      onGestureLogin(gesturePattern);
      announceToUser(currentLanguage === 'hi' ? 'हाथ के इशारे से लॉगिन सफल' : 'Gesture login successful');
    }
  };

  useEffect(() => {
    return () => {
      stopGestureDetection();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        role="dialog"
        aria-labelledby="gesture-login-title"
        aria-describedby="gesture-login-description">

        <div className="flex items-center justify-between mb-4">
          <h3
            id="gesture-login-title"
            className="text-xl font-semibold text-gray-900">

            {currentLanguage === 'hi' ? 'हाथ के इशारे से लॉगिन' : 'Gesture Login'}
          </h3>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label={currentLanguage === 'hi' ? 'बंद करें' : 'Close'}>

            <Icon name="X" size={20} />
          </Button>
        </div>

        <p
          id="gesture-login-description"
          className="text-gray-600 mb-6">

          {currentLanguage === 'hi' ? 'कैमरे के सामने अपने हाथ के इशारे दिखाएं।' : 'Show your hand gestures in front of the camera.'
          }
        </p>

        <div className="relative mb-6">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-48 bg-gray-100 rounded-lg object-cover"
            aria-label={currentLanguage === 'hi' ? 'हाथ के इशारे कैमरा फीड' : 'Gesture camera feed'} />

          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: 'none' }} />

          
          {!isDetecting &&
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <Icon name="Camera" size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  {currentLanguage === 'hi' ? 'कैमरा बंद' : 'Camera Off'}
                </p>
              </div>
            </div>
          }
        </div>

        {gesturePattern.length > 0 &&
        <div className="bg-green-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-600 mb-1">
              {currentLanguage === 'hi' ? 'पहचाने गए इशारे:' : 'Detected gestures:'}
            </p>
            <div className="flex space-x-2">
              {gesturePattern.map((gesture, index) =>
            <span
              key={index}
              className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">

                  {gesture}
                </span>
            )}
            </div>
          </div>
        }

        <div className="flex space-x-3 mb-4">
          <Button
            variant={isDetecting ? "danger" : "primary"}
            onClick={isDetecting ? stopGestureDetection : startGestureDetection}
            fullWidth>

            <Icon
              name={isDetecting ? "CameraOff" : "Camera"}
              size={16}
              className="mr-2" />

            {isDetecting ?
            currentLanguage === 'hi' ? 'बंद करें' : 'Stop' :
            currentLanguage === 'hi' ? 'शुरू करें' : 'Start'
            }
          </Button>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            fullWidth>

            {currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            onClick={handleGestureLogin}
            fullWidth
            disabled={gesturePattern.length === 0}>

            {currentLanguage === 'hi' ? 'लॉगिन करें' : 'Login'}
          </Button>
        </div>
      </div>
    </div>);

};

export default GestureLoginModal;