import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Package,
  UserCircle,
} from "lucide-react";
import "./App.css";
import Sidebar, { SidebarItem } from "./components/sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function App() {
  const [item, setItem] = useState("Dashboard");
  const handleClicked = (item) => {
    setItem(item);
  };

  return (
    <div className="App">
      <Sidebar>
        <div onClick={() => handleClicked("Dashboard")}>
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text={"Dashboard"}
            active={item === "Dashboard"}
          ></SidebarItem>
        </div>
        <div onClick={() => handleClicked("Statistics")}>
          <SidebarItem
            icon={<BarChart3 size={20} />}
            text={"Statistics"}
            active={item === "Statistics"}
          ></SidebarItem>
        </div>
        <div onClick={() => handleClicked("Customers")}>
          <SidebarItem
            icon={<UserCircle size={20} />}
            text={"Customers"}
            active={item === "Customers"}
          ></SidebarItem>
        </div>
        <div onClick={() => handleClicked("Inventory")}>
          <SidebarItem
            icon={<Boxes size={20} />}
            text={"Inventory"}
            active={item === "Inventory"}
          ></SidebarItem>
        </div>
        <div onClick={() => handleClicked("Orders")}>
          <SidebarItem
            icon={<Package size={20} />}
            text={"Orders"}
            active={item === "Orders"}
          ></SidebarItem>
        </div>
      </Sidebar>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
