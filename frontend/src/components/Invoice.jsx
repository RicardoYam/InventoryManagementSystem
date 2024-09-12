import React from "react";
import { Ellipsis } from "lucide-react";

function Invoice({ order }) {
  const getStatusClasses = (status) => {
    switch (status) {
      case "Paid":
        return "w-10 bg-green-200 text-green-500 py-1 px-2 sm:w-14";
      case "Unpaid":
        return "w-14 bg-red-200 text-red-500 py-1 px-1 sm:w-20";
      case "Refunded":
        return "w-16 bg-blue-200 text-blue-500 py-1 sm:w-24";
      default:
        return "w-14 bg-green-200 text-green-500 py-1 px-2 sm:w-14";
    }
  };
  return (
    <div className="grid grid-cols-5 gap-4 py-2 text-xs sm:text-sm">
      <span>{order.customer}</span>
      <span>{order.date}</span>
      <span>${order.amount}</span>
      <span
        className={`flex justify-center items-center rounded-full ${getStatusClasses(
          order.status
        )}`}
      >
        {order.status}
      </span>
      <button>
        <Ellipsis />
      </button>
    </div>
  );
}

export default Invoice;