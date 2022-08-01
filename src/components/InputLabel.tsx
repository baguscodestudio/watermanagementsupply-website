import React from 'react';

const InputLabel: React.FC<{
  label: string;
  className?: string;
  value?: string | number;
  disabled?: boolean;
  type?: string;
  pattern?: string;
  required?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}> = ({
  label,
  disabled,
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
      <span className="text-sm text-gray-500">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      <input
        className="bg-transparent outline-none"
        type={type}
        disabled={disabled}
        value={value}
        pattern={pattern}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default InputLabel;
