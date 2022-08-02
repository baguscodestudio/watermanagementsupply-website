import { Listbox } from '@headlessui/react';
import React, { Fragment } from 'react';
import { ChevronDown } from 'styled-icons/fluentui-system-regular';

const SelectLabel: React.FC<{
  title: string;
  value: string;
  onChange: any;
  className?: string;
  list: string[];
}> = ({ value, onChange, list, className, title }) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        <Listbox.Button
          className={`w-full px-2 py-1 border-gray-200 border-[1px] bg-gray-100 flex flex-col`}
        >
          <span className="text-sm text-gray-500 text-left">{title}</span>
          <div className="inline-flex items-center">
            {value}
            <ChevronDown size="20" className="ml-4" />
          </div>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 bg-gray-200 shadow-lg rounded-md p-1">
          {list.map((data, index) => (
            <Listbox.Option key={index} as={Fragment} value={data}>
              {({ selected }) => (
                <div
                  className={`px-4 py-1 rounded-lg transition-colors hover:bg-gray-500 hover:text-white hover:cursor-pointer
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