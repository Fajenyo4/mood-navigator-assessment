
import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

interface MoodIconProps {
  iconType: 'smile' | 'meh' | 'frown';
  iconColor: string;
}

const MoodIcon: React.FC<MoodIconProps> = ({ iconType, iconColor }) => {
  const className = `w-12 h-12 ${iconColor}`;
  
  switch (iconType) {
    case 'smile':
      return <Smile className={className} />;
    case 'meh':
      return <Meh className={className} />;
    case 'frown':
      return <Frown className={className} />;
    default:
      return <Smile className={className} />;
  }
};

export default MoodIcon;
