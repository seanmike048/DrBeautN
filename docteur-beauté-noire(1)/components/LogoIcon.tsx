import React from 'react';

interface LogoIconProps {
  className?: string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ className = "w-10 h-10" }) => {
  return (
    <img 
      src="/Croix.png" 
      alt="Docteur Beauté Noire Cross" 
      className={`object-contain ${className}`}
    />
  );
};

export default LogoIcon;