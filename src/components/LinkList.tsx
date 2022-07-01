import { Menu } from "@headlessui/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { TriangleUp } from "@styled-icons/entypo/TriangleUp";
import { TriangleDown } from "@styled-icons/entypo/TriangleDown";
import { UserContext } from "../App";

interface LinkType {
  title: string;
  roles: string[];
  items: {
    roles: string[];
    label: string;
    path: string;
  }[];
}

const LinkList: React.FC<LinkType> = ({ title, roles, items }) => {
  const { user } = useContext(UserContext);

  if (roles.includes(user.staffRole))
    return (
      <Menu as="div" className="relative h-full">
        {({ open }) => (
          <>
            <Menu.Button className="h-full flex items-center mx-4 justify-center hover:text-[#0e6e4b]">
              {open ? (
                <div>
                  {title} <TriangleDown size="16" />
                </div>
              ) : (
                <div>
                  {title} <TriangleUp size="16" />
                </div>
              )}
            </Menu.Button>
            <Menu.Items className="absolute origin-top-left bg-white text-left text-black rounded-b-md">
              <div className="p-1">
                {items.map((item, index) => {
                  if (item.roles.includes(user.staffRole))
                    return (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <Link
                            className={`${
                              active && "bg-emerald-500 text-white"
                            } flex px-2 py-1 w-32 divide-y divide-gray-100 rounded-sm`}
                            to={item.path}
                          >
                            {item.label}
                          </Link>
                        )}
                      </Menu.Item>
                    );
                })}
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
    );
  else return null;
};

export default LinkList;
