import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceNavigationPanel = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Check if voice is enabled
    const voiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    setIsVoiceEnabled(voiceEnabled);

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const voiceCommands = [
    {
      command: currentLanguage === 'es' ? 'abrir voz a texto' : 
               currentLanguage === 'fr' ? 'ouvrir voix vers texte' :
               currentLanguage === 'de' ? 'öffne sprache zu text' :
               currentLanguage === 'zh' ? '打开语音转文字' : 'open voice to text',
      action: 'voice-to-text',
      description: currentLanguage === 'es' ? 'Abre la herramienta de conversión de voz a texto' : 
                   currentLanguage === 'fr' ? 'Ouvre l\'outil de conversion voix vers texte' :
                   currentLanguage === 'de' ? 'Öffnet das Sprache-zu-Text-Konvertierungstool' :
                   currentLanguage === 'zh' ? '打开语音转文字转换工具' : 'Opens the voice-to-text conversion tool'
    },
    {
      command: currentLanguage === 'es' ? 'abrir lenguaje de señas' : 
               currentLanguage === 'fr' ? 'ouvrir langue des signes' :
               currentLanguage === 'de' ? 'öffne gebärdensprache' :
               currentLanguage === 'zh' ? '打开手语' : 'open sign language',
      action: 'sign-language',
      description: currentLanguage === 'es' ? 'Abre la herramienta de reconocimiento de lenguaje de señas' : 
                   currentLanguage === 'fr' ? 'Ouvre l\'outil de reconnaissance de la langue des signes' :
                   currentLanguage === 'de' ? 'Öffnet das Gebärdensprache-Erkennungstool' :
                   currentLanguage === 'zh' ? '打开手语识别工具' : 'Opens the sign language recognition tool'
    },
    {
      command: currentLanguage === 'es' ? 'abrir configuración' : 
               currentLanguage === 'fr' ? 'ouvrir paramètres' :
               currentLanguage === 'de' ? 'öffne einstellungen' :
               currentLanguage === 'zh' ? '打开设置' : 'open settings',
      action: 'settings',
      description: currentLanguage === 'es' ? 'Abre la configuración de accesibilidad' : 
                   currentLanguage === 'fr' ? 'Ouvre les paramètres d\'accessibilité' :
                   currentLanguage === 'de' ? 'Öffnet die Barrierefreiheits-Einstellungen' :
                   currentLanguage === 'zh' ? '打开无障碍设置' : 'Opens accessibility settings'
    },
    {
      command: currentLanguage === 'es' ? 'ayuda' : 
               currentLanguage === 'fr' ? 'aide' :
               currentLanguage === 'de' ? 'hilfe' :
               currentLanguage === 'zh' ? '帮助' : 'help',
      action: 'help',
      description: currentLanguage === 'es' ? 'Muestra información de ayuda y comandos disponibles' : 
                   currentLanguage === 'fr' ? 'Affiche les informations d\'aide et les commandes disponibles' :
                   currentLanguage === 'de' ? 'Zeigt Hilfeinformationen und verfügbare Befehle' :
                   currentLanguage === 'zh' ? '显示帮助信息和可用命令' : 'Shows help information and available commands'
    }
  ];

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'es' ? 'es-ES' : 
                        currentLanguage === 'fr' ? 'fr-FR' :
                        currentLanguage === 'de' ? 'de-DE' :
                        currentLanguage === 'zh' ? 'zh-CN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setLastCommand(command);
        processVoiceCommand(command);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser');
    }
  };

  const processVoiceCommand = (command) => {
    const matchedCommand = voiceCommands.find(cmd => 
      command.includes(cmd.command.toLowerCase())
    );

    if (matchedCommand) {
      // Voice feedback
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const response = currentLanguage === 'es' ? `Ejecutando: ${matchedCommand.command}` : 
                        currentLanguage === 'fr' ? `Exécution: ${matchedCommand.command}` :
                        currentLanguage === 'de' ? `Ausführung: ${matchedCommand.command}` :
                        currentLanguage === 'zh' ? `执行: ${matchedCommand.command}` : `Executing: ${matchedCommand.command}`;
        const utterance = new SpeechSynthesisUtterance(response);
        speechSynthesis.speak(utterance);
      }

      // Execute command action
      switch (matchedCommand.action) {
        case 'voice-to-text':
          window.location.href = '/voice-to-text-conversion-studio';
          break;
        case 'sign-language':
          window.location.href = '/sign-language-recognition-interface';
          break;
        case 'settings':
          window.location.href = '/accessibility-settings-personalization';
          break;
        case 'help':
          showHelpDialog();
          break;
        default:
          break;
      }
    } else {
      // Voice feedback for unrecognized command
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const response = currentLanguage === 'es' ? 'Comando no reconocido. Intente de nuevo.' : 
                        currentLanguage === 'fr' ? 'Commande non reconnue. Essayez à nouveau.' :
                        currentLanguage === 'de' ? 'Befehl nicht erkannt. Versuchen Sie es erneut.' :
                        currentLanguage === 'zh' ? '命令未识别。请重试。' : 'Command not recognized. Please try again.';
        const utterance = new SpeechSynthesisUtterance(response);
        speechSynthesis.speak(utterance);
      }
    }
  };

  const showHelpDialog = () => {
    const helpText = voiceCommands.map(cmd => `"${cmd.command}" - ${cmd.description}`).join('\n');
    alert(`Available voice commands:\n\n${helpText}`);
  };

  return (
    <section 
      className="bg-surface rounded-lg border border-border p-6 shadow-sm"
      aria-labelledby="voice-nav-title"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 
          id="voice-nav-title"
          className="text-xl font-heading font-semibold text-text-primary"
        >
          {currentLanguage === 'es' ? 'Navegación por Voz' : 
           currentLanguage === 'fr' ? 'Navigation Vocale' :
           currentLanguage === 'de' ? 'Sprachnavigation' :
           currentLanguage === 'zh' ? '语音导航' : 'Voice Navigation'}
        </h2>
        <Icon name="Mic" size={20} className="text-primary" />
      </div>

      <div className="space-y-4">
        {/* Voice control button */}
        <div className="flex items-center justify-center">
          <Button
            variant={isListening ? "accent" : "primary"}
            size="lg"
            onClick={startListening}
            disabled={isListening}
            className="touch-target"
            aria-label={
              isListening 
                ? (currentLanguage === 'es' ? 'Escuchando comando de voz' : 
                   currentLanguage === 'fr' ? 'Écoute de commande vocale' :
                   currentLanguage === 'de' ? 'Sprachbefehl wird gehört' :
                   currentLanguage === 'zh' ? '正在听语音命令' : 'Listening for voice command')
                : (currentLanguage === 'es' ? 'Iniciar comando de voz' : 
                   currentLanguage === 'fr' ? 'Démarrer commande vocale' :
                   currentLanguage === 'de' ? 'Sprachbefehl starten' :
                   currentLanguage === 'zh' ? '开始语音命令' : 'Start voice command')
            }
          >
            <Icon 
              name={isListening ? "MicOff" : "Mic"} 
              size={20} 
              className={isListening ? "animate-pulse" : ""}
            />
            <span className="ml-2">
              {isListening 
                ? (currentLanguage === 'es' ? 'Escuchando...' : 
                   currentLanguage === 'fr' ? 'Écoute...' :
                   currentLanguage === 'de' ? 'Hört zu...' :
                   currentLanguage === 'zh' ? '正在听...' : 'Listening...')
                : (currentLanguage === 'es' ? 'Hablar Comando' : 
                   currentLanguage === 'fr' ? 'Parler Commande' :
                   currentLanguage === 'de' ? 'Befehl Sprechen' :
                   currentLanguage === 'zh' ? '说出命令' : 'Speak Command')
              }
            </span>
          </Button>
        </div>

        {/* Last command display */}
        {lastCommand && (
          <div className="p-3 rounded-lg bg-primary-50 border border-primary-200">
            <div className="flex items-center space-x-2">
              <Icon name="MessageSquare" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary-700">
                {currentLanguage === 'es' ? 'Último comando:' : 
                 currentLanguage === 'fr' ? 'Dernière commande:' :
                 currentLanguage === 'de' ? 'Letzter Befehl:' :
                 currentLanguage === 'zh' ? '最后命令:' : 'Last command:'}
              </span>
            </div>
            <p className="text-sm text-primary-600 mt-1 font-mono">
              "{lastCommand}"
            </p>
          </div>
        )}

        {/* Available commands */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">
            {currentLanguage === 'es' ? 'Comandos Disponibles:' : 
             currentLanguage === 'fr' ? 'Commandes Disponibles:' :
             currentLanguage === 'de' ? 'Verfügbare Befehle:' :
             currentLanguage === 'zh' ? '可用命令:' : 'Available Commands:'}
          </h3>
          <div className="space-y-2">
            {voiceCommands.map((cmd, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg bg-surface-secondary border border-border"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="Volume2" size={14} className="text-text-secondary" />
                  <span className="text-sm font-mono text-primary">
                    "{cmd.command}"
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  {cmd.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Help button */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={showHelpDialog}
            className="text-text-secondary hover:text-primary"
          >
            <Icon name="HelpCircle" size={16} />
            <span className="ml-2">
              {currentLanguage === 'es' ? 'Ver Todos los Comandos' : 
               currentLanguage === 'fr' ? 'Voir Toutes les Commandes' :
               currentLanguage === 'de' ? 'Alle Befehle Anzeigen' :
               currentLanguage === 'zh' ? '查看所有命令' : 'View All Commands'}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VoiceNavigationPanel;