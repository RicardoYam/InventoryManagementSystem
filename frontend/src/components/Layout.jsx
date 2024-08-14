import React from "react";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Package,
  UserCircle,
} from "lucide-react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const currentPath = useLocation().pathname.split("/")[1];
  const SIDEBAR_LINKS = [
    { id: 1, name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "" },
    {
      id: 2,
      name: "Statistics",
      icon: <BarChart3 size={20} />,
      path: "statistics",
    },
    {
      id: 3,
      name: "Customers",
      icon: <UserCircle size={20} />,
      path: "customers",
    },
    { id: 4, name: "Inventory", icon: <Boxes size={20} />, path: "inventory" },
    { id: 5, name: "Orders", icon: <Package size={20} />, path: "orders" },
  ];
  return (
    <div className="flex">
      <Sidebar>
        {SIDEBAR_LINKS.map((link) => (
          <SidebarItem
            key={link.id}
            icon={link.icon}
            text={link.name}
            active={currentPath === link.path}
          ></SidebarItem>
        ))}
      </Sidebar>

      <div className="w-full p-2 md:px-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
