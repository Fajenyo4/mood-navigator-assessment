
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SSOLogin from "./pages/SSOLogin";
import EasyAccess from "./pages/EasyAccess";
import LinkGenerator from "./pages/LinkGenerator";
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';
import AssessmentHistory from './components/assessment/AssessmentHistory';
import Assessment from './components/Assessment';
import { CheckAuth } from './pages/CheckAuth';
import EnglishEmbed from './pages/embeds/EnglishEmbed';
import SimplifiedChineseEmbed from './pages/embeds/SimplifiedChineseEmbed';
import TraditionalChineseEmbed from './pages/embeds/TraditionalChineseEmbed';
import AssessmentHistoryChart from './pages/AssessmentHistoryChart';
import Index from './pages/Index';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login/en" replace />} />
            <Route path="/sso-login" element={<SSOLogin />} />
            <Route path="/easy-access" element={<EasyAccess />} />
            <Route path="/generate-links" element={<LinkGenerator />} />
            <Route path="/login" element={<Navigate to="/login/en" replace />} />
            <Route path="/login/en" element={<Login language="en" />} />
            <Route path="/login/zh-cn" element={<Login language="zh-CN" />} />
            <Route path="/login/zh-hk" element={<Login language="zh-HK" />} />
            <Route path="/embed/en" element={<EnglishEmbed />} />
            <Route path="/embed/zh-cn" element={<SimplifiedChineseEmbed />} />
            <Route path="/embed/zh-tw" element={<TraditionalChineseEmbed />} />
            <Route path="/embed/en-sso" element={<EnglishEmbed sso={true} />} />
            <Route path="/embed/zh-cn-sso" element={<SimplifiedChineseEmbed sso={true} />} />
            <Route path="/embed/zh-tw-sso" element={<TraditionalChineseEmbed sso={true} />} />
            <Route path="/embed/easy-history" element={
              <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <img 
                  src="/lovable-uploads/32730d45-90eb-4971-b489-51a01e471c37.png" 
                  alt="ICAN Live Well" 
                  style={{ width: '80px', height: '80px', marginBottom: '20px' }} 
                />
                <p>Redirecting to assessment history...</p>
                <script dangerouslySetInnerHTML={{ __html: `
                  // Get the app domain from the current URL
                  const appDomain = window.location.origin;
                  
                  // Create a simple token
                  const simpleToken = btoa("public:" + Date.now());
                  
                  // Get language from URL parameter or default to English
                  const urlParams = new URLSearchParams(window.location.search);
                  const lang = urlParams.get('lang') || 'en';
                  
                  // Redirect to easy access with history view
                  window.location.href = \`\${appDomain}/easy-access?token=\${simpleToken}&view=history&lang=\${lang}\`;
                `}} />
              </div>
            } />
            <Route path="/check-auth" element={<CheckAuth />} />
            <Route 
              path="/en" 
              element={
                <ProtectedRoute>
                  <Assessment defaultLanguage="en" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/zh-cn" 
              element={
                <ProtectedRoute>
                  <Assessment defaultLanguage="zh-CN" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/zh-hk" 
              element={
                <ProtectedRoute>
                  <Assessment defaultLanguage="zh-HK" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <AssessmentHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history-chart" 
              element={
                <ProtectedRoute>
                  <AssessmentHistoryChart />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
