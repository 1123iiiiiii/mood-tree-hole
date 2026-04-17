import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, onClick, className = '' }) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border border-gray-100
        p-4
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
