import React, { Fragment, useState, useEffect } from "react";
import { Plus, Search, ChevronRight, ChevronLeft, X } from "lucide-react";
import Order from "../components/Order";
import { fetchOrders, createOrder } from "../api/orders";
import { fetchCustomers } from "../api/customers";
import { fetchInventories } from "../api/inventories";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/20/solid";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [newOrder, setNewOrder] = useState({
    customer: null,
    items: [{ product: null, size: null, color: null, quantity: 1 }],
  });

  const [query, setQuery] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      try {
        const params = new URLSearchParams({
          name,
          page: currentPage,
        }).toString();

        const data = await fetchOrders(params);

        setOrders(data.results);
        setTotalOrders(data.count);
        setNextPage(data.next);
        setPrevPage(data.previous);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    getOrders();
  }, [currentPage, name]);

  useEffect(() => {
    if (isFormOpen) {
      const getCustomersAndProducts = async () => {
        try {
          const customerData = await fetchCustomers();
          const productData = await fetchInventories();
          setCustomers(
            Array.isArray(customerData.results) ? customerData.results : []
          );
          setProducts(
            Array.isArray(productData.results) ? productData.results : []
          );
        } catch (err) {
          console.error("Error fetching customers or products:", err);
        }
      };
      getCustomersAndProducts();
    }
  }, [isFormOpen]);

  const toggleFormOpen = () => {
    setIsFormOpen(!isFormOpen);
    setNewOrder({
      customer: null,
      items: [{ product: null, size: null, color: null, quantity: 1 }],
    });
    setErrorMessage("");
  };

  const handleProductChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index][field] = value;
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const addProductRow = () => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      items: [
        ...prevOrder.items,
        { product: null, size: null, color: null, quantity: 1 },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newOrder.customer || newOrder.items.some((item) => !item.product)) {
      setErrorMessage("Please select a customer and at least one product.");
      return;
    }
    try {
      await createOrder(newOrder);
      setIsFormOpen(false);
      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders.results);
      setTotalOrders(updatedOrders.count);
    } catch (err) {
      console.error("Error creating order:", err);
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
        <h1 className="text-3xl font-semibold">Orders</h1>
        <button
          className="flex text-white bg-blue-500 text-md rounded-3xl p-2 gap-1 items-center justify-center"
          onClick={toggleFormOpen}
        >
          <Plus size={17} />
          Create
        </button>
      </div>

      {/* Flyout form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl p-6 shadow-lg rounded-lg relative overflow-auto">
            <div className="text-right">
              <button className="text-gray-600" onClick={toggleFormOpen}>
                <X size={24} />
              </button>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Create New Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Customer:</label>
                <Combobox
                  value={newOrder.customer}
                  onChange={(selectedCustomer) =>
                    setNewOrder((prevOrder) => ({
                      ...prevOrder,
                      customer: selectedCustomer,
                    }))
                  }
                >
                  <ComboboxInput
                    aria-label="Customer"
                    displayValue={(customer) => customer?.name}
                    onChange={(event) => setQuery(event.target.value)}
                    className={clsx(
                      "max-w-40 rounded-lg text-black",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                    )}
                  />
                  <ComboboxOptions
                    anchor="bottom"
                    className={clsx(
                      "w-[var(--input-width)] rounded-xl bg-white border p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                      "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-50"
                    )}
                  >
                    {customers.map((person) => (
                      <ComboboxOption key={person.id} value={person}>
                        {({ active, selected }) => (
                          <div
                            className={`cursor-default select-none relative py-2 pl-3 pr-9 ${
                              active
                                ? "bg-indigo-600 text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {person.name}
                            {selected && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <CheckIcon className="w-5 h-5" />
                              </span>
                            )}
                          </div>
                        )}
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                </Combobox>
              </div>

              <div className="mb-4">
                <div className="grid grid-cols-4 gap-4">
                  <span>Product</span>
                  <span>Size</span>
                  <span>Color</span>
                  <span>Quantity</span>
                </div>
                {newOrder.items.map((item, index) => {
                  const productStocks = item.product ? item.product.stocks : [];
                  const availableColors = [
                    ...new Set(productStocks.map((stock) => stock.color)),
                  ];
                  const availableSizes = [
                    ...new Set(productStocks.map((stock) => stock.size)),
                  ];

                  return (
                    <div key={index} className="grid grid-cols-4 gap-4 mb-2">
                      {/* Product Combobox */}
                      <Combobox
                        value={item.product}
                        onChange={(selectedProduct) =>
                          handleProductChange(index, "product", selectedProduct)
                        }
                      >
                        <ComboboxInput
                          aria-label="Product"
                          displayValue={(product) => product?.name}
                          onChange={(event) => setQuery(event.target.value)}
                          className={clsx(
                            "w-full rounded-lg text-black",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                          )}
                        />
                        <ComboboxOptions
                          anchor="bottom"
                          className={clsx(
                            "w-[var(--input-width)] rounded-xl bg-white border p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-50"
                          )}
                        >
                          {products.map((product) => (
                            <ComboboxOption key={product.id} value={product}>
                              {({ active, selected }) => (
                                <div
                                  className={`cursor-default select-none relative py-2 pl-3 pr-9 ${
                                    active
                                      ? "bg-indigo-600 text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {product.name}
                                  {selected && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                      <CheckIcon className="w-5 h-5" />
                                    </span>
                                  )}
                                </div>
                              )}
                            </ComboboxOption>
                          ))}
                        </ComboboxOptions>
                      </Combobox>

                      {/* Size Combobox */}
                      <Combobox
                        value={item.size}
                        onChange={(selectedSize) =>
                          handleProductChange(index, "size", selectedSize)
                        }
                      >
                        <ComboboxInput
                          aria-label="Size"
                          displayValue={(size) => size}
                          className={clsx(
                            "w-full rounded-lg text-black",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                          )}
                        />
                        <ComboboxOptions
                          anchor="bottom"
                          className={clsx(
                            "w-[var(--input-width)] rounded-xl bg-white border p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-50"
                          )}
                        >
                          {availableSizes.map((size, idx) => (
                            <ComboboxOption key={idx} value={size}>
                              {({ active, selected }) => (
                                <div
                                  className={`cursor-default select-none relative py-2 pl-3 pr-9 ${
                                    active
                                      ? "bg-indigo-600 text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {size}
                                  {selected && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                      <CheckIcon className="w-5 h-5" />
                                    </span>
                                  )}
                                </div>
                              )}
                            </ComboboxOption>
                          ))}
                        </ComboboxOptions>
                      </Combobox>

                      {/* Color Combobox */}
                      <Combobox
                        value={item.color}
                        onChange={(selectedColor) =>
                          handleProductChange(index, "color", selectedColor)
                        }
                      >
                        <ComboboxInput
                          aria-label="Color"
                          displayValue={(color) => color}
                          className={clsx(
                            "w-full rounded-lg text-black",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                          )}
                        />
                        <ComboboxOptions
                          anchor="bottom"
                          className={clsx(
                            "w-[var(--input-width)] rounded-xl bg-white border p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-50"
                          )}
                        >
                          {availableColors.map((color, idx) => (
                            <ComboboxOption key={idx} value={color}>
                              {({ active, selected }) => (
                                <div
                                  className={`cursor-default select-none relative py-2 pl-3 pr-9 ${
                                    active
                                      ? "bg-indigo-600 text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {color}
                                  {selected && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                      <CheckIcon className="w-5 h-5" />
                                    </span>
                                  )}
                                </div>
                              )}
                            </ComboboxOption>
                          ))}
                        </ComboboxOptions>
                      </Combobox>

                      {/* Quantity Input */}
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          handleProductChange(index, "quantity", e.target.value)
                        }
                        min="1"
                        className="border rounded-lg p-2 w-24"
                        required
                      />
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={addProductRow}
                  className="text-blue-500 hover:underline"
                >
                  + Add Product
                </button>
              </div>

              {errorMessage && (
                <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <span className="text-xs text-gray-500 mt-2">{totalOrders} orders</span>

      <div className="flex flex-col mt-8 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between border-b">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by order name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white text-black pl-10 pr-4 py-2 w-full border-none border-transparent focus:border-transparent focus:ring-0"
            />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-5 p-4 text-xs text-gray-500 border-b justify-center items-center">
            <span className="text-md text-gray-500">Customer</span>
            <span className="text-md text-gray-500">Date</span>
            <span className="text-md text-gray-500">Amount</span>
            <span className="text-md text-gray-500">Status</span>
          </div>

          {orders.map((order) => (
            <Order key={order.id} order={order} />
          ))}
        </div>

        {/* Pagination */}
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
