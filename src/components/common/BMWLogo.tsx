import React from 'react';

interface BMWLogoProps {
  className?: string;
  size?: number;
}

export const BMWLogo: React.FC<BMWLogoProps> = ({ className = 'w-11 h-11', size }) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <div
      className={`relative rounded-full border border-white/20 p-0.5 group-hover:scale-105 transition-transform duration-300 shrink-0 ${className}`}
      style={style}
    >
      <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" fill="#000000" r="48" stroke="white" strokeWidth="3" />
        <circle cx="50" cy="50" r="34" stroke="white" strokeWidth="1.5" />
        <path d="M50 16 A34 34 0 0 1 84 50 L50 50 Z" fill="#0066b1" />
        <path d="M50 84 A34 34 0 0 1 16 50 L50 50 Z" fill="#0066b1" />
        <path d="M16 50 A34 34 0 0 1 50 16 L50 50 Z" fill="#ffffff" />
        <path d="M84 50 A34 34 0 0 1 50 84 L50 50 Z" fill="#ffffff" />
        <text fill="white" fontFamily="sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle" x="50" y="11">
          BMW
        </text>
      </svg>
    </div>
  );
};
