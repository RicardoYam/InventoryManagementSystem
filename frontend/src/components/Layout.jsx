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
  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text={"Dashboard"}
          active={currentPath === ""}
        ></SidebarItem>

        <SidebarItem
          icon={<BarChart3 size={20} />}
          text={"Statistics"}
          active={currentPath === "statistics"}
        ></SidebarItem>

        <SidebarItem
          icon={<UserCircle size={20} />}
          text={"Customers"}
          active={currentPath === "Customers"}
        ></SidebarItem>

        <SidebarItem
          icon={<Boxes size={20} />}
          text={"Inventory"}
          active={currentPath === "Inventory"}
        ></SidebarItem>
        <SidebarItem
          icon={<Package size={20} />}
          text={"Orders"}
          active={currentPath === "Orders"}
        ></SidebarItem>
      </Sidebar>

      <div className="w-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
