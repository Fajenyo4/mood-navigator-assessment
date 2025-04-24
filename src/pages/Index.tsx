
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Index = () => {
  const languages = [
    { code: 'en', name: 'English Assessment', description: 'Take the assessment in English' },
    { code: 'zh-cn', name: '简体中文测评', description: '用简体中文进行测评' },
    { code: 'zh-hk', name: '粵語測評', description: '用粵語進行測評' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Select Assessment Language</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {languages.map((lang) => (
            <Link 
              key={lang.code} 
              to={`/${lang.code}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{lang.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{lang.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
