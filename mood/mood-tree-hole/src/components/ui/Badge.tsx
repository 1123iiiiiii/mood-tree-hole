import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
}) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={`
        px-2 py-1 rounded-full text-xs font-medium
        ${variantStyles[variant as keyof typeof variantStyles]}
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
