import WeeklySales from "../components/WeeklySales";
import MonthlySales from "../components/MonthlySales";
import { Link } from "react-router-dom";
import RecentOrder from "../components/RecentOrder";
import RecentProduct from "../components/RecentProduct";

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
    <>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <WeeklySales />
        <MonthlySales />
      </div>

      <div className="my-4 px-8 py-4 bg-white rounded-3xl shadow">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Invoices</span>
          <span className="text-xs text-gray-500 underline p-1">
            <Link to={"orders"}>See All</Link>
          </span>
        </div>

        <span className="text-xs text-gray-500">3,251 invoices</span>

        <div className="grid grid-cols-5 gap-4 py-2 text-xs text-gray-500 mt-4">
          <span className="text-xs text-gray-500">Customer name</span>
          <span className="text-xs text-gray-500">Date</span>
          <span className="text-xs text-gray-500">Amount</span>
          <span className="text-xs text-gray-500">Status</span>
          <span className="text-xs text-gray-500">Options</span>
        </div>

        {orders.map((order) => (
          <RecentOrder key={order.id} order={order} />
        ))}
      </div>

      <div className="max-sm:hidden">
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-semibold">Products</span>
          <span className="text-xs text-gray-500 underline hover:bg-indigo-50 rounded-lg p-1">
            <Link to={"inventory"}>See All</Link>
          </span>
        </div>

        <div className="my-4 px-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-4 gap-4 text-center py-2 text-xs sm:text-sm font-semibold">
            <span />
            <span>Product</span>
            <span>Quantity</span>
            <span>Price</span>
          </div>

          <hr />
          {products.map((product) => (
            <RecentProduct key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
