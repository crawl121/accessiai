import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ToolCard = ({ tool, speechSynthesis }) => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleToolLaunch = () => {
    navigate(tool.path);

    // Voice feedback if enabled
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Launching ${tool.title}`);
      speechSynthesis.speak(utterance);
    }
  };

  const handleAudioPreview = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(tool.audioDescription);
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-50 hover:bg-primary-100',
          border: 'border-primary-200',
          icon: 'text-primary',
          title: 'text-primary-700',
          button: 'primary'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-50 hover:bg-secondary-100',
          border: 'border-secondary-200',
          icon: 'text-secondary',
          title: 'text-secondary-700',
          button: 'secondary'
        };
      case 'warning':
        return {
          bg: 'bg-warning-50 hover:bg-warning-100',
          border: 'border-warning-200',
          icon: 'text-warning',
          title: 'text-warning-700',
          button: 'warning'
        };
      case 'success':
        return {
          bg: 'bg-success-50 hover:bg-success-100',
          border: 'border-success-200',
          icon: 'text-success',
          title: 'text-success-700',
          button: 'success'
        };
      default:
        return {
          bg: 'bg-surface hover:bg-surface-secondary',
          border: 'border-border',
          icon: 'text-text-secondary',
          title: 'text-text-primary',
          button: 'primary'
        };
    }
  };

  const colorClasses = getColorClasses(tool.color);

  return (
    <div
      className={`
        card ${colorClasses.bg} ${colorClasses.border}
        transition-all duration-200 ease-out
        focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
        hover:shadow-md hover:scale-[1.02]
      `}
      role="article"
      aria-labelledby={`tool-title-${tool.id}`}
      aria-describedby={`tool-desc-${tool.id}`}>

      {/* Tool header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-surface shadow-sm">
            <Icon
              name={tool.icon}
              size={24}
              className={colorClasses.icon} />

          </div>
          {tool.emergencyAccess &&
          <div className="flex items-center space-x-1">
              <Icon
              name="AlertTriangle"
              size={16}
              className="text-accent" />

              <span className="text-xs text-accent font-medium">
                {currentLanguage === 'es' ? 'Emergencia' :
              currentLanguage === 'fr' ? 'Urgence' :
              currentLanguage === 'de' ? 'Notfall' :
              currentLanguage === 'zh' ? '紧急' : 'Emergency'}
              </span>
            </div>
          }
        </div>
        
        {/* Audio preview button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAudioPreview}
          aria-label={`Audio preview for ${tool.title}`}
          className="touch-target">

          <Icon
            name={isPlaying ? "VolumeX" : "Volume2"}
            size={16}
            className={isPlaying ? "text-accent" : "text-text-secondary"} />

        </Button>
      </div>

      {/* Tool content */}
      <div className="mb-6">
        <h3
          id={`tool-title-${tool.id}`}
          className={`text-xl font-heading font-semibold mb-2 ${colorClasses.title}`}>

          {tool.title}
        </h3>
        <p
          id={`tool-desc-${tool.id}`}
          className="text-text-secondary text-sm leading-relaxed mb-4">

          {tool.description}
        </p>

        {/* Features list */}
        <ul className="space-y-2" role="list">
          {tool.features.map((feature, index) =>
          <li key={index} className="flex items-center space-x-2">
              <Icon
              name="Check"
              size={16}
              className={colorClasses.icon} />

              <span className="text-sm text-text-secondary">
                {feature}
              </span>
            </li>
          )}
        </ul>
      </div>

      {/* Status indicator */}
      {tool.status &&
      <div className="flex items-center space-x-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${
        tool.status === 'active' ? 'bg-success animate-pulse' :
        tool.status === 'loading' ? 'bg-warning animate-spin' : 'bg-text-tertiary'}`
        } />
          <span className="text-xs text-text-secondary">
            {tool.status === 'active' ?
          currentLanguage === 'es' ? 'Activo' :
          currentLanguage === 'fr' ? 'Actif' :
          currentLanguage === 'de' ? 'Aktiv' :
          currentLanguage === 'zh' ? '活跃' : 'Active' :
          tool.status === 'loading' ?
          currentLanguage === 'es' ? 'Cargando' :
          currentLanguage === 'fr' ? 'Chargement' :
          currentLanguage === 'de' ? 'Laden' :
          currentLanguage === 'zh' ? '加载中' : 'Loading' :
          currentLanguage === 'es' ? 'Inactivo' :
          currentLanguage === 'fr' ? 'Inactif' :
          currentLanguage === 'de' ? 'Inaktiv' :
          currentLanguage === 'zh' ? '非活跃' : 'Inactive'
          }
          </span>
        </div>
      }

      {/* Launch button */}
      <Button
        variant={colorClasses.button}
        fullWidth
        onClick={handleToolLaunch}
        className="touch-target"
        aria-describedby={`tool-desc-${tool.id}`}>

        <Icon name="ArrowRight" size={16} />
        <span className="ml-2">
          {currentLanguage === 'es' ? 'Iniciar Herramienta' :
          currentLanguage === 'fr' ? 'Lancer l\'Outil' :
          currentLanguage === 'de' ? 'Tool Starten' :
          currentLanguage === 'zh' ? '启动工具' : 'Launch Tool'}
        </span>
      </Button>
    </div>);

};

export default ToolCard;