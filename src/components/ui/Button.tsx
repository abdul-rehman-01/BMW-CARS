import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1c69d4] focus-visible:ring-offset-[#080a0c]';

  const sizeClasses = {
    sm: 'text-[11px] px-3.5 py-2 rounded gap-1.5',
    md: 'text-xs px-5 py-3 rounded gap-2',
    lg: 'text-xs sm:text-sm px-6 py-3.5 rounded gap-2.5',
  }[size];

  const variantClasses = {
    primary: 'bg-[#1c69d4] hover:bg-[#0053b8] text-white shadow-sm',
    secondary: 'bg-black/50 hover:bg-white/10 backdrop-blur-sm border border-white/30 hover:border-white text-white',
    outline: 'bg-transparent border border-white/20 hover:border-white/60 text-gray-200 hover:text-white',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
