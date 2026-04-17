import React from 'react';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <div className="text-sm font-medium text-text-primary">{label}</div>}
      <div className="flex items-center space-x-3">
        <span className="text-xs text-text-secondary">{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="
            flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:cursor-pointer
          "
        />
        <span className="text-xs text-text-secondary">{max}</span>
        <span className="text-sm font-medium text-primary min-w-[2rem] text-center">
          {value}
        </span>
      </div>
    </div>
  );
};
