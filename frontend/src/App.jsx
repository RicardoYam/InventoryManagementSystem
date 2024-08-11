import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Package,
  UserCircle,
} from "lucide-react";
import "./App.css";
import Sidebar, { SidebarItem } from "./components/sidebar";

function App() {
  return (
    <main className="App flex">
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text={"Dashboard"}
          active
        ></SidebarItem>
        <SidebarItem
          icon={<BarChart3 size={20} />}
          text={"Statistics"}
        ></SidebarItem>
        <SidebarItem
          icon={<UserCircle size={20} />}
          text={"Customers"}
          alert
        ></SidebarItem>
        <SidebarItem
          icon={<Boxes size={20} />}
          text={"Inventory"}
        ></SidebarItem>
        <SidebarItem icon={<Package size={20} />} text={"orders"}></SidebarItem>
      </Sidebar>
    </main>
  );
}

export default App;
