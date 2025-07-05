import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const StatusIndicator = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('accessibility-language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Initialize AI services status
    const aiServices = [
      {
        id: 'speech-recognition',
        name: currentLanguage === 'es' ? 'Reconocimiento de Voz' : 
              currentLanguage === 'fr' ? 'Reconnaissance Vocale' :
              currentLanguage === 'de' ? 'Spracherkennung' :
              currentLanguage === 'zh' ? '语音识别' : 'Speech Recognition',
        status: 'active',
        lastUpdate: new Date().toLocaleTimeString()
      },
      {
        id: 'computer-vision',
        name: currentLanguage === 'es' ? 'Visión por Computadora' : 
              currentLanguage === 'fr' ? 'Vision par Ordinateur' :
              currentLanguage === 'de' ? 'Computer Vision' :
              currentLanguage === 'zh' ? '计算机视觉' : 'Computer Vision',
        status: 'active',
        lastUpdate: new Date().toLocaleTimeString()
      },
      {
        id: 'natural-language',
        name: currentLanguage === 'es' ? 'Procesamiento de Lenguaje' : 
              currentLanguage === 'fr' ? 'Traitement du Langage' :
              currentLanguage === 'de' ? 'Sprachverarbeitung' :
              currentLanguage === 'zh' ? '自然语言处理' : 'Natural Language Processing',
        status: 'loading',
        lastUpdate: new Date().toLocaleTimeString()
      },
      {
        id: 'gesture-recognition',
        name: currentLanguage === 'es' ? 'Reconocimiento de Gestos' : 
              currentLanguage === 'fr' ? 'Reconnaissance de Gestes' :
              currentLanguage === 'de' ? 'Gestenerkennung' :
              currentLanguage === 'zh' ? '手势识别' : 'Gesture Recognition',
        status: 'inactive',
        lastUpdate: new Date().toLocaleTimeString()
      }
    ];

    setServices(aiServices);

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, [currentLanguage]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'loading':
        return { icon: 'Clock', color: 'text-warning' };
      case 'inactive':
        return { icon: 'XCircle', color: 'text-text-tertiary' };
      default:
        return { icon: 'AlertCircle', color: 'text-accent' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return currentLanguage === 'es' ? 'Activo' : 
               currentLanguage === 'fr' ? 'Actif' :
               currentLanguage === 'de' ? 'Aktiv' :
               currentLanguage === 'zh' ? '活跃' : 'Active';
      case 'loading':
        return currentLanguage === 'es' ? 'Cargando' : 
               currentLanguage === 'fr' ? 'Chargement' :
               currentLanguage === 'de' ? 'Laden' :
               currentLanguage === 'zh' ? '加载中' : 'Loading';
      case 'inactive':
        return currentLanguage === 'es' ? 'Inactivo' : 
               currentLanguage === 'fr' ? 'Inactif' :
               currentLanguage === 'de' ? 'Inaktiv' :
               currentLanguage === 'zh' ? '非活跃' : 'Inactive';
      default:
        return currentLanguage === 'es' ? 'Error' : 
               currentLanguage === 'fr' ? 'Erreur' :
               currentLanguage === 'de' ? 'Fehler' :
               currentLanguage === 'zh' ? '错误' : 'Error';
    }
  };

  return (
    <section 
      className="bg-surface rounded-lg border border-border p-6 shadow-sm"
      aria-labelledby="status-title"
      aria-live="polite"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 
          id="status-title"
          className="text-xl font-heading font-semibold text-text-primary"
        >
          {currentLanguage === 'es' ? 'Estado de Servicios AI' : 
           currentLanguage === 'fr' ? 'État des Services IA' :
           currentLanguage === 'de' ? 'KI-Dienste Status' :
           currentLanguage === 'zh' ? 'AI服务状态' : 'AI Services Status'}
        </h2>
        <Icon name="Activity" size={20} className="text-primary" />
      </div>

      <div className="space-y-4">
        {services.map((service) => {
          const statusInfo = getStatusIcon(service.status);
          
          return (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 rounded-lg bg-surface-secondary border border-border"
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={statusInfo.icon} 
                  size={20} 
                  className={`${statusInfo.color} ${service.status === 'loading' ? 'animate-spin' : ''}`}
                />
                <div>
                  <h3 className="font-medium text-text-primary text-sm">
                    {service.name}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {currentLanguage === 'es' ? 'Última actualización:' : 
                     currentLanguage === 'fr' ? 'Dernière mise à jour:' :
                     currentLanguage === 'de' ? 'Letzte Aktualisierung:' :
                     currentLanguage === 'zh' ? '最后更新:' : 'Last updated:'} {service.lastUpdate}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                  {getStatusText(service.status)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-primary-50 border border-primary-200">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm text-primary-700 font-medium">
            {currentLanguage === 'es' ? 'Información del Sistema' : 
             currentLanguage === 'fr' ? 'Informations Système' :
             currentLanguage === 'de' ? 'System-Information' :
             currentLanguage === 'zh' ? '系统信息' : 'System Information'}
          </span>
        </div>
        <p className="text-sm text-primary-600 mt-1">
          {currentLanguage === 'es' ? 'Todos los servicios AI están funcionando correctamente. Los tiempos de respuesta son óptimos.' : 
           currentLanguage === 'fr' ? 'Tous les services IA fonctionnent correctement. Les temps de réponse sont optimaux.' :
           currentLanguage === 'de' ? 'Alle KI-Dienste funktionieren ordnungsgemäß. Die Antwortzeiten sind optimal.' :
           currentLanguage === 'zh' ? '所有AI服务正常运行。响应时间最佳。' : 'All AI services are functioning properly. Response times are optimal.'}
        </p>
      </div>
    </section>
  );
};

export default StatusIndicator;