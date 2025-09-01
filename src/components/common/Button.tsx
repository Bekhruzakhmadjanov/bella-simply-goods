import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
  
  const variants = {
    // Olive green (brown-green mix) integration
    primary: 'bg-gradient-to-r from-yellow-800 via-amber-900 to-yellow-900 hover:from-amber-900 hover:via-yellow-900 hover:to-orange-900 text-white focus:ring-yellow-600 shadow-amber-400',
    secondary: 'bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-700 hover:from-amber-700 hover:via-amber-800 hover:to-yellow-800 text-white focus:ring-amber-300 shadow-amber-200',
    outline: 'border-2 border-yellow-800 text-yellow-800 hover:bg-yellow-800 hover:text-white focus:ring-yellow-600 bg-white'
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };