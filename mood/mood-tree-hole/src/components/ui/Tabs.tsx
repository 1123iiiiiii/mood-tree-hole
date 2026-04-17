import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className = '' }) => {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <div className="flex space-x-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement, {
              selected: child.props.value === value,
              onSelect: onValueChange,
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};

interface TabProps {
  value: string;
  label: string;
  selected?: boolean;
  onSelect?: (value: string) => void;
  className?: string;
}

export const Tab: React.FC<TabProps> = ({ value, label, selected = false, onSelect, className = '' }) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${selected
        ? 'border-primary text-primary'
        : 'border-transparent text-text-secondary hover:text-primary hover:border-gray-300'
        } ${className}`}
      onClick={() => onSelect?.(value)}
    >
      {label}
    </button>
  );
};
