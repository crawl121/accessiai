import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import UserRegistrationProfileSetup from "pages/user-registration-profile-setup";
import LoginAuthentication from "pages/login-authentication";
import VoiceToTextConversionStudio from "pages/voice-to-text-conversion-studio";
import AccessibleDashboardControlCenter from "pages/accessible-dashboard-control-center";
import SignLanguageRecognitionInterface from "pages/sign-language-recognition-interface";
import AccessibilitySettingsPersonalization from "pages/accessibility-settings-personalization";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<AccessibleDashboardControlCenter />} />
        <Route path="/user-registration-profile-setup" element={<UserRegistrationProfileSetup />} />
        <Route path="/login-authentication" element={<LoginAuthentication />} />
        <Route path="/voice-to-text-conversion-studio" element={<VoiceToTextConversionStudio />} />
        <Route path="/accessible-dashboard-control-center" element={<AccessibleDashboardControlCenter />} />
        <Route path="/sign-language-recognition-interface" element={<SignLanguageRecognitionInterface />} />
        <Route path="/accessibility-settings-personalization" element={<AccessibilitySettingsPersonalization />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;