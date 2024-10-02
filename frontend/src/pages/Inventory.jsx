import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  SlidersHorizontal,
  ScanLine,
} from "lucide-react";
import { Oval } from "react-loader-spinner";
import Inventory from "../components/Inventory";
import { fetchInventories, createInventory } from "../api/inventories";
import { inventoryTypes, sizes } from "../util/util";

export default function Inventories() {
  const [inventories, setInventories] = useState([]);
  const [totalInventories, setTotalInventories] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newInventory, setNewInventory] = useState({
    name: "",
    purchased_price: "",
    selling_price: "",
    type: "",
    stocks: [{ size: "", color: "", quantity: "" }],
  });
  const [imageFile, setImageFile] = useState(null);
  const [inventorySearch, setInventorySearch] = useState("");
  const [isFlyOut, setIsFlyOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const getInventories = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          name: inventorySearch,
          page: currentPage,
        }).toString();

        const data = await fetchInventories(params);
        setInventories(data.results);
        setTotalInventories(data.count);
        setNextPage(data.next);
        setPrevPage(data.previous);
      } catch (err) {
        console.error("Error fetching inventories:", err);
      } finally {
        setLoading(false);
      }
    };

    getInventories();
  }, [currentPage, inventorySearch]);

  const toggleCreateModal = () => setIsCreateModalOpen(!isCreateModalOpen);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile" && files) {
      setImageFile(files[0]);
    } else {
      setNewInventory({ ...newInventory, [name]: value });
    }
  };

  const handleStockChange = (e, index) => {
    const { name, value } = e.target;
    const updatedStocks = [...newInventory.stocks];
    updatedStocks[index][name] = value;
    setNewInventory({ ...newInventory, stocks: updatedStocks });
  };

  const addStockRow = () => {
    setNewInventory({
      ...newInventory,
      stocks: [...newInventory.stocks, { size: "", color: "", quantity: "" }],
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    const formData = new FormData();

    formData.append("name", newInventory.name);
    formData.append("purchased_price", newInventory.purchased_price);
    formData.append("selling_price", newInventory.selling_price);
    formData.append("type", newInventory.type);

    newInventory.stocks.forEach((stock, index) => {
      formData.append(`stocks[${index}]color`, stock.color);
      formData.append(`stocks[${index}]size`, stock.size);
      formData.append(`stocks[${index}]quantity`, stock.quantity);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const createdInventory = await createInventory(formData);
      setInventories((prev) => [createdInventory, ...prev]);
      toggleCreateModal();
      setNewInventory({
        name: "",
        purchased_price: "",
        selling_price: "",
        type: "",
        stocks: [{ size: "", color: "", quantity: "" }],
      });
      setImageFile(null);
    } catch (err) {
      console.error("Error creating inventory:", err);
    } finally {
      setCreating(false);
      setIsCreateModalOpen(false);
    }
  };

  const handleInventorySearchChange = (e) => {
    setInventorySearch(e.target.value);
  };

  const toggleFlyout = () => setIsFlyOut(!isFlyOut);

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col pt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Inventories</h1>

        <div className="flex gap-1">
          <button
            className="flex text-white mr-2 bg-blue-500 text-md rounded-3xl p-2 gap-1 items-center justify-center"
            onClick={toggleCreateModal}
          >
            <Plus size={17} />
            Create
          </button>

          {/* TODO:Scan */}
          <button className="flex text-white bg-blue-500 text-md rounded-md p-2 gap-1 items-center justify-center">
            <ScanLine size={20} />
          </button>
        </div>
      </div>

      <span className="text-xs text-gray-500 mt-2">
        {totalInventories} inventories
      </span>

      <div className="flex flex-col mt-8 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between border-b">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by customer name"
              value={inventorySearch}
              onChange={handleInventorySearchChange}
              className="bg-white text-black rounded-2xl pl-10 pr-4 py-2 w-full border-none border-transparent focus:border-transparent focus:ring-0"
            />
          </div>

          <button
            className="flex p-2 m-2 rounded-2xl border border-gray-200 gap-2 items-center justify-center"
            onClick={toggleFlyout}
          >
            <SlidersHorizontal size={20} />
            Display
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-6">
            <Oval
              height={80}
              width={80}
              color="#4891ff"
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4891ff"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
            <p className="ml-4">Loading...</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-4 p-4 text-xs text-gray-500 border-b justify-center items-center">
              <span className="text-md text-gray-500">Inventory</span>
              <span className="text-md text-gray-500">Cost</span>
              <span className="text-md text-gray-500">Selling</span>
              <span className="text-md text-gray-500">Stocks</span>
            </div>

            <div className="cursor-pointer">
              {inventories.map((inventory, index) => (
                <Inventory
                  key={inventory.id}
                  inventory={inventory}
                  setInventories={setInventories}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center px-4 py-2">
          <div className="text-gray-500">{`Page: ${currentPage}`}</div>
          <div className="flex items-center space-x-2">
            <button
              className="border p-2 rounded-md disabled:opacity-50"
              onClick={handlePrevPage}
              disabled={!prevPage}
            >
              <ChevronLeft />
            </button>

            <button
              className="border p-2 rounded-md disabled:opacity-50"
              onClick={handleNextPage}
              disabled={!nextPage}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white p-6 shadow-lg rounded-lg relative overflow-auto"
            style={{ maxHeight: "85vh", maxWidth: "70vh" }}
          >
            <span
              className="absolute top-2 right-4 text-black text-xl cursor-pointer"
              onClick={toggleCreateModal}
            >
              <X />
            </span>
            <h2 className="text-2xl font-semibold mb-4">Create Inventory</h2>

            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Image</label>
                <input
                  type="file"
                  name="imageFile"
                  onChange={handleInputChange}
                  className="border rounded-lg w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newInventory.name}
                  onChange={handleInputChange}
                  className="border rounded-lg w-full p-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2">Cost Price</label>
                  <input
                    type="number"
                    name="purchased_price"
                    value={newInventory.purchased_price}
                    onChange={handleInputChange}
                    className="border rounded-lg w-full p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Selling Price</label>
                  <input
                    type="number"
                    name="selling_price"
                    value={newInventory.selling_price}
                    onChange={handleInputChange}
                    className="border rounded-lg w-full p-2"
                    required
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block mb-2">Type</label>
                <select
                  name="type"
                  value={newInventory.type}
                  onChange={handleInputChange}
                  className="border rounded-lg w-full p-2"
                  required
                >
                  <option value="">Select Type</option>
                  {inventoryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <h3 className="font-semibold mb-2">Stock Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <label className="block mb-2">Size</label>
                <label className="block mb-2">Color</label>
                <label className="block mb-2">Quantity</label>
              </div>
              {newInventory.stocks.map((stock, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                  <div>
                    <select
                      name="size"
                      value={stock.size}
                      onChange={(e) => handleStockChange(e, index)}
                      className="border rounded-lg w-full p-2"
                      required
                    >
                      <option value="">Select Size</option>
                      {sizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="color"
                      value={stock.color}
                      onChange={(e) => handleStockChange(e, index)}
                      className="border rounded-lg w-full p-2"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="quantity"
                      value={stock.quantity}
                      onChange={(e) => handleStockChange(e, index)}
                      className="border rounded-lg w-full p-2"
                      required
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addStockRow}
                className="bg-gray-200 text-gray-700 py-1 px-2 rounded-lg mb-4"
              >
                More
              </button>

              {creating ? (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
                  <Oval
                    height={50}
                    width={50}
                    color="#4891ff"
                    visible={true}
                    ariaLabel="oval-creating"
                    secondaryColor="#4891ff"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                  <p className="ml-4">Creating...</p>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    Create
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
