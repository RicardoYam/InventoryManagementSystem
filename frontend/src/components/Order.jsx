import React, { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import {
  status,
  DateConverter,
  DateConverterWithBrisbaneTime,
} from "../util/util";
import { deleteOrder } from "../api/orders";
import clsx from "clsx";

function Order({ order, setOrders, className }) {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

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

  const confirmDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsConfirmOpen(true);
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(orderToDelete);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderToDelete)
      );
      setIsConfirmOpen(false);
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  return (
    <div>
      {/* Order Row */}
      <div
        onClick={toggleFlyout}
        className={clsx(
          "grid grid-cols-10 px-4 py-2 text-xs justify-center items-center cursor-pointer lg:text-sm lg:py-4 border-b",
          className
        )}
      >
        <span className="col-span-2">{order.customer_name}</span>
        <span className="col-span-2">{DateConverter(order.create_time)}</span>
        <span className="col-span-2">${order.total}</span>
        <span
          className={`flex col-span-3 justify-center items-center rounded-full ${getStatusClasses(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
        <button
          className="flex justify-center items-center"
          onClick={() => confirmDeleteOrder(order.id)}
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Flyout for Order Details */}
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

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 shadow-lg rounded-lg relative">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Delete Order</h2>
              <p>Are you sure you want to delete this order?</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={handleDeleteOrder}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
