
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Index = () => {
  const languages = [
    { code: 'en', name: 'English Assessment', description: 'Take the assessment in English' },
    { code: 'zh-cn', name: '简体中文测评', description: '用简体中文进行测评' },
    { code: 'zh-tw', name: '繁體中文測評', description: '用繁體中文進行測評' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Select Assessment Language</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {languages.map((lang) => (
            <Link key={lang.code} to={`/${lang.code}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Embed Links</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">English Version:</h3>
              <code className="block p-3 bg-gray-100 rounded">
                {`<iframe src="${window.location.origin}/en" width="100%" height="800" frameborder="0"></iframe>`}
              </code>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Simplified Chinese Version:</h3>
              <code className="block p-3 bg-gray-100 rounded">
                {`<iframe src="${window.location.origin}/zh-cn" width="100%" height="800" frameborder="0"></iframe>`}
              </code>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Traditional Chinese Version:</h3>
              <code className="block p-3 bg-gray-100 rounded">
                {`<iframe src="${window.location.origin}/zh-tw" width="100%" height="800" frameborder="0"></iframe>`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
