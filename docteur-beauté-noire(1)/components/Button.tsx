import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "px-8 py-3.5 rounded-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm";
  
  const variants = {
    // Primary: Gold background, Charcoal text
    primary: "bg-gold text-charcoal hover:bg-goldLight focus:ring-gold shadow-md",
    // Secondary: Charcoal background, Gold text
    secondary: "bg-charcoal text-gold hover:bg-charcoalLight focus:ring-charcoal shadow-md",
    // Outline: Gold border, Gold text
    outline: "border border-gold text-charcoal hover:bg-gold hover:text-charcoal",
    // Ghost: Subtle hover
    ghost: "text-charcoal/60 hover:text-charcoal hover:bg-black/5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          ...
        </span>
      ) : children}
    </button>
  );
};

export default Button;