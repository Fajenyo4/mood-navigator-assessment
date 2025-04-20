
import React from 'react';

interface ResultMessageProps {
  message: string;
}

const ResultMessage: React.FC<ResultMessageProps> = ({ message }) => {
  return (
    <div className="space-y-4 text-left w-full">
      {message.split('\n').map((line, index) => (
        <p key={index} className="text-sm text-gray-700 mb-2">{line}</p>
      ))}
    </div>
  );
};

export default ResultMessage;
