import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AccessibilityToolbar from '../../components/ui/AccessibilityToolbar';
import MainNavigation from '../../components/ui/MainNavigation';
import EmergencyAccessPanel from '../../components/ui/EmergencyAccessPanel';
import QuickAccessSection from './components/QuickAccessSection';
import ToolCard from './components/ToolCard';
import StatusIndicator from './components/StatusIndicator';
import EmergencySection from './components/EmergencySection';
import VoiceNavigationPanel from './components/VoiceNavigationPanel';

const AccessibleDashboardControlCenter = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Load user profile
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

  const accessibilityTools = [
    {
      id: 'voice-to-text',
      title: currentLanguage === 'es' ? 'Conversión de Voz a Texto' : 
             currentLanguage === 'fr' ? 'Conversion Voix-Texte' :
             currentLanguage === 'de' ? 'Sprache-zu-Text-Konvertierung' :
             currentLanguage === 'zh' ? '语音转文字转换' : 'Voice-to-Text Conversion',
      description: currentLanguage === 'es' ? 'Convierte tu voz en texto usando tecnología AI avanzada con soporte para múltiples idiomas y reconocimiento en tiempo real.' : 
                   currentLanguage === 'fr' ? 'Convertissez votre voix en texte en utilisant une technologie IA avancée avec support multilingue et reconnaissance en temps réel.' :
                   currentLanguage === 'de' ? 'Wandeln Sie Ihre Stimme mit fortschrittlicher KI-Technologie in Text um, mit Unterstützung für mehrere Sprachen und Echtzeit-Erkennung.' :
                   currentLanguage === 'zh' ? '使用先进的AI技术将语音转换为文字，支持多语言和实时识别。' : 'Convert your voice to text using advanced AI technology with multi-language support and real-time recognition.',
      audioDescription: currentLanguage === 'es' ? 'Herramienta de conversión de voz a texto con reconocimiento en tiempo real' : 
                        currentLanguage === 'fr' ? 'Outil de conversion voix-texte avec reconnaissance en temps réel' :
                        currentLanguage === 'de' ? 'Sprache-zu-Text-Konvertierungstool mit Echtzeit-Erkennung' :
                        currentLanguage === 'zh' ? '具有实时识别功能的语音转文字转换工具' : 'Voice-to-text conversion tool with real-time recognition',
      path: '/voice-to-text-conversion-studio',
      icon: 'Mic',
      color: 'primary',
      features: [
        currentLanguage === 'es' ? 'Reconocimiento en tiempo real' : 
        currentLanguage === 'fr' ? 'Reconnaissance en temps réel' :
        currentLanguage === 'de' ? 'Echtzeit-Erkennung' :
        currentLanguage === 'zh' ? '实时识别' : 'Real-time recognition',
        
        currentLanguage === 'es' ? 'Soporte multiidioma' : 
        currentLanguage === 'fr' ? 'Support multilingue' :
        currentLanguage === 'de' ? 'Mehrsprachige Unterstützung' :
        currentLanguage === 'zh' ? '多语言支持' : 'Multi-language support',
        
        currentLanguage === 'es' ? 'Comandos de voz personalizados' : 
        currentLanguage === 'fr' ? 'Commandes vocales personnalisées' :
        currentLanguage === 'de' ? 'Benutzerdefinierte Sprachbefehle' :
        currentLanguage === 'zh' ? '自定义语音命令' : 'Custom voice commands'
      ],
      emergencyAccess: true,
      status: 'active'
    },
    {
      id: 'sign-language',
      title: currentLanguage === 'es' ? 'Reconocimiento de Lenguaje de Señas' : 
             currentLanguage === 'fr' ? 'Reconnaissance de la Langue des Signes' :
             currentLanguage === 'de' ? 'Gebärdensprache-Erkennung' :
             currentLanguage === 'zh' ? '手语识别' : 'Sign Language Recognition',
      description: currentLanguage === 'es' ? 'Interpreta gestos y lenguaje de señas usando visión por computadora AI para comunicación visual efectiva.' : 
                   currentLanguage === 'fr' ? 'Interprète les gestes et la langue des signes en utilisant la vision par ordinateur IA pour une communication visuelle efficace.' :
                   currentLanguage === 'de' ? 'Interpretiert Gesten und Gebärdensprache mit KI-Computer-Vision für effektive visuelle Kommunikation.' :
                   currentLanguage === 'zh' ? '使用AI计算机视觉解释手势和手语，实现有效的视觉交流。' : 'Interpret gestures and sign language using AI computer vision for effective visual communication.',
      audioDescription: currentLanguage === 'es' ? 'Herramienta de reconocimiento de lenguaje de señas con detección de gestos' : 
                        currentLanguage === 'fr' ? 'Outil de reconnaissance de la langue des signes avec détection de gestes' :
                        currentLanguage === 'de' ? 'Gebärdensprache-Erkennungstool mit Gestenerkennung' :
                        currentLanguage === 'zh' ? '具有手势检测功能的手语识别工具' : 'Sign language recognition tool with gesture detection',
      path: '/sign-language-recognition-interface',
      icon: 'Hand',
      color: 'secondary',
      features: [
        currentLanguage === 'es' ? 'Detección de gestos en tiempo real' : 
        currentLanguage === 'fr' ? 'Détection de gestes en temps réel' :
        currentLanguage === 'de' ? 'Echtzeit-Gestenerkennung' :
        currentLanguage === 'zh' ? '实时手势检测' : 'Real-time gesture detection',
        
        currentLanguage === 'es' ? 'Traducción instantánea' : 
        currentLanguage === 'fr' ? 'Traduction instantanée' :
        currentLanguage === 'de' ? 'Sofortübersetzung' :
        currentLanguage === 'zh' ? '即时翻译' : 'Instant translation',
        
        currentLanguage === 'es' ? 'Múltiples dialectos de señas' : 
        currentLanguage === 'fr' ? 'Dialectes de signes multiples' :
        currentLanguage === 'de' ? 'Mehrere Gebärdensprache-Dialekte' :
        currentLanguage === 'zh' ? '多种手语方言' : 'Multiple sign dialects'
      ],
      emergencyAccess: true,
      status: 'active'
    },
    {
      id: 'image-description',
      title: currentLanguage === 'es' ? 'Descripción de Imágenes AI' : 
             currentLanguage === 'fr' ? 'Description d\'Images IA' :
             currentLanguage === 'de' ? 'KI-Bildbeschreibung' :
             currentLanguage === 'zh' ? 'AI图像描述' : 'AI Image Description',
      description: currentLanguage === 'es' ? 'Genera descripciones detalladas de imágenes usando AI para mejorar la accesibilidad visual y comprensión del contenido.' : 
                   currentLanguage === 'fr' ? 'Génère des descriptions détaillées d\'images en utilisant l\'IA pour améliorer l\'accessibilité visuelle et la compréhension du contenu.' :
                   currentLanguage === 'de' ? 'Generiert detaillierte Bildbeschreibungen mit KI zur Verbesserung der visuellen Zugänglichkeit und des Inhaltsverständnisses.' :
                   currentLanguage === 'zh' ? '使用AI生成详细的图像描述，提高视觉可访问性和内容理解。' : 'Generate detailed image descriptions using AI to enhance visual accessibility and content understanding.',
      audioDescription: currentLanguage === 'es' ? 'Herramienta de descripción de imágenes con inteligencia artificial' : 
                        currentLanguage === 'fr' ? 'Outil de description d\'images avec intelligence artificielle' :
                        currentLanguage === 'de' ? 'Bildbeschreibungstool mit künstlicher Intelligenz' :
                        currentLanguage === 'zh' ? '人工智能图像描述工具' : 'Artificial intelligence image description tool',
      path: '/image-description-generator',
      icon: 'Image',
      color: 'warning',
      features: [
        currentLanguage === 'es' ? 'Análisis detallado de imágenes' : 
        currentLanguage === 'fr' ? 'Analyse détaillée d\'images' :
        currentLanguage === 'de' ? 'Detaillierte Bildanalyse' :
        currentLanguage === 'zh' ? '详细图像分析' : 'Detailed image analysis',
        
        currentLanguage === 'es' ? 'Descripción de texto alternativo' : 
        currentLanguage === 'fr' ? 'Description de texte alternatif' :
        currentLanguage === 'de' ? 'Alternative Textbeschreibung' :
        currentLanguage === 'zh' ? '替代文本描述' : 'Alt-text description',
        
        currentLanguage === 'es' ? 'Reconocimiento de objetos y escenas' : 
        currentLanguage === 'fr' ? 'Reconnaissance d\'objets et de scènes' :
        currentLanguage === 'de' ? 'Objekt- und Szenenerkennung' :
        currentLanguage === 'zh' ? '物体和场景识别' : 'Object and scene recognition'
      ],
      emergencyAccess: false,
      status: 'loading'
    },
    {
      id: 'accessibility-settings',
      title: currentLanguage === 'es' ? 'Configuración de Accesibilidad' : 
             currentLanguage === 'fr' ? 'Paramètres d\'Accessibilité' :
             currentLanguage === 'de' ? 'Barrierefreiheits-Einstellungen' :
             currentLanguage === 'zh' ? '无障碍设置' : 'Accessibility Settings',
      description: currentLanguage === 'es' ? 'Personaliza tu experiencia de accesibilidad con perfiles adaptativos y configuraciones específicas para discapacidades.' : 
                   currentLanguage === 'fr' ? 'Personnalisez votre expérience d\'accessibilité avec des profils adaptatifs et des configurations spécifiques aux handicaps.' :
                   currentLanguage === 'de' ? 'Personalisieren Sie Ihre Barrierefreiheits-Erfahrung mit adaptiven Profilen und behinderungsspezifischen Konfigurationen.' :
                   currentLanguage === 'zh' ? '使用自适应配置文件和特定残疾配置个性化您的无障碍体验。' : 'Personalize your accessibility experience with adaptive profiles and disability-specific configurations.',
      audioDescription: currentLanguage === 'es' ? 'Configuración personalizada de accesibilidad con perfiles adaptativos' : 
                        currentLanguage === 'fr' ? 'Configuration d\'accessibilité personnalisée avec profils adaptatifs' :
                        currentLanguage === 'de' ? 'Personalisierte Barrierefreiheits-Konfiguration mit adaptiven Profilen' :
                        currentLanguage === 'zh' ? '具有自适应配置文件的个性化无障碍配置' : 'Personalized accessibility configuration with adaptive profiles',
      path: '/accessibility-settings-personalization',
      icon: 'Settings',
      color: 'success',
      features: [
        currentLanguage === 'es' ? 'Perfiles personalizados' : 
        currentLanguage === 'fr' ? 'Profils personnalisés' :
        currentLanguage === 'de' ? 'Benutzerdefinierte Profile' :
        currentLanguage === 'zh' ? '自定义配置文件' : 'Custom profiles',
        
        currentLanguage === 'es' ? 'Configuración visual adaptativa' : 
        currentLanguage === 'fr' ? 'Configuration visuelle adaptative' :
        currentLanguage === 'de' ? 'Adaptive visuelle Konfiguration' :
        currentLanguage === 'zh' ? '自适应视觉配置' : 'Adaptive visual configuration',
        
        currentLanguage === 'es' ? 'Preferencias de audio personalizadas' : 
        currentLanguage === 'fr' ? 'Préférences audio personnalisées' :
        currentLanguage === 'de' ? 'Personalisierte Audio-Einstellungen' :
        currentLanguage === 'zh' ? '个性化音频偏好' : 'Personalized audio preferences'
      ],
      emergencyAccess: false,
      status: 'active'
    }
  ];

  const getPageTitle = () => {
    switch (currentLanguage) {
      case 'es':
        return 'Panel de Control de Accesibilidad - AccessiAI';
      case 'fr':
        return 'Tableau de Bord d\'Accessibilité - AccessiAI';
      case 'de':
        return 'Barrierefreiheits-Dashboard - AccessiAI';
      case 'zh':
        return '无障碍控制面板 - AccessiAI';
      default:
        return 'Accessible Dashboard & Control Center - AccessiAI';
    }
  };

  const getPageDescription = () => {
    switch (currentLanguage) {
      case 'es':
        return 'Centro de control principal para herramientas de accesibilidad AI. Acceso rápido a conversión de voz a texto, reconocimiento de lenguaje de señas y configuraciones personalizadas.';
      case 'fr':
        return 'Centre de contrôle principal pour les outils d\'accessibilité IA. Accès rapide à la conversion voix-texte, reconnaissance de langue des signes et configurations personnalisées.';
      case 'de':
        return 'Hauptkontrollzentrum für KI-Barrierefreiheits-Tools. Schneller Zugang zu Sprache-zu-Text-Konvertierung, Gebärdensprache-Erkennung und personalisierten Konfigurationen.';
      case 'zh':
        return '人工智能无障碍工具的主要控制中心。快速访问语音转文字转换、手语识别和个性化配置。';
      default:
        return 'Main control center for AI accessibility tools. Quick access to voice-to-text conversion, sign language recognition, and personalized configurations.';
    }
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content="accessibility, AI, voice-to-text, sign language, dashboard, control center" />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/accessible-dashboard-control-center" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Accessibility Toolbar */}
        <AccessibilityToolbar />

        {/* Main Navigation */}
        <MainNavigation 
          isOpen={isNavOpen} 
          onClose={() => setIsNavOpen(false)} 
        />

        {/* Main Content */}
        <main 
          id="main-content"
          className="lg:ml-64 pt-16"
          role="main"
          aria-labelledby="dashboard-title"
        >
          {/* Mobile menu button */}
          <div className="lg:hidden fixed top-16 left-4 z-50">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNavOpen(true)}
              aria-label="Open navigation menu"
              className="touch-target"
            >
              <Icon name="Menu" size={20} />
            </Button>
          </div>

          {/* Dashboard Header */}
          <header className="bg-surface border-b border-border px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 
                    id="dashboard-title"
                    className="text-3xl font-heading font-bold text-text-primary mb-2"
                  >
                    {currentLanguage === 'es' ? 'Panel de Control de Accesibilidad' : 
                     currentLanguage === 'fr' ? 'Tableau de Bord d\'Accessibilité' :
                     currentLanguage === 'de' ? 'Barrierefreiheits-Dashboard' :
                     currentLanguage === 'zh' ? '无障碍控制面板' : 'Accessible Dashboard & Control Center'}
                  </h1>
                  <p className="text-text-secondary text-lg">
                    {currentLanguage === 'es' ? 'Su centro de comando para herramientas de accesibilidad AI' : 
                     currentLanguage === 'fr' ? 'Votre centre de commande pour les outils d\'accessibilité IA' :
                     currentLanguage === 'de' ? 'Ihr Kommandozentrum für KI-Barrierefreiheits-Tools' :
                     currentLanguage === 'zh' ? '您的AI无障碍工具指挥中心' : 'Your command center for AI accessibility tools'}
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-text-secondary">
                      {currentLanguage === 'es' ? 'Bienvenido de vuelta' : 
                       currentLanguage === 'fr' ? 'Bon retour' :
                       currentLanguage === 'de' ? 'Willkommen zurück' :
                       currentLanguage === 'zh' ? '欢迎回来' : 'Welcome back'}
                    </p>
                    <p className="font-medium text-text-primary">
                      {userProfile?.name || 'AccessiAI User'}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Icon name="User" size={24} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            {/* Quick Access Section */}
            <QuickAccessSection />

            {/* Main Tools Grid */}
            <section aria-labelledby="tools-title">
              <h2 
                id="tools-title"
                className="text-2xl font-heading font-semibold text-text-primary mb-6"
              >
                {currentLanguage === 'es' ? 'Herramientas de Accesibilidad' : 
                 currentLanguage === 'fr' ? 'Outils d\'Accessibilité' :
                 currentLanguage === 'de' ? 'Barrierefreiheits-Tools' :
                 currentLanguage === 'zh' ? '无障碍工具' : 'Accessibility Tools'}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {accessibilityTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>

            {/* Two Column Layout for Status and Voice Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatusIndicator />
              <VoiceNavigationPanel />
            </div>

            {/* Emergency Section */}
            <EmergencySection />
          </div>
        </main>

        {/* Emergency Access Panel */}
        <EmergencyAccessPanel />
      </div>
    </>
  );
};

export default AccessibleDashboardControlCenter;