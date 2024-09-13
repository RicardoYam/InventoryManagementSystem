import React, { useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import Invoice from "../components/Invoice";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Orders() {
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

  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Get customers for the current page
  const indexOfLastOrders = currentPage * itemsPerPage;
  const indexOfFirstOrders = indexOfLastOrders - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrders, indexOfLastOrders);

  const toggleFlyout = () => {
    setIsFlyoutOpen(!isFlyoutOpen);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col pt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Orders</h1>
        <button className="flex text-white bg-blue-500 text-md rounded-3xl p-2 gap-1 items-center justify-center">
          <Plus size={17} />
          Create
        </button>
      </div>

      <div className="flex flex-col mt-8 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between border-b">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by order name"
              className="bg-white text-black pl-10 pr-4 py-2 w-full border-none border-transparent focus:border-transparent focus:ring-0"
            />
          </div>

          <div className="relative">
            <button
              className="flex p-2 m-2 rounded-2xl border border-gray-200 gap-2 items-center justify-center"
              onClick={toggleFlyout}
            >
              <SlidersHorizontal size={20} />
              Display
            </button>

            {isFlyoutOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg py-2">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Option 1
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Option 2
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Option 3
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-5 p-4 text-xs text-gray-500 border-b justify-center items-center">
            <span className="text-md text-gray-500">Customer name</span>
            <span className="text-md text-gray-500">Date</span>
            <span className="text-md text-gray-500">Amount</span>
            <span className="text-md text-gray-500">Status</span>
          </div>

          <div className="px-4">
            {currentOrders.map((order) => (
              <Invoice key={order.id} order={order} />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-2">
          <div className="text-gray-500">{`Total pages: ${totalPages}`}</div>

          <div className="flex items-center space-x-2">
            <button
              className="border p-2 rounded-md disabled:opacity-50"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </button>

            <div className="text-gray-500">{`${currentPage}/${totalPages}`}</div>
            <button
              className="border p-2 rounded-md disabled:opacity-50"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
