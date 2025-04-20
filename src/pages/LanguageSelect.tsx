
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LanguageSelect = () => {
  const navigate = useNavigate();
  const languages = [
    { code: 'en', name: 'English', description: 'Take the assessment in English' },
    { code: 'zh-cn', name: '简体中文', description: '用简体中文进行测评' },
    { code: 'zh-hk', name: '粵語', description: '用粵語進行測評' }
  ];

  const handleLanguageSelect = (langCode: string) => {
    localStorage.setItem('selectedLanguage', langCode);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Select Language | 选择语言 | 選擇語言</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {languages.map((lang) => (
            <Card 
              key={lang.code} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <CardHeader>
                <CardTitle>{lang.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{lang.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
