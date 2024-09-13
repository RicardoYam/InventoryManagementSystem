import React, { useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import Product from "../components/Product";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Inventory() {
  const products = [
    {
      id: 1,
      name: "Product 1",
      image: "https://via.placeholder.com/150",
      quantity: 2,
      price: 200,
    },
    {
      id: 2,
      name: "Product 2",
      image: "https://via.placeholder.com/150",
      quantity: 3,
      price: 300,
    },
    {
      id: 3,
      name: "Product 3",
      image: "https://via.placeholder.com/150",
      quantity: 1,
      price: 100,
    },
  ];

  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Get customers for the current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const toggleFlyout = () => {
    setIsFlyoutOpen(!isFlyoutOpen);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col pt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Inventory</h1>
        <button className="flex text-white bg-blue-500 text-md rounded-3xl p-2 gap-1 items-center justify-center">
          <Plus size={17} />
          Create
        </button>
      </div>

      <div className="flex flex-col mt-8 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between border-b">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by product name"
              className="bg-white text-black pl-10 pr-4 py-2 w-full border-none border-transparent focus:border-transparent focus:ring-0"
            />
          </div>

          <div className="relative">
            <button
              className="flex p-2 m-2 rounded-2xl border border-gray-200 gap-2 items-center justify-center"
              onClick={toggleFlyout}
            >
              <SlidersHorizontal size={20} />
              Display
            </button>

            {isFlyoutOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg py-2">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Option 1
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Option 2
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Option 3
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-4 p-4 text-xs text-gray-500 border-b justify-center items-center">
            <span className="text-md text-gray-500">Product</span>
            <span className="text-md text-gray-500">Quantity</span>
            <span className="text-md text-gray-500">Price</span>
          </div>

          <div className="px-4">
            {currentProducts.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-2">
          <div className="text-gray-500">{`Total pages: ${totalPages}`}</div>

          <div className="flex items-center space-x-2">
            <button
              className="border p-2 rounded-md disabled:opacity-50"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </button>

            <div className="text-gray-500">{`${currentPage}/${totalPages}`}</div>
            <button
              className="border p-2 rounded-md disabled:opacity-50"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
