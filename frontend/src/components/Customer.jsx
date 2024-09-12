import React from "react";
import { Edit, Trash2 } from "lucide-react";

export default function Customer({ customer }) {
  return (
    <div className="grid grid-cols-5 p-4 text-xs sm:text-sm border-b">
      <span>{customer.customer}</span>
      <span>{customer.points}</span>
      <span>{customer.level}</span>
      <span>{customer.last_transaction}</span>
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
