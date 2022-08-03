import React from 'react';
import { Combobox } from '@headlessui/react';
import { Selector } from '@styled-icons/heroicons-outline/Selector';

const ComboboxLabel: React.FC<{
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  filtered: string[];
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  title: string;
  required?: boolean;
}> = ({
  selected,
  title,
  required,
  className,
  setSelected,
  filtered,
  setQuery,
}) => {
  return (
    <Combobox
      value={selected}
      onChange={setSelected}
      as="div"
      className={`${className}`}
    >
      <div className="relative mt-1">
        <div className="px-2 py-1 border-gray-200 border-[1px] bg-gray-100 flex flex-col">
          <span className="text-sm text-gray-500 text-left">
            {title}
            {required && <span className="text-red-500">*</span>}
          </span>
          <div className="inline-flex items-center">
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              className="bg-transparent outline-none w-4/5"
            />
            <Combobox.Button className="h-full ml-auto">
              <Selector className="w-4" />
            </Combobox.Button>
          </div>
        </div>

        <Combobox.Options className="absolute mt-1 bg-gray-200 shadow-lg rounded-md p-1 z-10 right-0 min-w-[5rem]">
          {filtered &&
            filtered.map((text) => (
              <Combobox.Option
                key={text}
                value={text}
                className={`px-4 py-1 rounded-lg transition-colors hover:bg-gray-500 hover:text-white hover:cursor-pointer`}
              >
                {text}
              </Combobox.Option>
            ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default ComboboxLabel;
