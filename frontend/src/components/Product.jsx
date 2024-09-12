import React from "react";
import { Ellipsis } from "lucide-react";

function Product({ product }) {
  return (
    <div className="grid grid-cols-4 gap-4 py-2 text-xs sm:text-sm items-center">
      <div className="flex gap-2 items-center">
        <img src={product.image} alt="" className="w-10 h-10 rounded-full" />
        <span>{product.name}</span>
      </div>
      <span>{product.quantity}</span>
      <span>${product.price}</span>
      <button>
        <Ellipsis />
      </button>
    </div>
  );
}

export default Product;
