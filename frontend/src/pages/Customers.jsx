import { Filter } from "lucide-react";

export default function Customers() {
  return (
    <>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Customers</span>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 p-2 rounded-md text-sm max-w-36"
          ></input>
          <button className="bg-white p-2 rounded-md hover:bg-indigo-300 mx-4">
            <Filter size={20}></Filter>
          </button>
          <button className="bg-indigo-200 text-gray-800 p-2 rounded-md text-xs sm:text-sm hover:bg-indigo-300">
            Add Customer
          </button>
        </div>
      </div>

      <div className="border-b-2">
        <div className="flex items-center gap-2 max-w-16 border-b-2 border-indigo-800 mt-4 pb-2">
          <span className="text-gray-800">All</span>
          <div className="bg-gray-200 text-gray-500 rounded-md p-1 text-xs">
            263
          </div>
        </div>
      </div>

      <div className="bg-white my-4 p-4 text-center rounded-lg">
        <div className="grid grid-cols-3 my-2 border-b pb-2">
          <span className="font-semibold">Customer</span>
          <span className="font-semibold">Level</span>
          <span className="font-semibold">Actions</span>
        </div>
        dem
      </div>
    </>
  );
}
