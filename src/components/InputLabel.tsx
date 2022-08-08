import React from 'react';

const InputLabel: React.FC<{
  label: string;
  className?: string;
  value?: string | number;
  disabled?: boolean;
  type?: string;
  min?: number;
  max?: number;
  pattern?: string;
  required?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}> = ({
  label,
  disabled,
  min,
  max,
  type,
  required,
  pattern,
  value,
  className,
  onChange,
}) => {
  return (
    <div
      className={`flex flex-col px-2 py-1 bg-gray-100 border-[1px] border-gray-200 ${className}`}
    >
      <span className="text-xs 2xl:text-sm text-gray-500">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      <input
        className="bg-transparent outline-none 2xl:text-base text-sm"
        type={type}
        disabled={disabled}
        min={min}
        max={max}
        value={value}
        pattern={pattern}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default InputLabel;
