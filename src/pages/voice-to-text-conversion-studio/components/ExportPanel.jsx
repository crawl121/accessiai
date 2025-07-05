import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportPanel = ({
  transcriptionText,
  currentLanguage,
  isCollapsed,
  onToggleCollapse, speechSynthesis
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
  {
    id: 'txt',
    name: currentLanguage === 'hi' ? 'टेक्स्ट फ़ाइल' : 'Text File',
    extension: '.txt',
    icon: 'FileText',
    description: currentLanguage === 'hi' ? 'सादा टेक्स्ट फॉर्मेट' : 'Plain text format'
  },
  {
    id: 'docx',
    name: currentLanguage === 'hi' ? 'वर्ड डॉक्यूमेंट' : 'Word Document',
    extension: '.docx',
    icon: 'FileType',
    description: currentLanguage === 'hi' ? 'माइक्रोसॉफ्ट वर्ड फॉर्मेट' : 'Microsoft Word format'
  },
  {
    id: 'pdf',
    name: currentLanguage === 'hi' ? 'पीडीएफ फ़ाइल' : 'PDF File',
    extension: '.pdf',
    icon: 'FileDown',
    description: currentLanguage === 'hi' ? 'पोर्टेबल डॉक्यूमेंट फॉर्मेट' : 'Portable document format'
  },
  {
    id: 'srt',
    name: currentLanguage === 'hi' ? 'सबटाइटल फ़ाइल' : 'Subtitle File',
    extension: '.srt',
    icon: 'Subtitles',
    description: currentLanguage === 'hi' ? 'वीडियो सबटाइटल फॉर्मेट' : 'Video subtitle format'
  }];


  const handleExport = async (format) => {
    if (!transcriptionText.trim()) {
      alert(currentLanguage === 'hi' ? 'एक्सपोर्ट करने के लिए कोई टेक्स्ट नहीं है' : 'No text to export');
      return;
    }

    setIsExporting(true);

    try {
      let content = transcriptionText;
      let mimeType = 'text/plain';
      let filename = `transcription_${new Date().toISOString().split('T')[0]}`;

      switch (format.id) {
        case 'txt':
          mimeType = 'text/plain';
          filename += '.txt';
          break;
        case 'docx':
          // In a real app, you'd use a library like docx to create proper Word documents
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          filename += '.docx';
          content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Transcription</title></head><body><p>${transcriptionText.replace(/\n/g, '</p><p>')}</p></body></html>`;
          break;
        case 'pdf': // In a real app, you'd use a library like jsPDF
          mimeType = 'application/pdf';
          filename += '.pdf';
          break;
        case 'srt':
          // Convert to SRT format with timestamps
          const lines = transcriptionText.split('\n').filter((line) => line.trim());
          let srtContent = '';
          lines.forEach((line, index) => {
            const startTime = `00:00:${String(index * 5).padStart(2, '0')},000`;
            const endTime = `00:00:${String((index + 1) * 5).padStart(2, '0')},000`;
            srtContent += `${index + 1}\n${startTime} --> ${endTime}\n${line}\n\n`;
          });
          content = srtContent;
          mimeType = 'text/plain';
          filename += '.srt';
          break;
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Voice feedback if enabled
      const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const message = currentLanguage === 'hi' ?
        `${format.name} के रूप में एक्सपोर्ट किया गया` :
        `Exported as ${format.name}`;
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Export failed:', error);
      alert(currentLanguage === 'hi' ? 'एक्सपोर्ट में त्रुटि हुई' : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const shareText = async () => {
    if (!transcriptionText.trim()) {
      alert(currentLanguage === 'hi' ? 'शेयर करने के लिए कोई टेक्स्ट नहीं है' : 'No text to share');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentLanguage === 'hi' ? 'वॉइस ट्रांसक्रिप्शन' : 'Voice Transcription',
          text: transcriptionText
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(transcriptionText);
        alert(currentLanguage === 'hi' ? 'टेक्स्ट क्लिपबोर्ड में कॉपी किया गया' : 'Text copied to clipboard');
      } catch (error) {
        console.error('Copy failed:', error);
      }
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Download" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-lg text-text-primary">
            {currentLanguage === 'hi' ? 'एक्सपोर्ट और शेयर' : 'Export & Share'}
          </h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand export options' : 'Collapse export options'}
          className="lg:hidden touch-target">

          <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
        </Button>
      </div>

      {/* Content */}
      <div className={`${isCollapsed ? 'hidden lg:block' : 'block'}`}>
        <div className="p-4 space-y-4">
          {/* Quick Share */}
          <div>
            <Button
              variant="primary"
              onClick={shareText}
              disabled={!transcriptionText.trim() || isExporting}
              className="w-full touch-target">

              <Icon name="Share2" size={16} />
              <span className="ml-2">
                {currentLanguage === 'hi' ? 'तुरंत शेयर करें' : 'Quick Share'}
              </span>
            </Button>
          </div>

          {/* Export Formats */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              {currentLanguage === 'hi' ? 'फॉर्मेट चुनें' : 'Choose Format'}
            </label>
            <div className="space-y-2">
              {exportFormats.map((format) =>
              <Button
                key={format.id}
                variant="ghost"
                onClick={() => handleExport(format)}
                disabled={!transcriptionText.trim() || isExporting}
                className="w-full justify-start p-3 h-auto touch-target">

                  <div className="flex items-center space-x-3 w-full">
                    <div className="p-2 bg-primary-100 rounded-md">
                      <Icon name={format.icon} size={16} className="text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm text-text-primary">
                        {format.name}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {format.description} ({format.extension})
                      </div>
                    </div>
                    <Icon name="Download" size={16} className="text-text-secondary" />
                  </div>
                </Button>
              )}
            </div>
          </div>

          {/* Export Status */}
          {isExporting &&
          <div className="flex items-center justify-center space-x-2 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="animate-spin">
                <Icon name="Loader2" size={16} className="text-primary" />
              </div>
              <span className="text-sm text-primary-700">
                {currentLanguage === 'hi' ? 'एक्सपोर्ट हो रहा है...' : 'Exporting...'}
              </span>
            </div>
          }

          {/* Export Tips */}
          <div className="p-3 bg-secondary-50 border border-secondary-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={16} className="text-secondary-600 mt-0.5" />
              <div className="text-sm text-secondary-700">
                <div className="font-medium mb-1">
                  {currentLanguage === 'hi' ? 'सुझाव:' : 'Tips:'}
                </div>
                <ul className="space-y-1 text-xs">
                  <li>
                    {currentLanguage === 'hi' ? '• PDF फॉर्मेट प्रिंटिंग के लिए सबसे अच्छा है' : '• PDF format is best for printing'
                    }
                  </li>
                  <li>
                    {currentLanguage === 'hi' ? '• SRT फॉर्मेट वीडियो सबटाइटल के लिए उपयोग करें' : '• Use SRT format for video subtitles'
                    }
                  </li>
                  <li>
                    {currentLanguage === 'hi' ? '• Word फॉर्मेट आगे की एडिटिंग के लिए बेहतर है' : '• Word format is better for further editing'
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default ExportPanel;