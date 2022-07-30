import { Listbox } from '@headlessui/react';
import React, { Fragment } from 'react';
import { ChevronDown } from 'styled-icons/fluentui-system-regular';

const SelectTimeFrameLabel: React.FC<{
  value: {
    label: string;
    unit: 'day' | 'month' | 'week' | 'hour';
  };
  onChange: any;
  className?: string;
  list: {
    label: string;
    unit: 'day' | 'month' | 'week' | 'hour';
  }[];
}> = ({ value, onChange, list, className }) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        <Listbox.Button className="px-2 py-1 border-gray-200 border-[1px] bg-gray-100 flex flex-col">
          <span className="text-sm text-gray-500 text-left">Mode</span>
          <div className="inline-flex items-center">
            {value.label}
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
                  {data.label}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default SelectTimeFrameLabel;