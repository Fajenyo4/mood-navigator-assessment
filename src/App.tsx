
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
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

// Import embed HTML content
import fs from 'fs';
import path from 'path';

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

// Create a component to serve embed HTML files
const EmbedHtml = ({ filePath }: { filePath: string }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: fs.readFileSync(path.join(__dirname, filePath), 'utf8') }} />
  );
};

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login with English as default */}
            <Route path="/" element={<Navigate to="/login/en" replace />} />
            
            {/* SSO Login route */}
            <Route path="/sso-login" element={<SSOLogin />} />
            
            {/* Easy Access route - new simplified access method */}
            <Route path="/easy-access" element={<EasyAccess />} />
            
            {/* Link Generator - admin page to create access links */}
            <Route path="/generate-links" element={<LinkGenerator />} />
            
            {/* Language-specific login routes */}
            <Route path="/login" element={<Navigate to="/login/en" replace />} />
            <Route path="/login/en" element={<Login language="en" />} />
            <Route path="/login/zh-cn" element={<Login language="zh-CN" />} />
            <Route path="/login/zh-hk" element={<Login language="zh-HK" />} />
            
            {/* Embed routes - these serve the HTML directly */}
            <Route path="/embed/en" element={<iframe src="/src/embed/en.html" style={{width: '100%', height: '100vh', border: 'none'}} />} />
            <Route path="/embed/zh-cn" element={<iframe src="/src/embed/zh-cn.html" style={{width: '100%', height: '100vh', border: 'none'}} />} />
            <Route path="/embed/zh-tw" element={<iframe src="/src/embed/zh-tw.html" style={{width: '100%', height: '100vh', border: 'none'}} />} />
            
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
