import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, currentLanguage }) => {
  const steps = [
    {
      id: 1,
      title: currentLanguage === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information',
      description: currentLanguage === 'hi' ? 'बुनियादी खाता विवरण' : 'Basic account details'
    },
    {
      id: 2,
      title: currentLanguage === 'hi' ? 'पहुंच प्रोफाइल' : 'Accessibility Profile',
      description: currentLanguage === 'hi' ? 'आपकी आवश्यकताएं' : 'Your needs'
    },
    {
      id: 3,
      title: currentLanguage === 'hi' ? 'सेटअप पूरा' : 'Setup Complete',
      description: currentLanguage === 'hi' ? 'खाता तैयार' : 'Account ready'
    }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-green-500 text-white border-green-500',
          line: 'bg-green-500',
          text: 'text-green-600',
          description: 'text-green-500'
        };
      case 'current':
        return {
          circle: 'bg-blue-500 text-white border-blue-500',
          line: 'bg-gray-300',
          text: 'text-blue-600',
          description: 'text-blue-500'
        };
      default:
        return {
          circle: 'bg-gray-100 text-gray-400 border-gray-300',
          line: 'bg-gray-300',
          text: 'text-gray-400',
          description: 'text-gray-400'
        };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-heading font-semibold text-gray-900 mb-6">
        {currentLanguage === 'hi' ? 'पंजीकरण प्रगति' : 'Registration Progress'}
      </h2>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-300" aria-hidden="true">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const classes = getStepClasses(status);
            
            return (
              <div 
                key={step.id}
                className="flex flex-col items-center"
                role="listitem"
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {/* Step circle */}
                <div 
                  className={`
                    relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 ease-out
                    ${classes.circle}
                  `}
                  aria-label={`Step ${step.id}: ${step.title}`}
                >
                  {status === 'completed' ? (
                    <Icon name="Check" size={16} />
                  ) : status === 'current' ? (
                    <span className="text-sm font-semibold">{step.id}</span>
                  ) : (
                    <span className="text-sm">{step.id}</span>
                  )}
                </div>

                {/* Step content */}
                <div className="mt-3 text-center max-w-24">
                  <h3 className={`text-sm font-medium ${classes.text}`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs mt-1 ${classes.description}`}>
                    {step.description}
                  </p>
                </div>

                {/* Status indicator for screen readers */}
                <span className="sr-only">
                  {status === 'completed' && (currentLanguage === 'hi' ? 'पूरा हुआ' : 'Completed')}
                  {status === 'current' && (currentLanguage === 'hi' ? 'वर्तमान चरण' : 'Current step')}
                  {status === 'upcoming' && (currentLanguage === 'hi' ? 'आगामी' : 'Upcoming')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current step details */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3">
          <Icon name="Info" size={20} className="text-blue-600" />
          <div>
            <h4 className="font-medium text-blue-900">
              {currentLanguage === 'hi' ? 'वर्तमान चरण:' : 'Current Step:'} {steps[currentStep - 1]?.title}
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              {currentStep === 1 && (
                currentLanguage === 'hi' ?'अपनी व्यक्तिगत जानकारी दर्ज करें और एक सुरक्षित खाता बनाएं।' :'Enter your personal information and create a secure account.'
              )}
              {currentStep === 2 && (
                currentLanguage === 'hi' ?'अपनी पहुंच आवश्यकताओं को कॉन्फ़िगर करें ताकि हम आपके अनुभव को व्यक्तिगत बना सकें।' :'Configure your accessibility needs so we can personalize your experience.'
              )}
              {currentStep === 3 && (
                currentLanguage === 'hi' ?'बधाई हो! आपका खाता सफलतापूर्वक बनाया गया है।' :'Congratulations! Your account has been successfully created.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Accessibility note */}
      <div className="mt-4 text-xs text-gray-500">
        <Icon name="Accessibility" size={14} className="inline mr-1" />
        {currentLanguage === 'hi' ?'आप किसी भी समय Tab कुंजी का उपयोग करके नेविगेट कर सकते हैं या आवाज कमांड का उपयोग कर सकते हैं।' :'You can navigate using Tab key or voice commands at any time.'
        }
      </div>
    </div>
  );
};

export default ProgressIndicator;