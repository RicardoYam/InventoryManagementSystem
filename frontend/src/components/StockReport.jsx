import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Package,
  ScrollText,
  Coins,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchSales, fetchStockReport } from "../api/sales";
import Loading from "./Loading";

export default function StockReport() {
  const [totalSales, setTotalSales] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalCost, setTotalCost] = useState(null);
  const [totalStock, setTotalStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSales = async () => {
      try {
        const data = await fetchSales();
        setTotalSales(data.total_sales);
        setTotalOrders(data.total_order);
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };
    const getStockReport = async () => {
      try {
        const data = await fetchStockReport();
        setTotalCost(data.total_cost_price);
        setTotalStock(data.total_stocks_number);
      } catch (err) {
        console.error("Error fetching stock report:", err);
      }
    };

    const fetchData = async () => {
      await Promise.all([getSales(), getStockReport()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="grid grid-cols-2 grid-rows-2 w-full min-h-56 max-h-72 bg-white gap-4">
      <div className="flex flex-col rounded-3xl shadow border border-gray-200 px-4 py-4 transform transition-transform duration-300 hover:scale-105">
        <div className="flex gap-2 items-center">
          <Banknote color="#5843f5" />
          <h4 className="text-sm">Total Sales</h4>
        </div>
        <h5 className="leading-none text-2xl font-bold text-gray-900 mt-2 md:text-3xl md:mt-4">
          ${totalSales.total}
        </h5>
        {totalSales.percentage_change === 100 &&
        totalSales.total === 0 ? null : (
          <div
            className={`flex text-base font-semibold gap-2 mt-2 items-center ${
              totalSales.percentage_change > 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {totalSales.percentage_change}%
            {totalSales.percentage_change > 0 ? (
              <TrendingUp />
            ) : (
              <TrendingDown />
            )}
            <h5 className="text-gray-500 text-xs">
              +${totalSales.sales_change} today
            </h5>
          </div>
        )}
      </div>

      <div className="flex flex-col rounded-3xl shadow border border-gray-200 px-4 py-4 transform transition-transform duration-300 hover:scale-105">
        <div className="flex gap-2 items-center">
          <ScrollText color="#5843f5" />
          <h4 className="text-sm">Total Orders</h4>
        </div>
        <h5 className="leading-none text-2xl font-bold text-gray-900 mt-2 md:text-3xl md:mt-4">
          {totalOrders.total}
        </h5>
        {totalOrders.percentage_change === 100 &&
        totalOrders.total === 0 ? null : (
          <div
            className={`flex text-base font-semibold gap-2 mt-2 items-center ${
              totalOrders.percentage_change > 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {totalOrders.percentage_change}%
            {totalOrders.percentage_change > 0 ? (
              <TrendingUp />
            ) : (
              <TrendingDown />
            )}
            <h5 className="text-gray-500 text-xs">
              +{totalOrders.order_change} today
            </h5>
          </div>
        )}
      </div>

      <div className="flex flex-col rounded-3xl shadow border border-gray-200 px-4 py-4 transform transition-transform duration-300 hover:scale-105">
        <div className="flex gap-2 items-center">
          <Coins color="#5843f5" />
          <h4 className="text-sm">Total Costs</h4>
        </div>
        <h5 className="leading-none text-2xl font-bold text-gray-900 mt-2 md:text-3xl md:mt-4">
          ${totalCost.total_cost}
        </h5>
      </div>

      <div className="flex flex-col rounded-3xl shadow border border-gray-200 px-4 py-4 transform transition-transform duration-300 hover:scale-105">
        <div className="flex gap-2 items-center">
          <Package color="#5843f5" />
          <h4 className="text-sm">Total Stocks</h4>
        </div>
        <h5 className="leading-none text-2xl font-bold text-gray-900 mt-2 md:text-3xl md:mt-4">
          {totalStock.total_stocks}
        </h5>
      </div>
    </div>
  );
}
