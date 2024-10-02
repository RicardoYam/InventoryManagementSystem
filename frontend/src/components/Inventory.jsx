import React, { useState } from "react";
import { Edit, Trash2, X, ArrowLeft, Pencil } from "lucide-react";
import { updateInventory, deleteInventory } from "../api/inventories";
import { sizes } from "../util/util";
import clsx from "clsx";

export default function Inventory({ inventory, setInventories, className }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inventoryDetails, setInventoryDetails] = useState(inventory);
  const [newImage, setNewImage] = useState(null);

  const handleIsModelOpen = () => setIsModalOpen(!isModalOpen);

  const handleEdit = () => setIsEditing(!isEditing);

  const handleStockChange = (index, field, value) => {
    const updatedStocks = [...inventoryDetails.stocks];
    updatedStocks[index][field] = value;
    setInventoryDetails({ ...inventoryDetails, stocks: updatedStocks });
  };

  const handleDelete = async () => {
    try {
      await deleteInventory(inventory.id);
      setInventories((prev) => prev.filter((item) => item.id !== inventory.id));
      handleIsModelOpen();
    } catch (error) {
      console.error("Error deleting inventory:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("name", inventoryDetails.name);
    formData.append("purchased_price", inventoryDetails.purchased_price);
    formData.append("selling_price", inventoryDetails.selling_price);
    formData.append("type", inventoryDetails.type);

    inventoryDetails.stocks.forEach((stock, index) => {
      formData.append(`stocks[${index}]color`, stock.color);
      formData.append(`stocks[${index}]size`, stock.size);
      formData.append(`stocks[${index}]quantity`, stock.quantity);
    });

    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const updatedInventory = await updateInventory(inventory.id, formData);
      setInventories((prev) =>
        prev.map((item) =>
          item.id === updatedInventory.id ? updatedInventory : item
        )
      );
      setIsEditing(false);
      handleIsModelOpen();
    } catch (err) {
      console.error("Error updating inventory:", err);
    }
  };

  return (
    <>
      <div
        onClick={handleIsModelOpen}
        className={clsx(
          "grid grid-cols-4 px-4 py-2 text-xs justify-center items-center lg:text-sm lg:py-4 border-b",
          className
        )}
      >
        <span>{inventory.name}</span>
        <span>${inventory.purchased_price}</span>
        <span>${inventory.selling_price}</span>
        <span>
          {inventory.stocks.reduce((total, stock) => total + stock.quantity, 0)}
        </span>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <div className="flex justify-between items-center mb-4">
              {isEditing && (
                <button className="mr-auto" onClick={handleEdit}>
                  <ArrowLeft />
                </button>
              )}
              <button
                className={`${!isEditing ? "ml-auto" : ""}`}
                onClick={handleIsModelOpen}
              >
                <X />
              </button>
            </div>

            <div className="mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={inventoryDetails.name}
                  onChange={(e) =>
                    setInventoryDetails({
                      ...inventoryDetails,
                      name: e.target.value,
                    })
                  }
                  className="border rounded-lg w-full p-2"
                />
              ) : (
                <h2 className="font-bold text-2xl">{inventoryDetails.name}</h2>
              )}
            </div>

            <div className="relative flex justify-center mb-8">
              <div className="relative w-40 h-40 bg-gray-200 flex items-center justify-center">
                <img
                  src={
                    newImage
                      ? URL.createObjectURL(newImage)
                      : inventory.image_url
                  }
                  alt={inventory.name}
                  className="max-h-full"
                />
                {isEditing && (
                  <label
                    htmlFor="imageUpload"
                    className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full cursor-pointer"
                  >
                    <Pencil size={20} />
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Inventory Details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block font-semibold">Cost Price</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={inventoryDetails.purchased_price}
                    onChange={(e) =>
                      setInventoryDetails({
                        ...inventoryDetails,
                        purchased_price: e.target.value,
                      })
                    }
                    className="border rounded-lg w-full p-2"
                  />
                ) : (
                  <p>${inventoryDetails.purchased_price}</p>
                )}
              </div>
              <div>
                <label className="block font-semibold">Selling Price</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={inventoryDetails.selling_price}
                    onChange={(e) =>
                      setInventoryDetails({
                        ...inventoryDetails,
                        selling_price: e.target.value,
                      })
                    }
                    className="border rounded-lg w-full p-2"
                  />
                ) : (
                  <p>${inventoryDetails.selling_price}</p>
                )}
              </div>
              <div>
                <label className="block font-semibold">Total Stocks</label>
                <p>
                  {inventoryDetails.stocks.reduce(
                    (total, stock) => total + parseInt(stock.quantity, 10),
                    0
                  )}
                </p>
              </div>
            </div>

            {/* Stock Details */}
            <h3 className="font-semibold mb-2">Stock Details</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border text-left border-gray-300 p-2">
                    Color
                  </th>
                  <th className="border text-left border-gray-300 p-2">Size</th>
                  <th className="border text-left border-gray-300 p-2">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventoryDetails.stocks.map((stock, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={stock.color}
                          onChange={(e) =>
                            handleStockChange(index, "color", e.target.value)
                          }
                          className="border rounded-lg w-full p-2"
                        />
                      ) : (
                        stock.color
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {isEditing ? (
                        <div>
                          <select
                            name="size"
                            value={stock.size}
                            onChange={(e) => handleStockChange(e, index)}
                            className="border rounded-lg w-full p-2"
                            required
                          >
                            {sizes.map((size) => (
                              <option key={size.value} value={size.value}>
                                {size.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        stock.size
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {isEditing ? (
                        <input
                          type="number"
                          value={stock.quantity}
                          onChange={(e) =>
                            handleStockChange(index, "quantity", e.target.value)
                          }
                          className="border rounded-lg w-full p-2"
                        />
                      ) : (
                        stock.quantity
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4 space-x-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
