
import React from 'react';

interface ResultMessageProps {
  message: string;
  language?: string;
}

const ResultMessage: React.FC<ResultMessageProps> = ({ message, language = 'en' }) => {
  const textDirection = language.startsWith('zh') ? 'text-left' : 'text-left';
  const fontSize = language.startsWith('zh') ? 'text-base' : 'text-sm';

  return (
    <div className={`space-y-4 ${textDirection} w-full`}>
      {message.split('\n').map((line, index) => (
        <p key={index} className={`${fontSize} text-gray-700 mb-2`}>{line}</p>
      ))}
    </div>
  );
};

export default ResultMessage;

