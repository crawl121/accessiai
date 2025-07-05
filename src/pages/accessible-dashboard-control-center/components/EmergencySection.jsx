import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const EmergencySection = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const emergencyFeatures = [
    {
      id: 'emergency-voice',
      title: currentLanguage === 'es' ? 'Voz de Emergencia' : 
             currentLanguage === 'fr' ? 'Voix d\'Urgence' :
             currentLanguage === 'de' ? 'Notfall-Stimme' :
             currentLanguage === 'zh' ? '紧急语音' : 'Emergency Voice',
      description: currentLanguage === 'es' ? 'Activación rápida de conversión de voz a texto' : 
                   currentLanguage === 'fr' ? 'Activation rapide de la conversion voix-texte' :
                   currentLanguage === 'de' ? 'Schnelle Aktivierung der Sprache-zu-Text-Konvertierung' :
                   currentLanguage === 'zh' ? '快速激活语音转文字转换' : 'Quick activation of voice-to-text conversion',
      path: '/voice-to-text-conversion-studio',
      icon: 'Mic',
      shortcut: 'Ctrl+Shift+V'
    },
    {
      id: 'emergency-gesture',
      title: currentLanguage === 'es' ? 'Gestos de Emergencia' : 
             currentLanguage === 'fr' ? 'Gestes d\'Urgence' :
             currentLanguage === 'de' ? 'Notfall-Gesten' :
             currentLanguage === 'zh' ? '紧急手势' : 'Emergency Gestures',
      description: currentLanguage === 'es' ? 'Reconocimiento inmediato de lenguaje de señas' : 
                   currentLanguage === 'fr' ? 'Reconnaissance immédiate de la langue des signes' :
                   currentLanguage === 'de' ? 'Sofortige Erkennung der Gebärdensprache' :
                   currentLanguage === 'zh' ? '即时手语识别' : 'Immediate sign language recognition',
      path: '/sign-language-recognition-interface',
      icon: 'Hand',
      shortcut: 'Ctrl+Shift+G'
    },
    {
      id: 'emergency-help',
      title: currentLanguage === 'es' ? 'Ayuda de Emergencia' : 
             currentLanguage === 'fr' ? 'Aide d\'Urgence' :
             currentLanguage === 'de' ? 'Notfall-Hilfe' :
             currentLanguage === 'zh' ? '紧急帮助' : 'Emergency Help',
      description: currentLanguage === 'es' ? 'Contacto directo con soporte de accesibilidad' : 
                   currentLanguage === 'fr' ? 'Contact direct avec le support d\'accessibilité' :
                   currentLanguage === 'de' ? 'Direkter Kontakt mit Barrierefreiheits-Support' :
                   currentLanguage === 'zh' ? '直接联系无障碍支持' : 'Direct contact with accessibility support',
      action: 'help',
      icon: 'Phone',
      shortcut: 'Ctrl+Shift+H'
    }
  ];

  const handleEmergencyAction = (feature) => {
    if (feature.action === 'help') {
      // Voice announcement for emergency help
      if ('speechSynthesis' in window) {
        const message = currentLanguage === 'es' ? 'Activando ayuda de emergencia. En una aplicación real, esto contactaría al soporte.' : 
                       currentLanguage === 'fr' ? 'Activation de l\'aide d\'urgence. Dans une vraie application, cela contacterait le support.' :
                       currentLanguage === 'de' ? 'Notfall-Hilfe aktivieren. In einer echten Anwendung würde dies den Support kontaktieren.' :
                       currentLanguage === 'zh' ? '激活紧急帮助。在真实应用中，这将联系支持。' : 'Activating emergency help. In a real application, this would contact support.';
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
      }
      alert('Emergency support would be contacted in a real application');
    } else {
      navigate(feature.path);
      
      // Voice feedback
      const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Emergency access to ${feature.title}`);
        speechSynthesis.speak(utterance);
      }
    }
  };

  const handleKeyDown = (event, feature) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEmergencyAction(feature);
    }
  };

  return (
    <section 
      className="bg-accent-50 rounded-lg border-2 border-accent-200 p-6 shadow-sm"
      aria-labelledby="emergency-title"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-accent-100">
          <Icon name="AlertTriangle" size={24} className="text-accent" />
        </div>
        <div>
          <h2 
            id="emergency-title"
            className="text-xl font-heading font-semibold text-accent-700"
          >
            {currentLanguage === 'es' ? 'Funciones de Emergencia' : 
             currentLanguage === 'fr' ? 'Fonctions d\'Urgence' :
             currentLanguage === 'de' ? 'Notfall-Funktionen' :
             currentLanguage === 'zh' ? '紧急功能' : 'Emergency Features'}
          </h2>
          <p className="text-sm text-accent-600">
            {currentLanguage === 'es' ? 'Acceso rápido a herramientas críticas de accesibilidad' : 
             currentLanguage === 'fr' ? 'Accès rapide aux outils d\'accessibilité critiques' :
             currentLanguage === 'de' ? 'Schneller Zugang zu kritischen Barrierefreiheits-Tools' :
             currentLanguage === 'zh' ? '快速访问关键无障碍工具' : 'Quick access to critical accessibility tools'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {emergencyFeatures.map((feature) => (
          <button
            key={feature.id}
            onClick={() => handleEmergencyAction(feature)}
            onKeyDown={(e) => handleKeyDown(e, feature)}
            className="
              p-4 rounded-lg bg-surface border-2 border-accent-200
              hover:bg-accent-50 hover:border-accent-300
              focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
              transition-all duration-200 ease-out touch-target
              text-left
            "
            aria-describedby={`emergency-desc-${feature.id}`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-md bg-accent-100">
                <Icon 
                  name={feature.icon} 
                  size={20} 
                  className="text-accent"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-text-primary text-sm">
                  {feature.title}
                </h3>
                {feature.shortcut && (
                  <span className="text-xs text-text-secondary font-mono">
                    {feature.shortcut}
                  </span>
                )}
              </div>
            </div>
            
            <p 
              id={`emergency-desc-${feature.id}`}
              className="text-xs text-text-secondary leading-relaxed"
            >
              {feature.description}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-warning-50 border border-warning-200">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-warning-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-warning-700">
              {currentLanguage === 'es' ? 'Información Importante' : 
               currentLanguage === 'fr' ? 'Information Importante' :
               currentLanguage === 'de' ? 'Wichtige Information' :
               currentLanguage === 'zh' ? '重要信息' : 'Important Information'}
            </h4>
            <p className="text-xs text-warning-600 mt-1">
              {currentLanguage === 'es' ? 'Las funciones de emergencia están disponibles las 24 horas. Use los atajos de teclado para acceso más rápido.' : 
               currentLanguage === 'fr' ? 'Les fonctions d\'urgence sont disponibles 24h/24. Utilisez les raccourcis clavier pour un accès plus rapide.' :
               currentLanguage === 'de' ? 'Notfall-Funktionen sind rund um die Uhr verfügbar. Verwenden Sie Tastenkürzel für schnelleren Zugang.' :
               currentLanguage === 'zh' ? '紧急功能24小时可用。使用键盘快捷键可更快访问。' : 'Emergency features are available 24/7. Use keyboard shortcuts for faster access.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencySection;