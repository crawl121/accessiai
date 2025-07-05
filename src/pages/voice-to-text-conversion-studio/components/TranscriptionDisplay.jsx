import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TranscriptionDisplay = ({
  transcriptionText,
  isRecording,
  onTextEdit,
  fontSize,
  currentLanguage, speechSynthesis
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const textareaRef = useRef(null);
  const displayRef = useRef(null);

  useEffect(() => {
    setEditText(transcriptionText);
  }, [transcriptionText]);

  useEffect(() => {
    if (isRecording && displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [transcriptionText, isRecording]);

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(editText.length, editText.length);
      }
    }, 100);
  };

  const handleSave = () => {
    onTextEdit(editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(transcriptionText);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcriptionText);
      // Voice feedback if enabled
      const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const message = currentLanguage === 'hi' ? 'टेक्स्ट कॉपी किया गया' : 'Text copied to clipboard';
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearText = () => {
    onTextEdit('');
    setEditText('');
    setIsEditing(false);
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-lg text-text-primary">
            {currentLanguage === 'hi' ? 'ट्रांसक्रिप्शन' : 'Transcription'}
          </h3>
          {isRecording &&
          <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
              <span className="text-sm text-accent-600 font-medium">
                {currentLanguage === 'hi' ? 'लाइव' : 'Live'}
              </span>
            </div>
          }
        </div>

        <div className="flex items-center space-x-2">
          {!isEditing && transcriptionText &&
          <>
              <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              aria-label={currentLanguage === 'hi' ? 'टेक्स्ट कॉपी करें' : 'Copy text'}
              className="touch-target">

                <Icon name="Copy" size={16} />
              </Button>
              
              <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              aria-label={currentLanguage === 'hi' ? 'टेक्स्ट एडिट करें' : 'Edit text'}
              className="touch-target">

                <Icon name="Edit3" size={16} />
              </Button>
              
              <Button
              variant="ghost"
              size="sm"
              onClick={clearText}
              aria-label={currentLanguage === 'hi' ? 'टेक्स्ट साफ़ करें' : 'Clear text'}
              className="touch-target">

                <Icon name="Trash2" size={16} />
              </Button>
            </>
          }

          {isEditing &&
          <>
              <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              aria-label={currentLanguage === 'hi' ? 'सेव करें' : 'Save changes'}
              className="touch-target">

                <Icon name="Check" size={16} />
              </Button>
              
              <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              aria-label={currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel editing'}
              className="touch-target">

                <Icon name="X" size={16} />
              </Button>
            </>
          }
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ?
        <div className="space-y-3">
            <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`
                w-full min-h-[200px] p-4 rounded-lg border border-border
                bg-surface-secondary text-text-primary
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                resize-none
              `}
            style={{ fontSize: `${fontSize}px` }}
            placeholder={currentLanguage === 'hi' ? 'यहाँ टेक्स्ट एडिट करें...' : 'Edit your text here...'}
            aria-label={currentLanguage === 'hi' ? 'ट्रांसक्रिप्शन टेक्स्ट एडिट करें' : 'Edit transcription text'} />

            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>
                {currentLanguage === 'hi' ? 'Ctrl+Enter से सेव करें, Escape से रद्द करें' : 'Ctrl+Enter to save, Escape to cancel'
              }
              </span>
              <span>{editText.length} characters</span>
            </div>
          </div> :

        <div
          ref={displayRef}
          className={`
              min-h-[200px] max-h-[400px] overflow-y-auto p-4 rounded-lg
              bg-surface-secondary border border-border
              ${transcriptionText ? 'text-text-primary' : 'text-text-secondary'}
            `}
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
          aria-live="polite"
          aria-label={currentLanguage === 'hi' ? 'ट्रांसक्रिप्शन टेक्स्ट' : 'Transcription text'}>

            {transcriptionText ||
          <span className="italic">
                {currentLanguage === 'hi' ? 'रिकॉर्डिंग शुरू करने के लिए माइक बटन दबाएं...' : 'Press the microphone button to start recording...'
            }
              </span>
          }
          </div>
        }
      </div>

      {/* Word Count */}
      {transcriptionText &&
      <div className="px-4 pb-4">
          <div className="text-sm text-text-secondary">
            {currentLanguage === 'hi' ? 'शब्द संख्या: ' : 'Word count: '}
            <span className="font-medium">
              {transcriptionText.trim().split(/\s+/).filter((word) => word.length > 0).length}
            </span>
            {' | '}
            {currentLanguage === 'hi' ? 'अक्षर संख्या: ' : 'Character count: '}
            <span className="font-medium">{transcriptionText.length}</span>
          </div>
        </div>
      }
    </div>);

};

export default TranscriptionDisplay;