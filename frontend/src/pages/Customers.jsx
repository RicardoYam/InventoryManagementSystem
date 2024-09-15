import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  X,
  CircleAlert,
} from "lucide-react";
import Customer from "../components/Customer";
import { fetchCustomers, createCustomer } from "../api/customers";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const params = new URLSearchParams({
          name,
          page: currentPage,
        }).toString();

        const data = await fetchCustomers(params);

        setCustomers(data.results);
        setTotalCustomers(data.count);
        setNextPage(data.next);
        setPrevPage(data.previous);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    getCustomers();
  }, [currentPage, name]);

  const toggleFlyout = () => {
    setIsFlyoutOpen(!isFlyoutOpen);
  };

  const toggleFormOpen = () => {
    setIsFormOpen(!isFormOpen);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
    });
    setErrorMessage("");
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modal-overlay") {
      setIsFormOpen(false);
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
      });
      setErrorMessage("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCustomer.name) {
      setErrorMessage("Name is required.");
      return;
    }
    if (!newCustomer.email && !newCustomer.phone) {
      setErrorMessage("At least one of Email or Phone is required.");
      return;
    }
    try {
      const createdCustomer = await createCustomer(newCustomer);
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
      });
      setErrorMessage("");
      setIsFormOpen(false);

      const updatedCustomers = await fetchCustomers();
      setCustomers(updatedCustomers.results);
      setTotalCustomers(updatedCustomers.count);
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

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
        <h1 className="text-3xl font-semibold">Customer</h1>
        <button
          className="flex text-white bg-blue-500 text-md rounded-3xl p-2 gap-1 items-center justify-center"
          onClick={toggleFormOpen}
        >
          <Plus size={17} />
          Create
        </button>

        {isFormOpen && (
          <div
            id="modal-overlay"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleClickOutside}
          >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
              <span
                className="absolute top-2 right-4 text-black text-xl cursor-pointer"
                onClick={toggleFormOpen}
              >
                <X />
              </span>
              <h2 className="text-2xl font-semibold mb-4">Add Customer</h2>
              <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-2 px-3 mt-1"
                  />
                </label>
                <label className="block mb-2">
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-2 px-3 mt-1"
                  />
                </label>
                <label className="block mb-2">
                  Phone:
                  <input
                    type="text"
                    name="phone"
                    value={newCustomer.phone}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg py-2 px-3 mt-1"
                  />
                </label>
                {errorMessage && (
                  <div className="flex mt-4 p-2 gap-2 rounded-lg bg-red-200">
                    <CircleAlert className="text-red-500" />
                    <span className="text-red-500">{errorMessage}</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-lg hover:bg-blue-600"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <span className="text-xs text-gray-500 mt-2">
        {totalCustomers} customers
      </span>

      <div className="flex flex-col mt-8 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between border-b">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by customer name"
              value={name}
              onChange={handleNameChange}
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
          <div className="grid grid-cols-5 p-4 text-xs text-gray-500 border-b justify-center items-center">
            <span className="text-md text-gray-500">Customer</span>
            <span className="text-md text-gray-500">Points</span>
            <span className="text-md text-gray-500">Level</span>
            <span className="text-md text-gray-500">Last Transaction</span>
          </div>

          {customers.map((customer) => (
            <Customer
              key={customer.id}
              customer={customer}
              setCustomers={setCustomers}
            />
          ))}
        </div>

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
    </div>
  );
}
