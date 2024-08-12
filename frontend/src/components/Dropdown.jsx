import { useState } from "react";
import useClickOutside from "../hooks/useClickOutside";

export default function Dropdown({ children, trigger }) {
  const [show, setShow] = useState(false);
  const dropRef = useClickOutside(() => setShow(false));

  return (
    <div
      className="w-fit relative"
      onClick={() => setShow((current) => !current)}
      ref={dropRef}
    >
      <div>{trigger}</div>
      {show && (
        <div className="fixed">
          <ul
            className={`
            min-w-max absolute right-0 bottom-0
            bg-white divide-y divide-gray-100 rounded-lg shadow
            overflow-hidden`}
          >
            {children}
          </ul>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children }) {
  return (
    <li
      className={`
        flex gap-3 text-xs px-4 py-2 
        text-indigo-800 hover:bg-indigo-50
        justify-start items-center
        cursor-pointer`}
    >
      {children}
    </li>
  );
}
