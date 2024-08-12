import { Menu, MenuItem, MenuItems } from "@headlessui/react";
export default function DropdownPage({ children, trigger }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {trigger}
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {children}
      </MenuItems>
    </Menu>
  );
}

export function DropdownPageItem({ children }) {
  return (
    <div className="py-1">
      <MenuItem>
        <a
          href="#"
          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
        >
          {children}
        </a>
      </MenuItem>
    </div>
  );
}
