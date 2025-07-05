import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const EmergencyAccessPanel = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    // Listen for emergency access trigger
    const handleEmergencyAccess = () => {
      setIsExpanded(true);
      // Voice announcement
      const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const message = currentLanguage === 'es' ? 'Panel de emergencia activado' : 
                       currentLanguage === 'fr' ? 'Panneau d\'urgence activé' :
                       currentLanguage === 'de' ? 'Notfall-Panel aktiviert' :
                       currentLanguage === 'zh' ? '紧急面板已激活' : 'Emergency panel activated';
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange);
    window.addEventListener('emergencyAccess', handleEmergencyAccess);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
      window.removeEventListener('emergencyAccess', handleEmergencyAccess);
    };
  }, [currentLanguage]);

  const emergencyTools = [
    {
      id: 'voice-emergency',
      title: currentLanguage === 'es' ? 'Voz de Emergencia' : 
             currentLanguage === 'fr' ? 'Voix d\'Urgence' :
             currentLanguage === 'de' ? 'Notfall-Stimme' :
             currentLanguage === 'zh' ? '紧急语音' : 'Emergency Voice',
      description: currentLanguage === 'es' ? 'Conversión rápida de voz a texto' : 
                   currentLanguage === 'fr' ? 'Conversion rapide voix-texte' :
                   currentLanguage === 'de' ? 'Schnelle Sprache-zu-Text' :
                   currentLanguage === 'zh' ? '快速语音转文字' : 'Quick voice-to-text conversion',
      path: '/voice-to-text-conversion-studio',
      icon: 'Mic',
      color: 'accent'
    },
    {
      id: 'sign-emergency',
      title: currentLanguage === 'es' ? 'Señas de Emergencia' : 
             currentLanguage === 'fr' ? 'Signes d\'Urgence' :
             currentLanguage === 'de' ? 'Notfall-Gebärden' :
             currentLanguage === 'zh' ? '紧急手语' : 'Emergency Signs',
      description: currentLanguage === 'es' ? 'Reconocimiento rápido de gestos' : 
                   currentLanguage === 'fr' ? 'Reconnaissance rapide de gestes' :
                   currentLanguage === 'de' ? 'Schnelle Gestenerkennung' :
                   currentLanguage === 'zh' ? '快速手势识别' : 'Quick gesture recognition',
      path: '/sign-language-recognition-interface',
      icon: 'Hand',
      color: 'accent'
    },
    {
      id: 'help-emergency',
      title: currentLanguage === 'es' ? 'Ayuda de Emergencia' : 
             currentLanguage === 'fr' ? 'Aide d\'Urgence' :
             currentLanguage === 'de' ? 'Notfall-Hilfe' :
             currentLanguage === 'zh' ? '紧急帮助' : 'Emergency Help',
      description: currentLanguage === 'es' ? 'Contacto de emergencia y soporte' : 
                   currentLanguage === 'fr' ? 'Contact d\'urgence et support' :
                   currentLanguage === 'de' ? 'Notfall-Kontakt und Support' :
                   currentLanguage === 'zh' ? '紧急联系和支持' : 'Emergency contact and support',
      action: 'help',
      icon: 'Phone',
      color: 'warning'
    }
  ];

  const handleToolAccess = (tool) => {
    if (tool.action === 'help') {
      // Handle emergency help action
      if ('speechSynthesis' in window) {
        const message = currentLanguage === 'es' ? 'Contactando soporte de emergencia' : 
                       currentLanguage === 'fr' ? 'Contact du support d\'urgence' :
                       currentLanguage === 'de' ? 'Notfall-Support kontaktieren' :
                       currentLanguage === 'zh' ? '联系紧急支持' : 'Contacting emergency support';
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
      }
      // In a real app, this would trigger emergency contact
      alert('Emergency support would be contacted in a real application');
    } else {
      navigate(tool.path);
    }
    setIsExpanded(false);
  };

  const handleKeyDown = (event, tool) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToolAccess(tool);
    }
  };

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="emergency-access-panel">
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[1050]"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}

      {/* Emergency panel */}
      <div 
        className={`
          fixed bottom-6 right-6 z-[1100] transition-all duration-300 ease-out
          ${isExpanded ? 'w-80' : 'w-auto'}
        `}
        role="dialog"
        aria-label="Emergency accessibility tools"
        aria-expanded={isExpanded}
      >
        {/* Expanded panel */}
        {isExpanded && (
          <div className="bg-surface rounded-lg shadow-xl border border-border mb-4 animate-fade-in">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={20} className="text-accent" />
                  <h3 className="font-heading font-semibold text-lg text-text-primary">
                    {currentLanguage === 'es' ? 'Acceso de Emergencia' : 
                     currentLanguage === 'fr' ? 'Accès d\'Urgence' :
                     currentLanguage === 'de' ? 'Notfall-Zugang' :
                     currentLanguage === 'zh' ? '紧急访问' : 'Emergency Access'}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Close emergency panel"
                  className="touch-target"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
              <p className="text-sm text-text-secondary mt-1">
                {currentLanguage === 'es' ? 'Herramientas de accesibilidad rápida' : 
                 currentLanguage === 'fr' ? 'Outils d\'accessibilité rapide' :
                 currentLanguage === 'de' ? 'Schnelle Barrierefreiheits-Tools' :
                 currentLanguage === 'zh' ? '快速无障碍工具' : 'Quick accessibility tools'}
              </p>
            </div>

            <div className="p-4 space-y-3">
              {emergencyTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolAccess(tool)}
                  onKeyDown={(e) => handleKeyDown(e, tool)}
                  className="
                    w-full flex items-center space-x-3 p-3 rounded-lg
                    bg-surface-secondary hover:bg-accent-50 
                    border border-border hover:border-accent-200
                    transition-all duration-200 ease-out touch-target
                    focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                  "
                  aria-describedby={`emergency-desc-${tool.id}`}
                >
                  <div className="p-2 rounded-md bg-accent-100">
                    <Icon 
                      name={tool.icon} 
                      size={16} 
                      className="text-accent"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm text-text-primary">
                      {tool.title}
                    </div>
                    <div 
                      id={`emergency-desc-${tool.id}`}
                      className="text-xs text-text-secondary"
                    >
                      {tool.description}
                    </div>
                  </div>
                  <Icon 
                    name="ArrowRight" 
                    size={14} 
                    className="text-text-secondary"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Emergency trigger button */}
        <Button
          variant="accent"
          size="lg"
          onClick={togglePanel}
          aria-label={
            isExpanded 
              ? (currentLanguage === 'es' ? 'Cerrar panel de emergencia' : 
                 currentLanguage === 'fr' ? 'Fermer le panneau d\'urgence' :
                 currentLanguage === 'de' ? 'Notfall-Panel schließen' :
                 currentLanguage === 'zh' ? '关闭紧急面板' : 'Close emergency panel')
              : (currentLanguage === 'es' ? 'Abrir panel de emergencia' : 
                 currentLanguage === 'fr' ? 'Ouvrir le panneau d\'urgence' :
                 currentLanguage === 'de' ? 'Notfall-Panel öffnen' :
                 currentLanguage === 'zh' ? '打开紧急面板' : 'Open emergency panel')
          }
          className={`
            touch-target shadow-lg hover:shadow-xl
            ${isExpanded ? 'bg-accent-600' : ''}
            animate-pulse-slow
          `}
        >
          <Icon 
            name={isExpanded ? "X" : "AlertTriangle"} 
            size={20} 
          />
          <span className="ml-2 font-medium">
            {currentLanguage === 'es' ? 'SOS' : 
             currentLanguage === 'fr' ? 'SOS' :
             currentLanguage === 'de' ? 'SOS' :
             currentLanguage === 'zh' ? 'SOS' : 'SOS'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default EmergencyAccessPanel;