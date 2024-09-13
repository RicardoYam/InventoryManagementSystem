import React from "react";
import { Edit, Trash2 } from "lucide-react";

function Product({ product }) {
  return (
    <div className="grid grid-cols-4 py-2 text-xs sm:text-sm items-center">
      <div className="flex gap-2 items-center">
        <img src={product.image} alt="" className="w-10 h-10 rounded-full" />
        <span>{product.name}</span>
      </div>
      <span>${product.price}</span>
      <span>{product.quantity}</span>
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

export default Product;
