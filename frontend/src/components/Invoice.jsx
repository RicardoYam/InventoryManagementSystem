import React from "react";
import { Edit, Trash2 } from "lucide-react";

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
    <div className="grid grid-cols-5 py-2 text-xs sm:text-sm">
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
      <div className="flex gap-4">
        <button>
          <Edit size={20} />
        </button>
        <button>
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

export default Invoice;
