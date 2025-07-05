import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ToolLauncher = () => {
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

  const tools = [
    {
      id: 'voice-to-text',
      title: currentLanguage === 'es' ? 'Conversión de Voz a Texto' : 
             currentLanguage === 'fr' ? 'Conversion Voix-Texte' :
             currentLanguage === 'de' ? 'Sprache-zu-Text' :
             currentLanguage === 'zh' ? '语音转文字' : 'Voice-to-Text Conversion',
      description: currentLanguage === 'es' ? 'Convierte tu voz en texto con IA avanzada' : 
                   currentLanguage === 'fr' ? 'Convertissez votre voix en texte avec IA avancée' :
                   currentLanguage === 'de' ? 'Wandeln Sie Ihre Stimme mit fortschrittlicher KI in Text um' :
                   currentLanguage === 'zh' ? '使用先进AI将语音转换为文字' : 'Convert your voice to text with advanced AI',
      path: '/voice-to-text-conversion-studio',
      icon: 'Mic',
      color: 'primary',
      features: [
        currentLanguage === 'es' ? 'Reconocimiento en tiempo real' : 
        currentLanguage === 'fr' ? 'Reconnaissance en temps réel' :
        currentLanguage === 'de' ? 'Echtzeit-Erkennung' :
        currentLanguage === 'zh' ? '实时识别' : 'Real-time recognition',
        
        currentLanguage === 'es' ? 'Múltiples idiomas' : 
        currentLanguage === 'fr' ? 'Langues multiples' :
        currentLanguage === 'de' ? 'Mehrere Sprachen' :
        currentLanguage === 'zh' ? '多语言支持' : 'Multiple languages',
        
        currentLanguage === 'es' ? 'Comandos de voz' : 
        currentLanguage === 'fr' ? 'Commandes vocales' :
        currentLanguage === 'de' ? 'Sprachbefehle' :
        currentLanguage === 'zh' ? '语音命令' : 'Voice commands'
      ],
      emergencyAccess: true
    },
    {
      id: 'sign-language',
      title: currentLanguage === 'es' ? 'Reconocimiento de Lenguaje de Señas' : 
             currentLanguage === 'fr' ? 'Reconnaissance Langue des Signes' :
             currentLanguage === 'de' ? 'Gebärdensprache-Erkennung' :
             currentLanguage === 'zh' ? '手语识别' : 'Sign Language Recognition',
      description: currentLanguage === 'es' ? 'Interpreta gestos y lenguaje de señas con IA' : 
                   currentLanguage === 'fr' ? 'Interprète les gestes et la langue des signes avec IA' :
                   currentLanguage === 'de' ? 'Interpretiert Gesten und Gebärdensprache mit KI' :
                   currentLanguage === 'zh' ? '使用AI解释手势和手语' : 'Interpret gestures and sign language with AI',
      path: '/sign-language-recognition-interface',
      icon: 'Hand',
      color: 'secondary',
      features: [
        currentLanguage === 'es' ? 'Detección de gestos' : 
        currentLanguage === 'fr' ? 'Détection de gestes' :
        currentLanguage === 'de' ? 'Gestenerkennung' :
        currentLanguage === 'zh' ? '手势检测' : 'Gesture detection',
        
        currentLanguage === 'es' ? 'Traducción en vivo' : 
        currentLanguage === 'fr' ? 'Traduction en direct' :
        currentLanguage === 'de' ? 'Live-Übersetzung' :
        currentLanguage === 'zh' ? '实时翻译' : 'Live translation',
        
        currentLanguage === 'es' ? 'Múltiples dialectos' : 
        currentLanguage === 'fr' ? 'Dialectes multiples' :
        currentLanguage === 'de' ? 'Mehrere Dialekte' :
        currentLanguage === 'zh' ? '多种方言' : 'Multiple dialects'
      ],
      emergencyAccess: true
    },
    {
      id: 'accessibility-settings',
      title: currentLanguage === 'es' ? 'Configuración de Accesibilidad' : 
             currentLanguage === 'fr' ? 'Paramètres d\'Accessibilité' :
             currentLanguage === 'de' ? 'Barrierefreiheits-Einstellungen' :
             currentLanguage === 'zh' ? '无障碍设置' : 'Accessibility Settings',
      description: currentLanguage === 'es' ? 'Personaliza tu experiencia de accesibilidad' : 
                   currentLanguage === 'fr' ? 'Personnalisez votre expérience d\'accessibilité' :
                   currentLanguage === 'de' ? 'Personalisieren Sie Ihre Barrierefreiheits-Erfahrung' :
                   currentLanguage === 'zh' ? '个性化您的无障碍体验' : 'Personalize your accessibility experience',
      path: '/accessibility-settings-personalization',
      icon: 'Settings',
      color: 'warning',
      features: [
        currentLanguage === 'es' ? 'Perfiles personalizados' : 
        currentLanguage === 'fr' ? 'Profils personnalisés' :
        currentLanguage === 'de' ? 'Benutzerdefinierte Profile' :
        currentLanguage === 'zh' ? '自定义配置文件' : 'Custom profiles',
        
        currentLanguage === 'es' ? 'Preferencias visuales' : 
        currentLanguage === 'fr' ? 'Préférences visuelles' :
        currentLanguage === 'de' ? 'Visuelle Einstellungen' :
        currentLanguage === 'zh' ? '视觉偏好' : 'Visual preferences',
        
        currentLanguage === 'es' ? 'Configuración de audio' : 
        currentLanguage === 'fr' ? 'Configuration audio' :
        currentLanguage === 'de' ? 'Audio-Konfiguration' :
        currentLanguage === 'zh' ? '音频配置' : 'Audio configuration'
      ],
      emergencyAccess: false
    }
  ];

  const handleToolLaunch = (tool) => {
    navigate(tool.path);
    
    // Voice feedback if enabled
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Launching ${tool.title}`);
      speechSynthesis.speak(utterance);
    }
  };

  const handleKeyDown = (event, tool) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToolLaunch(tool);
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

  return (
    <div className="tool-launcher-grid">
      {tools.map((tool) => {
        const colorClasses = getColorClasses(tool.color);
        
        return (
          <div
            key={tool.id}
            className={`
              card ${colorClasses.bg} ${colorClasses.border}
              transition-all duration-200 ease-out
              focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
              hover:shadow-md hover:scale-[1.02]
            `}
            role="article"
            aria-labelledby={`tool-title-${tool.id}`}
            aria-describedby={`tool-desc-${tool.id}`}
          >
            {/* Tool header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg bg-surface shadow-sm`}>
                  <Icon 
                    name={tool.icon} 
                    size={24} 
                    className={colorClasses.icon}
                  />
                </div>
                {tool.emergencyAccess && (
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name="AlertTriangle" 
                      size={16} 
                      className="text-accent"
                    />
                    <span className="text-xs text-accent font-medium">
                      {currentLanguage === 'es' ? 'Acceso de Emergencia' : 
                       currentLanguage === 'fr' ? 'Accès d\'Urgence' :
                       currentLanguage === 'de' ? 'Notfall-Zugang' :
                       currentLanguage === 'zh' ? '紧急访问' : 'Emergency Access'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tool content */}
            <div className="mb-6">
              <h3 
                id={`tool-title-${tool.id}`}
                className={`text-xl font-heading font-semibold mb-2 ${colorClasses.title}`}
              >
                {tool.title}
              </h3>
              <p 
                id={`tool-desc-${tool.id}`}
                className="text-text-secondary text-sm leading-relaxed mb-4"
              >
                {tool.description}
              </p>

              {/* Features list */}
              <ul className="space-y-2" role="list">
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Icon 
                      name="Check" 
                      size={16} 
                      className={colorClasses.icon}
                    />
                    <span className="text-sm text-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Launch button */}
            <Button
              variant={colorClasses.button}
              fullWidth
              onClick={() => handleToolLaunch(tool)}
              onKeyDown={(e) => handleKeyDown(e, tool)}
              className="touch-target"
              aria-describedby={`tool-desc-${tool.id}`}
            >
              <Icon name="ArrowRight" size={16} />
              <span className="ml-2">
                {currentLanguage === 'es' ? 'Iniciar Herramienta' : 
                 currentLanguage === 'fr' ? 'Lancer l\'Outil' :
                 currentLanguage === 'de' ? 'Tool Starten' :
                 currentLanguage === 'zh' ? '启动工具' : 'Launch Tool'}
              </span>
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default ToolLauncher;