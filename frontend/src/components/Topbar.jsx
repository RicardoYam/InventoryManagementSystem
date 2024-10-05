import React from "react";
import { useState, createContext } from "react";
import { AlignLeft, Search, Moon, X, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const TopbarContext = createContext();
export default function Topbar({ children }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-screen">
      <nav className="w-full h-14 flex fixed z-10 bg-white border-b-2 shadow-sm items-center p-4">
        <div className="flex flex-grow-0 justify-center">
          <button onClick={() => setExpanded((current) => !current)}>
            <AlignLeft />
          </button>
        </div>

        {/* TODO: ADD Search and mode change */}
        <div className="flex flex-grow justify-end space-x-1 m-1">
          {/* <button className="border p-2 rounded-xl">
            <Search />
          </button>
          <button className="border p-2 rounded-xl">
            <Moon />
          </button> */}
        </div>

        <div className="flex-grow-0">
          <img
            src={`https://ui-avatars.com/api/?name=${localStorage.getItem(
              "username"
            )}&background=f9a8d4`}
            alt=""
            className="w-10 h-10 rounded-xl"
          />
        </div>
      </nav>

      {/* slide-in */}
      <div
        className={`fixed inset-0 z-20 transform bg-white ${
          expanded ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-700 ease-in-out`}
      >
        <div className="flex flex-col w-full h-full bg-white p-6 shadow-lg">
          <div className="flex justify-between mb-20">
            <button onClick={() => setExpanded(false)}>
              <X />
            </button>
            <button className="flex items-center">
              <LogIn />
              <span className="pl-1 text-lg" onClick={handleLogOut}>
                Log out
              </span>
            </button>
          </div>

          <div className="flex items-center justify-center mb-14">
            <img src="https://img.logoipsum.com/243.svg" alt="" />
          </div>

          <TopbarContext.Provider>
            <ul className="flex-1 px-3">{children}</ul>
          </TopbarContext.Provider>
        </div>
      </div>
    </div>
  );
}

export function TopbarItem({ icon, text, active, alert }) {
  return (
    <Link
      to={text.toLowerCase() === "dashboard" ? "/" : `/${text.toLowerCase()}`}
      onClick={() => setExpanded(false)}
    >
      <li
        className={`
        relative flex items-center py-4 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-grey-600"
        }`}
      >
        {icon}
        <span className="pl-2">{text}</span>
        {alert && (
          <div className="absolute right-2 w-2 h-2 rounded bg-indigo-400" />
        )}
      </li>
    </Link>
  );
}
