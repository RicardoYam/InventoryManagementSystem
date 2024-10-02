import React, { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";

import SilverIcon from "../assets/silver.png";
import GoldIcon from "../assets/gold.png";
import PlatinumIcon from "../assets/platinum.png";
import DiamondIcon from "../assets/diamond.png";
import {
  retrieveCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customers";

export default function Customer({ customer, setCustomers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const getLevelIcon = (level) => {
    switch (level) {
      case "SL":
        return SilverIcon;
      case "GD":
        return GoldIcon;
      case "PL":
        return PlatinumIcon;
      case "DM":
        return DiamondIcon;
      default:
        return SilverIcon;
    }
  };

  const handleEditClick = async () => {
    setIsModalOpen(true);
    try {
      const data = await retrieveCustomer(customer.id);
      setCustomerDetails(data);
      setFormData({
        name: data.name,
        email: data.email || "",
        phone: data.phone || "",
      });
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const handleUpdateClick = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(customer.id, formData);
      console.log("Customer updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating customer details:", error);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    try {
      await deleteCustomer(customer.id);
      console.log("Customer deleted successfully");

      setIsDeleteModalOpen(false);
      setCustomers((prevCustomers) =>
        prevCustomers.filter((c) => c.id !== customer.id)
      );
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setCustomerDetails(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <div className="grid grid-cols-5 p-4 text-xs justify-center items-center sm:text-sm border-b">
        <span>{customer.name}</span>
        <span>{customer.points}</span>
        <span>
          <img
            src={getLevelIcon(customer.level)}
            alt={customer.level}
            className="w-6"
          />
        </span>
        <span>{customer.phone.replace(/^(\+61)/, "0")}</span>
        <div className="flex gap-4">
          <button onClick={handleEditClick}>
            <Edit size={20} />
          </button>
          <button onClick={handleDeleteClick}>
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="absolute top-2 right-4 text-black text-xl cursor-pointer"
              onClick={handleCloseModal}
            >
              <X />
            </span>
            <h2 className="text-2xl font-semibold mb-4">Edit Customer</h2>
            {customerDetails ? (
              <form>
                <label className="block mb-2">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-2 px-3 mt-1"
                  />
                </label>
                <label className="block mb-2">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-2 px-3 mt-1"
                  />
                </label>
                <label className="block mb-2">
                  Phone
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-2 px-3 mt-1"
                  />
                </label>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-lg hover:bg-blue-600"
                    onClick={handleUpdateClick}
                  >
                    Update
                  </button>
                </div>
              </form>
            ) : (
              <p>Loading customer details...</p>
            )}
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="absolute top-2 right-4 text-black text-xl cursor-pointer"
              onClick={handleCloseModal}
            >
              <X />
            </span>
            <h2 className="text-2xl font-semibold mb-4">Delete Customer</h2>
            <p>Are you sure you want to delete {customer.name}?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCustomer}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
