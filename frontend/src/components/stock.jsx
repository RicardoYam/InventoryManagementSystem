import React from "react";

function stock() {
  return (
    <div className="flex justify-around items-center my-1 p-2 bg-white shadow-sm rounded-lg">
      <img
        src="https://thewellco.co/wp-content/uploads/2022/03/HM-Conscious-Collection-Organic-Baby-Clothes.jpeg"
        alt=""
        className="w-20 h-20 rounded-full"
      />
      <span className="text-gray-600">Nice Sweater</span>
      <span className="text-gray-600">Sweater</span>
      <span className="text-gray-600">3 in stock</span>
      <span className="text-gray-600">$120</span>
    </div>
  );
}

export default stock;
