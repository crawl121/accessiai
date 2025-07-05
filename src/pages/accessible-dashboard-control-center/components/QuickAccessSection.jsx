import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickAccessSection = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Load user profile for personalized quick access
    const savedProfile = localStorage.getItem('user-accessibility-profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const quickAccessTools = [
    {
      id: 'voice-to-text',
      title: currentLanguage === 'es' ? 'Voz a Texto' : 
             currentLanguage === 'fr' ? 'Voix-Texte' :
             currentLanguage === 'de' ? 'Sprache-Text' :
             currentLanguage === 'zh' ? '语音转文字' : 'Voice-to-Text',
      path: '/voice-to-text-conversion-studio',
      icon: 'Mic',
      color: 'primary',
      usage: 'high',
      lastUsed: '2 minutes ago'
    },
    {
      id: 'sign-language',
      title: currentLanguage === 'es' ? 'Lenguaje de Señas' : 
             currentLanguage === 'fr' ? 'Langue des Signes' :
             currentLanguage === 'de' ? 'Gebärdensprache' :
             currentLanguage === 'zh' ? '手语' : 'Sign Language',
      path: '/sign-language-recognition-interface',
      icon: 'Hand',
      color: 'secondary',
      usage: 'medium',
      lastUsed: '1 hour ago'
    },
    {
      id: 'settings',
      title: currentLanguage === 'es' ? 'Configuración' : 
             currentLanguage === 'fr' ? 'Paramètres' :
             currentLanguage === 'de' ? 'Einstellungen' :
             currentLanguage === 'zh' ? '设置' : 'Settings',
      path: '/accessibility-settings-personalization',
      icon: 'Settings',
      color: 'warning',
      usage: 'low',
      lastUsed: '3 hours ago'
    }
  ];

  const handleToolAccess = (tool) => {
    navigate(tool.path);
    
    // Voice feedback if enabled
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Quick access to ${tool.title}`);
      speechSynthesis.speak(utterance);
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100';
      case 'secondary':
        return 'bg-secondary-50 border-secondary-200 text-secondary-700 hover:bg-secondary-100';
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-700 hover:bg-warning-100';
      default:
        return 'bg-surface border-border text-text-primary hover:bg-surface-secondary';
    }
  };

  return (
    <section 
      className="bg-surface rounded-lg border border-border p-6 shadow-sm"
      aria-labelledby="quick-access-title"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 
          id="quick-access-title"
          className="text-xl font-heading font-semibold text-text-primary"
        >
          {currentLanguage === 'es' ? 'Acceso Rápido' : 
           currentLanguage === 'fr' ? 'Accès Rapide' :
           currentLanguage === 'de' ? 'Schnellzugriff' :
           currentLanguage === 'zh' ? '快速访问' : 'Quick Access'}
        </h2>
        <Icon name="Zap" size={20} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickAccessTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolAccess(tool)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              touch-target ${getColorClasses(tool.color)}
            `}
            aria-describedby={`quick-tool-desc-${tool.id}`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon 
                name={tool.icon} 
                size={20} 
                className="text-current"
              />
              <span className="font-medium text-sm">
                {tool.title}
              </span>
            </div>
            <div 
              id={`quick-tool-desc-${tool.id}`}
              className="text-xs opacity-75"
            >
              {currentLanguage === 'es' ? 'Último uso:' : 
               currentLanguage === 'fr' ? 'Dernière utilisation:' :
               currentLanguage === 'de' ? 'Zuletzt verwendet:' :
               currentLanguage === 'zh' ? '最后使用:' : 'Last used:'} {tool.lastUsed}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/accessibility-settings-personalization')}
          className="text-text-secondary hover:text-primary"
        >
          <Icon name="Edit" size={16} />
          <span className="ml-2">
            {currentLanguage === 'es' ? 'Personalizar' : 
             currentLanguage === 'fr' ? 'Personnaliser' :
             currentLanguage === 'de' ? 'Anpassen' :
             currentLanguage === 'zh' ? '自定义' : 'Customize'}
          </span>
        </Button>
      </div>
    </section>
  );
};

export default QuickAccessSection;