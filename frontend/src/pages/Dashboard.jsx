import StockReport from "../components/StockReport";
import SalesReport from "../components/SalesReport";
import { Link } from "react-router-dom";
import Order from "../components/Order";
import Inventory from "../components/Inventory";
import { Search, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchOrders } from "../api/orders";
import { fetchInventories } from "../api/inventories";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [inventories, setInventories] = useState([]);
  const [totalInventories, setTotalInventories] = useState(0);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data.results);
        setTotalOrders(data.count);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    const getInventories = async () => {
      try {
        const data = await fetchInventories();
        setInventories(data.results);
        setTotalInventories(data.count);
      } catch (err) {
        console.error("Error fetching inventories:", err);
      }
    };
    getInventories();
  }, []);

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mt-4 font-semibold">
        <h1 className="text-3xl">Overview</h1>

        {/* TODO: ADD Search and mode change */}

        {/* <div className="hidden sm:flex">
          <div className="flex-grow-1 mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-2" />
              <input
                type="text"
                placeholder="Search here..."
                className="bg-white text-black rounded-full pl-10 pr-4 py-2 w-full focus:outline-none"
              />
            </div>
          </div>

          <div>
            <button className="border-2 p-2 rounded-xl">
              <Moon />
            </button>
          </div>
        </div> */}
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        <StockReport />
        <SalesReport />
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Orders Section */}
        <div className="h-auto px-4 py-4 bg-white border border-gray-200 rounded-3xl shadow">
          <div className="flex justify-between items-center px-4">
            <span className="text-lg font-semibold">Invoices</span>
            <span className="text-xs text-gray-500 underline p-1">
              <Link to={"orders"}>See All</Link>
            </span>
          </div>

          <div className="flex justify-between px-4">
            <span className="text-xs text-gray-500">
              {totalOrders} invoices
            </span>
          </div>

          <div className="grid grid-cols-5 py-2 text-xs text-gray-500 mt-4 px-4 lg:mt-2">
            <span className="text-xs text-gray-500">Customer</span>
            <span className="text-xs text-gray-500">Date</span>
            <span className="text-xs text-gray-500">Amount</span>
            <span className="text-xs text-gray-500">Status</span>
          </div>

          {orders && orders.length > 0 ? (
            orders
              .slice(0, 5)
              .map((order, index) => (
                <Order
                  key={order.id}
                  order={order}
                  className={
                    index === 0 ? " border-t border-b-0" : "border-t border-b-0"
                  }
                />
              ))
          ) : (
            <div className="flex px-4 py-4 border-t items-center justify-center text-gray-500">
              No data
            </div>
          )}
        </div>

        {/* Inventory Section */}
        <div className="h-auto px-4 py-4 bg-white border border-gray-200 rounded-3xl shadow">
          <div className="flex justify-between items-center px-4">
            <span className="text-lg font-semibold">Inventories</span>
            <span className="text-xs text-gray-500 underline p-1">
              <Link to={"inventory"}>See All</Link>
            </span>
          </div>

          <div className="flex justify-between px-4">
            <span className="text-xs text-gray-500">
              {totalInventories} inventories
            </span>
          </div>

          <div className="grid grid-cols-4 py-2 text-xs text-gray-500 mt-4 px-4 md:mt-2">
            <span className="text-xs text-gray-500">Inventory</span>
            <span className="text-xs text-gray-500">Cost</span>
            <span className="text-xs text-gray-500">Price</span>
            <span className="text-xs text-gray-500">Stock</span>
          </div>

          {inventories && inventories.length > 0 ? (
            inventories
              .slice(0, 5)
              .map((inventory, index) => (
                <Inventory
                  key={inventory.id}
                  inventory={inventory}
                  setInventories={setInventories}
                  className={
                    index === 0 ? "border-t border-b-0" : "border-t border-b-0"
                  }
                />
              ))
          ) : (
            <div className="flex px-4 py-4 border-t items-center justify-center text-gray-500">
              No data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
