import React from "react";

function RecentProduct({ product }) {
  return (
    <div className="grid grid-cols-4 gap-4 text-center items-center py-2 text-xs sm:text-sm">
      <div className="flex justify-center">
        <img src={product.image} alt="" className="w-14 h-14 rounded-full" />
      </div>
      <span>{product.name}</span>
      <span>{product.quantity}</span>
      <span>${product.price}</span>
    </div>
  );
}

export default RecentProduct;
