import {
  ChevronFirst,
  ChevronLast,
  LogOut,
  MoreVertical,
  Settings,
} from "lucide-react";
import { useState, useContext, createContext } from "react";
import useClickOutside from "../hooks/useClickOutside";
import { Link, useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropRef = useClickOutside(() => setShowDropdown(false));
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="h-screen" ref={dropRef}>
      <nav className="h-full flex flex-col bg-gray-50 border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-center items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          <button
            onClick={() => setExpanded((current) => !current)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={expanded}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src={`https://ui-avatars.com/api/?name=${localStorage.getItem(
              "username"
            )}&background=f9a8d4`}
            alt=""
            className="w-10 h-10 rounded-lg"
          />
          <div
            className={`flex justify-between items-center
            overflow-hidden transition-all ${expanded ? "w-32 ml-3" : "w-0"}`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">
                {localStorage.getItem("username")}
              </h4>
              <span className="text-xs text-gray-500">Admin</span>
            </div>
            <div className="relative">
              <button onClick={() => setShowDropdown((prev) => !prev)}>
                <MoreVertical size={20} />
              </button>

              {showDropdown && (
                <div className="w-fit relative">
                  <div className="fixed">
                    <ul className="min-w-max absolute right-0 bottom-0 bg-white divide-y divide-gray-100 rounded-lg shadow overflow-hidden">
                      {/* <li className="flex gap-3 text-xs px-4 py-2 text-indigo-800 hover:bg-indigo-50 justify-start items-center cursor-pointer">
                        <Settings size={20} className="mr-2" /> Settings
                      </li> */}
                      <li
                        className="flex gap-3 text-xs px-4 py-2 text-indigo-800 hover:bg-indigo-50 justify-start items-center cursor-pointer"
                        onClick={handleLogOut}
                      >
                        <LogOut size={20} className="mr-2" /> Log out
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert }) {
  const expanded = useContext(SidebarContext);
  return (
    <Link
      to={text.toLowerCase() === "dashboard" ? "/" : `/${text.toLowerCase()}`}
    >
      <li
        className={`
          relative flex items-center py-2 px-3 my-1 z-50
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            active
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
              : "hover:bg-indigo-50 text-grey-600"
          }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-32 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}
        {!expanded && (
          <div
            className="absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-gray-800 text-xs
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}
