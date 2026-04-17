import React from 'react';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
      <input
        type="text"
        className={`
          w-full px-3 py-2 border rounded-lg
          ${error ? 'border-red-300' : 'border-gray-200'}
          focus:outline-none focus:ring-2 focus:ring-primary/50
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export interface TextAreaProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  rows = 3,
  value,
  onChange,
  error,
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
      <textarea
        className={`
          w-full px-3 py-2 border rounded-lg resize-none
          ${error ? 'border-red-300' : 'border-gray-200'}
          focus:outline-none focus:ring-2 focus:ring-primary/50
        `}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
