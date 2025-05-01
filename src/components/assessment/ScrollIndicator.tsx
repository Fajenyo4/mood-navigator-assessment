
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ScrollIndicator: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollBy({
      top: 300,
      behavior: 'smooth'
    });
  };

  if (!isMobile || !visible) {
    return null;
  }

  return (
    <div 
      className="flex flex-col items-center mt-4 mb-2 animate-bounce cursor-pointer" 
      onClick={handleClick}
      aria-label="Scroll down for more content"
    >
      <span className="text-xs text-gray-500 mb-1">Scroll for more</span>
      <ChevronDown className="h-6 w-6 text-gray-500" />
    </div>
  );
};

export default ScrollIndicator;
