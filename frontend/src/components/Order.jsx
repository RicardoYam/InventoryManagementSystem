import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { status, DateConverter } from "../util/util";

function Order({ order }) {
  // Function to get CSS classes for the status
  const getStatusClasses = (status) => {
    switch (status) {
      case "P":
        return "w-10 bg-green-200 text-green-500 py-1 px-2 sm:w-14";
      case "U":
        return "w-14 bg-red-200 text-red-500 py-1 px-1 sm:w-20";
      case "R":
        return "w-16 bg-blue-200 text-blue-500 py-1 sm:w-24";
      default:
        return "w-14 bg-green-200 text-green-500 py-1 px-2 sm:w-14";
    }
  };

  const getStatusLabel = (statusValue) => {
    const statusObj = status.find((s) => s.value === statusValue);
    return statusObj ? statusObj.label : "Unknown";
  };

  return (
    <div className="grid grid-cols-5 p-4 text-xs justify-center items-center sm:text-sm border-b">
      <span>{order.customer_name}</span>
      <span>{DateConverter(order.create_time)}</span>
      <span>${order.total}</span>
      <span
        className={`flex justify-center items-center rounded-full ${getStatusClasses(
          order.status
        )}`}
      >
        {getStatusLabel(order.status)}
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

export default Order;
