import WeeklySales from "../components/WeeklySales";
import MonthlySales from "../components/MonthlySales";
import { Link } from "react-router-dom";
import Invoice from "../components/Invoice";
import Product from "../components/Product";
import { CirclePlus } from "lucide-react";

export default function Dashboard() {
  const orders = [
    {
      id: 1,
      customer: "Manni Zhang",
      date: "31 Aug 2021",
      amount: 200,
      status: "Paid",
    },
    {
      id: 2,
      customer: "John Doe",
      date: "10 Aug 2021",
      amount: 300,
      status: "Refunded",
    },
    {
      id: 3,
      customer: "Jane Doe",
      date: "8 Jul 2021",
      amount: 100,
      status: "Unpaid",
    },
    {
      id: 4,
      customer: "Joy Biden",
      date: "1 Jul 2022",
      amount: 152,
      status: "Paid",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Product 1",
      image: "https://via.placeholder.com/150",
      quantity: 2,
      price: 200,
    },
    {
      id: 2,
      name: "Product 2",
      image: "https://via.placeholder.com/150",
      quantity: 3,
      price: 300,
    },
    {
      id: 3,
      name: "Product 3",
      image: "https://via.placeholder.com/150",
      quantity: 1,
      price: 100,
    },
  ];
  return (
    <div className="p-2 md:px-6">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <WeeklySales />
        <MonthlySales />
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="px-8 py-4 bg-white rounded-3xl shadow">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Invoices</span>
            <span className="text-xs text-gray-500 underline p-1">
              <Link to={"orders"}>See All</Link>
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-gray-500">3,251 invoices</span>
            {/* <button className="flex bg-indigo-700 text-white rounded-xl p-2 space-x-1 justify-center items-center">
            <CirclePlus size={15} />
            <span className="text-sm">Create</span>
          </button> */}
          </div>

          <div className="grid grid-cols-5 gap-4 py-2 text-xs text-gray-500 mt-4">
            <span className="text-xs text-gray-500">Customer name</span>
            <span className="text-xs text-gray-500">Date</span>
            <span className="text-xs text-gray-500">Amount</span>
            <span className="text-xs text-gray-500">Status</span>
            <span className="text-xs text-gray-500">Options</span>
          </div>

          {orders.map((order) => (
            <Invoice key={order.id} order={order} />
          ))}
        </div>

        {/* Product */}
        <div className="px-8 py-4 bg-white rounded-3xl shadow">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Products</span>
            <span className="text-xs text-gray-500 underline p-1">
              <Link to={"orders"}>See All</Link>
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-gray-500">1,591 products</span>
            {/* <button className="flex bg-indigo-700 text-white rounded-xl p-2 space-x-1 justify-center items-center">
            <CirclePlus size={15} />
            <span className="text-sm">Create</span>
          </button> */}
          </div>

          <div className="grid grid-cols-4 gap-4 py-2 text-xs text-gray-500 mt-4">
            <span className="text-xs text-gray-500">Product</span>
            <span className="text-xs text-gray-500">Price</span>
            <span className="text-xs text-gray-500">Quantity</span>
            <span className="text-xs text-gray-500">Options</span>
          </div>

          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
