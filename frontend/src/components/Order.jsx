import React, { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import {
  status,
  DateConverter,
  DateConverterWithBrisbaneTime,
} from "../util/util";

function Order({ order }) {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

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

  const toggleFlyout = () => {
    setIsFlyoutOpen(!isFlyoutOpen);
  };

  return (
    <div>
      {/* Order Row */}
      <div className="grid grid-cols-5 p-4 text-xs justify-center items-center sm:text-sm border-b">
        <span onClick={toggleFlyout} className="cursor-pointer">
          {order.customer_name}
        </span>
        <span>{DateConverter(order.create_time)}</span>
        <span>${order.total}</span>
        <span
          className={`flex justify-center items-center rounded-full ${getStatusClasses(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
        <button>
          <Trash2 size={20} />
        </button>
      </div>

      {isFlyoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 shadow-lg rounded-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Order Details</h2>
              <button onClick={toggleFlyout}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <strong>Customer:</strong> {order.customer_name}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {DateConverterWithBrisbaneTime(order.create_time)}
              </div>
              <div>
                <strong>Total:</strong> ${order.total}
              </div>
              <div>
                <strong>Status:</strong> {getStatusLabel(order.status)}
              </div>

              <div>
                <strong>Items:</strong>
                {/* Product Details Table */}
                <table className="w-full mt-4 border border-gray-300 text-left text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 p-2">Product</th>
                      <th className="border border-gray-300 p-2">Price</th>
                      <th className="border border-gray-300 p-2">Color</th>
                      <th className="border border-gray-300 p-2">Size</th>
                      <th className="border border-gray-300 p-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">
                          {item.product_name}
                        </td>
                        <td className="border border-gray-300 p-2">
                          ${item.product_price}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {item.color}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {item.size}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
