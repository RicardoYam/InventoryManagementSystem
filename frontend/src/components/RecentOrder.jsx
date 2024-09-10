import React from "react";
import { Ellipsis } from "lucide-react";

function RecentOrder({ order }) {
  const getStatusClasses = (status) => {
    switch (status) {
      case "Paid":
        return "w-14 bg-green-200 text-green-500 py-1 px-2";
      case "Unpaid":
        return "w-20 bg-red-200 text-red-500 py-1 px-2";
      case "Refunded":
        return "w-24 bg-blue-200 text-blue-500 py-1 px-2";
      default:
        return "w-14 bg-green-200 text-green-500 py-1 px-2";
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

export default RecentOrder;
