
import React from 'react';
import { Link } from 'react-router-dom';

const languages = [
  { code: 'en', name: 'English Login', path: '/login?lang=en' },
  { code: 'zh-cn', name: '简体中文登录', path: '/login?lang=zh-cn' },
  { code: 'zh-hk', name: '粵語登入', path: '/login?lang=zh-hk' }
];

const LanguageSelect = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
      <div className="flex flex-col gap-6 w-full max-w-xs">
        {languages.map((lang) => (
          <Link
            key={lang.code}
            to={lang.path}
            className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg text-center py-4 px-6 rounded-lg shadow transition-colors"
          >
            {lang.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelect;
