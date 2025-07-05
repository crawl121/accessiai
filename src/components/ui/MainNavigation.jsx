import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MainNavigation = ({ isOpen, onClose, speechSynthesis }) => {
  const location = useLocation();
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

  const navigationItems = [
  {
    label: currentLanguage === 'es' ? 'Panel de Control' :
    currentLanguage === 'fr' ? 'Tableau de Bord' :
    currentLanguage === 'de' ? 'Dashboard' :
    currentLanguage === 'zh' ? '仪表板' : 'Dashboard',
    path: '/accessible-dashboard-control-center',
    icon: 'LayoutDashboard',
    description: 'Central access point for all AI-powered accessibility tools',
    emergencyAccess: false
  },
  {
    label: currentLanguage === 'es' ? 'Herramientas de Voz' :
    currentLanguage === 'fr' ? 'Outils Vocaux' :
    currentLanguage === 'de' ? 'Sprach-Tools' :
    currentLanguage === 'zh' ? '语音工具' : 'Voice Tools',
    path: '/voice-to-text-conversion-studio',
    icon: 'Mic',
    description: 'Voice-to-text conversion and speech recognition tools',
    emergencyAccess: true
  },
  {
    label: currentLanguage === 'es' ? 'Herramientas Visuales' :
    currentLanguage === 'fr' ? 'Outils Visuels' :
    currentLanguage === 'de' ? 'Visuelle Tools' :
    currentLanguage === 'zh' ? '视觉工具' : 'Visual Tools',
    path: '/sign-language-recognition-interface',
    icon: 'Hand',
    description: 'Sign language recognition and visual communication tools',
    emergencyAccess: true
  },
  {
    label: currentLanguage === 'es' ? 'Configuración' :
    currentLanguage === 'fr' ? 'Paramètres' :
    currentLanguage === 'de' ? 'Einstellungen' :
    currentLanguage === 'zh' ? '设置' : 'Settings',
    path: '/accessibility-settings-personalization',
    icon: 'Settings',
    description: 'Personalize accessibility preferences and configurations',
    emergencyAccess: false
  },
  {
    label: currentLanguage === 'es' ? 'Perfil' :
    currentLanguage === 'fr' ? 'Profil' :
    currentLanguage === 'de' ? 'Profil' :
    currentLanguage === 'zh' ? '个人资料' : 'Profile',
    path: '/user-registration-profile-setup',
    icon: 'User',
    description: 'Manage your profile and account settings',
    emergencyAccess: false
  }];


  const handleNavigation = (path, label) => {
    navigate(path);
    onClose?.();

    // Voice feedback if enabled
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Navigating to ${label}`);
      speechSynthesis.speak(utterance);
    }
  };

  const handleKeyDown = (event, path, label) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(path, label);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen &&
      <div
        className="nav-overlay"
        onClick={onClose}
        aria-hidden="true" />

      }

      {/* Navigation sidebar */}
      <nav
        className={`main-navigation ${isOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Main navigation">

        <div className="flex flex-col h-full">
          {/* Navigation header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <Icon name="Accessibility" size={28} className="text-primary" />
              <div>
                <h2 className="font-heading font-semibold text-lg text-text-primary">
                  AccessiAI
                </h2>
                <p className="text-sm text-text-secondary">
                  {currentLanguage === 'es' ? 'Herramientas de Accesibilidad' :
                  currentLanguage === 'fr' ? 'Outils d\'Accessibilité' :
                  currentLanguage === 'de' ? 'Barrierefreiheits-Tools' :
                  currentLanguage === 'zh' ? '无障碍工具' : 'Accessibility Tools'}
                </p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="lg:hidden touch-target">

              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Navigation items */}
          <div className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-2 px-4" role="list">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path, item.label)}
                      onKeyDown={(e) => handleKeyDown(e, item.path, item.label)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                        transition-all duration-200 ease-out touch-target
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${isActive ?
                      'bg-primary text-primary-foreground shadow-sm' :
                      'text-text-primary hover:bg-surface-secondary hover:text-primary'}
                      `
                      }
                      aria-current={isActive ? 'page' : undefined}
                      aria-describedby={`nav-desc-${item.path}`}>

                      <Icon
                        name={item.icon}
                        size={20}
                        className={isActive ? 'text-primary-foreground' : 'text-text-secondary'} />

                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-base block truncate">
                          {item.label}
                        </span>
                        <span
                          id={`nav-desc-${item.path}`}
                          className={`text-sm block truncate ${
                          isActive ? 'text-primary-100' : 'text-text-secondary'}`
                          }>

                          {item.description}
                        </span>
                      </div>
                      {item.emergencyAccess &&
                      <Icon
                        name="AlertTriangle"
                        size={16}
                        className={`${isActive ? 'text-primary-200' : 'text-warning'}`}
                        aria-label="Emergency access available" />

                      }
                    </button>
                  </li>);

              })}
            </ul>
          </div>

          {/* Navigation footer */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('/login-authentication', 'Login')}
                className="touch-target">

                <Icon name="LogOut" size={16} />
                <span className="ml-2">
                  {currentLanguage === 'es' ? 'Cerrar Sesión' :
                  currentLanguage === 'fr' ? 'Se Déconnecter' :
                  currentLanguage === 'de' ? 'Abmelden' :
                  currentLanguage === 'zh' ? '登出' : 'Sign Out'}
                </span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('emergencyAccess'));
                }}
                aria-label="Emergency accessibility tools"
                className="touch-target">

                <Icon name="Phone" size={16} className="text-accent" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>);

};

export default MainNavigation;