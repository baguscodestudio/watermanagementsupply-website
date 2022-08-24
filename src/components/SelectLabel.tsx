import { Listbox } from '@headlessui/react';
import React, { Fragment } from 'react';
import { ChevronDown } from 'styled-icons/fluentui-system-regular';

const SelectLabel: React.FC<{
  title: string;
  value: string;
  onChange: any;
  required?: boolean;
  className?: string;
  list: string[];
}> = ({ value, onChange, list, className, required, title }) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        <Listbox.Button
          className={`w-full px-2 border-gray-200 border-[1px] bg-gray-100 flex flex-col`}
        >
          <span className="text-xs text-gray-500 text-left 2xl:text-sm">
            {title}
            {required && <span className="text-red-500">*</span>}
          </span>
          <div className="inline-flex items-center 2xl:text-base text-sm">
            {value}
            <ChevronDown size="20" className="ml-4" />
          </div>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 bg-gray-200 shadow-lg rounded-md p-1 z-10">
          {list.map((data, index) => (
            <Listbox.Option key={index} as={Fragment} value={data}>
              {({ selected }) => (
                <div
                  className={`px-4 py-1 rounded-lg transition-colors hover:bg-gray-500 hover:text-white hover:cursor-pointer 2xl:text-base text-sm
                            ${selected && 'bg-gray-500 text-white'}`}
                >
                  {data}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default SelectLabel;
