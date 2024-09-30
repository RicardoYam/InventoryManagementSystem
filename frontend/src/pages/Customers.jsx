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
  const [sliderValue, setSliderValue] = useState(10000);
  const [level, setLevel] = useState("");

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
          pointsFrom: 0,
          pointsEnd: sliderValue,
          level,
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
  }, [currentPage, name, sliderValue, level]);

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

    if (newCustomer.phone) {
      if (newCustomer.phone.charAt(0) === "0") {
        newCustomer.phone = newCustomer.phone.slice(1);
      }
      newCustomer.phone = "+61" + newCustomer.phone;
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

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  const handleTabClick = (level) => {
    setLevel(level);
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
                    class="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                  />
                </label>
                <label className="block mb-2">
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                    class="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                  />
                </label>
                <label className="block mb-2">
                  Phone:
                  <div class="flex">
                    <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md">
                      +61
                    </span>
                    <input
                      type="text"
                      name="phone"
                      value={newCustomer.phone}
                      onChange={handleInputChange}
                      class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                    ></input>
                  </div>
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
              className="bg-white text-black rounded-2xl pl-10 pr-4 py-2 w-full border-none border-transparent focus:border-transparent focus:ring-0"
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
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg py-2 z-10">
                <ul>
                  <li className="relative px-4 py-2">
                    <h3>Points</h3>

                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step={100}
                      value={sliderValue}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer mt-2"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">0</span>
                      <span className="block text-md font-semibold">
                        {sliderValue}
                      </span>
                      <span className="text-xs text-gray-500">10000</span>
                    </div>
                  </li>
                  <li className="px-4 py-2">
                    <h3>Level</h3>
                    <div className="flex mt-2">
                      <button
                        onClick={() => handleTabClick("SL")}
                        className={`flex-1 py-1 px-2 text-center rounded-lg hover:bg-indigo-50 ${
                          level === "SL"
                            ? "text-black bg-indigo-200"
                            : "text-gray-500"
                        }`}
                      >
                        Silver
                      </button>
                      <button
                        onClick={() => handleTabClick("GD")}
                        className={`flex-1 py-1 px-2 text-center rounded-lg hover:bg-indigo-50 ${
                          level === "GD"
                            ? "text-black bg-indigo-200"
                            : "text-gray-500"
                        }`}
                      >
                        Gold
                      </button>
                      <button
                        onClick={() => handleTabClick("PL")}
                        className={`flex-1 py-1 px-2 text-center rounded-lg hover:bg-indigo-50 ${
                          level === "PL"
                            ? "text-black bg-indigo-200"
                            : "text-gray-500"
                        }`}
                      >
                        Platinum
                      </button>
                      <button
                        onClick={() => handleTabClick("DM")}
                        className={`flex-1 py-1 px-2 text-center rounded-lg hover:bg-indigo-50 ${
                          level === "DM"
                            ? "text-black bg-indigo-200"
                            : "text-gray-500"
                        }`}
                      >
                        Diamond
                      </button>
                    </div>
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
            <span className="text-md text-gray-500">Phone</span>
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
