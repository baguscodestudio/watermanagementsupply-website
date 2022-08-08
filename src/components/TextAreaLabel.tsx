import React from 'react';

const TextAreaLabel: React.FC<{
  label: string;
  rows?: number;
  cols?: number;
  value?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}> = ({
  label,
  disabled,
  rows,
  cols,
  required,
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
      <textarea
        disabled={disabled}
        rows={rows ? rows : 5}
        cols={cols ? cols : 50}
        className="bg-transparent outline-none 2xl:text-base text-sm"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default TextAreaLabel;
