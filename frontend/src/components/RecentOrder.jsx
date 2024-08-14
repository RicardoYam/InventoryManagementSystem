import React from "react";

function RecentOrder({ order }) {
  return (
    <div className="grid grid-cols-3 gap-4 text-center py-2 text-xs sm:text-sm">
      <span>{order.customer}</span>
      <span>{order.quantity}</span>
      <span>${order.total}</span>
    </div>
  );
}

export default RecentOrder;
