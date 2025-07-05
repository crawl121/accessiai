import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RegistrationForm = ({ onSubmit, currentLanguage, speechSynthesis }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
    }

    // Voice feedback for form completion
    const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
    if (isVoiceEnabled && 'speechSynthesis' in window && value) {
      const message = currentLanguage === 'hi' ? `${field} भरा गया` : `${field} filled`;
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.volume = 0.3;
      speechSynthesis.speak(utterance);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = currentLanguage === 'hi' ? 'पहला नाम आवश्यक है' : 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = currentLanguage === 'hi' ? 'अंतिम नाम आवश्यक है' : 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = currentLanguage === 'hi' ? 'ईमेल आवश्यक है' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = currentLanguage === 'hi' ? 'वैध ईमेल दर्ज करें' : 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = currentLanguage === 'hi' ? 'पासवर्ड आवश्यक है' : 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = currentLanguage === 'hi' ? 'पासवर्ड कम से कम 8 अक्षर का होना चाहिए' : 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = currentLanguage === 'hi' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = currentLanguage === 'hi' ? 'नियम स्वीकार करना आवश्यक है' : 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Voice feedback for errors
      const isVoiceEnabled = localStorage.getItem('accessibility-voice') === 'true';
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const message = currentLanguage === 'hi' ? 'फॉर्म में त्रुटियां हैं' : 'Form has errors';
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
  {
    name: 'firstName',
    type: 'text',
    label: currentLanguage === 'hi' ? 'पहला नाम' : 'First Name',
    placeholder: currentLanguage === 'hi' ? 'अपना पहला नाम दर्ज करें' : 'Enter your first name',
    required: true
  },
  {
    name: 'lastName',
    type: 'text',
    label: currentLanguage === 'hi' ? 'अंतिम नाम' : 'Last Name',
    placeholder: currentLanguage === 'hi' ? 'अपना अंतिम नाम दर्ज करें' : 'Enter your last name',
    required: true
  },
  {
    name: 'email',
    type: 'email',
    label: currentLanguage === 'hi' ? 'ईमेल पता' : 'Email Address',
    placeholder: currentLanguage === 'hi' ? 'आपका ईमेल पता' : 'your.email@example.com',
    required: true
  },
  {
    name: 'phoneNumber',
    type: 'tel',
    label: currentLanguage === 'hi' ? 'फोन नंबर' : 'Phone Number',
    placeholder: currentLanguage === 'hi' ? '+91 98765 43210' : '+91 98765 43210',
    required: false
  },
  {
    name: 'dateOfBirth',
    type: 'date',
    label: currentLanguage === 'hi' ? 'जन्म तिथि' : 'Date of Birth',
    placeholder: '',
    required: false
  },
  {
    name: 'password',
    type: 'password',
    label: currentLanguage === 'hi' ? 'पासवर्ड' : 'Password',
    placeholder: currentLanguage === 'hi' ? 'कम से कम 8 अक्षर' : 'At least 8 characters',
    required: true
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: currentLanguage === 'hi' ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password',
    placeholder: currentLanguage === 'hi' ? 'पासवर्ड दोबारा दर्ज करें' : 'Re-enter your password',
    required: true
  }];


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
          {currentLanguage === 'hi' ? 'खाता बनाएं' : 'Create Your Account'}
        </h2>
        <p className="text-gray-600">
          {currentLanguage === 'hi' ? 'AccessiAI में आपका स्वागत है। कृपया अपनी जानकारी दर्ज करें।' : 'Welcome to AccessiAI. Please enter your information to get started.'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((field) =>
          <div key={field.name} className={field.name === 'email' || field.name === 'password' || field.name === 'confirmPassword' ? 'md:col-span-2' : ''}>
              <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-2">

                {field.label}
                {field.required &&
              <span className="text-red-500 ml-1" aria-label="required">*</span>
              }
              </label>
              
              <Input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={`w-full ${errors[field.name] ? 'border-red-500 focus:ring-red-500' : ''}`}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              aria-invalid={errors[field.name] ? 'true' : 'false'} />

              
              {errors[field.name] &&
            <p
              id={`${field.name}-error`}
              className="mt-1 text-sm text-red-600"
              role="alert">

                  <Icon name="AlertCircle" size={16} className="inline mr-1" />
                  {errors[field.name]}
                </p>
            }
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <Input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            className="mt-1"
            aria-describedby={errors.agreeToTerms ? 'terms-error' : 'terms-description'} />

          <div className="flex-1">
            <label htmlFor="agreeToTerms" className="text-sm text-gray-700 cursor-pointer">
              {currentLanguage === 'hi' ? 'मैं नियम और शर्तों से सहमत हूं और गोपनीयता नीति को स्वीकार करता हूं।' : 'I agree to the Terms and Conditions and Privacy Policy.'
              }
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p id="terms-description" className="text-xs text-gray-500 mt-1">
              {currentLanguage === 'hi' ? 'आपकी जानकारी सुरक्षित रहेगी और केवल पहुंच सुविधाओं के लिए उपयोग की जाएगी।' : 'Your information will be kept secure and used only for accessibility features.'
              }
            </p>
            {errors.agreeToTerms &&
            <p
              id="terms-error"
              className="mt-1 text-sm text-red-600"
              role="alert">

                <Icon name="AlertCircle" size={16} className="inline mr-1" />
                {errors.agreeToTerms}
              </p>
            }
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
            loading={isSubmitting}
            className="text-lg py-3">

            <Icon name="UserPlus" size={20} />
            <span className="ml-2">
              {isSubmitting ?
              currentLanguage === 'hi' ? 'खाता बनाया जा रहा है...' : 'Creating Account...' :
              currentLanguage === 'hi' ? 'खाता बनाएं' : 'Create Account'
              }
            </span>
          </Button>
        </div>

        {/* Login Link */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {currentLanguage === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'}
            <a
              href="/login-authentication"
              className="ml-2 text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">

              {currentLanguage === 'hi' ? 'साइन इन करें' : 'Sign In'}
            </a>
          </p>
        </div>
      </form>
    </div>);

};

export default RegistrationForm;