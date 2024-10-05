import React, { useState, useEffect } from "react";
import { Plus, Search, ChevronRight, ChevronLeft, X } from "lucide-react";
import {
  FaWeixin,
  FaAlipay,
  FaMoneyBill,
  FaExchangeAlt,
  FaCreditCard,
  FaCoins,
} from "react-icons/fa";
import Order from "../components/Order";
import { fetchOrders, createOrder } from "../api/orders";
import { fetchCustomers } from "../api/customers";
import { fetchInventories } from "../api/inventories";
import { Oval } from "react-loader-spinner";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/20/solid";
import Loading from "../components/Loading";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [debouncedCustomerName, setDebouncedCustomerName] = useState("");
  const [newOrder, setNewOrder] = useState({
    customer: null,
    method: null,
    discount: null,
    round: null,
    items: [{ product: null, size: null, color: null, quantity: 1 }],
  });
  const [query, setQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [sizeQuery, setSizeQuery] = useState("");
  const [colorQuery, setColorQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          customerName: debouncedCustomerName,
          page: currentPage,
        }).toString();
        const data = await fetchOrders(params);
        setOrders(data.results);
        setTotalOrders(data.count);
        setNextPage(data.next);
        setPrevPage(data.previous);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, [currentPage, debouncedCustomerName]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedCustomerName(customerName);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [customerName]);

  useEffect(() => {
    if (isFormOpen) {
      const getCustomersAndProducts = async () => {
        setLoading(true);
        try {
          const customerData = await fetchCustomers();
          const productData = await fetchInventories();
          setCustomers(
            Array.isArray(customerData.results) ? customerData.results : []
          );
          setProducts(
            Array.isArray(productData.results) ? productData.results : []
          );
          setFilteredCustomers(
            Array.isArray(customerData.results) ? customerData.results : []
          );
          setFilteredProducts(
            Array.isArray(productData.results) ? productData.results : []
          );
        } catch (err) {
          console.error("Error fetching customers or products:", err);
        } finally {
          setLoading(false);
        }
      };
      getCustomersAndProducts();
    }
  }, [isFormOpen]);

  useEffect(() => {
    if (query === "") {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(
        customers.filter((customer) =>
          customer.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, customers]);

  useEffect(() => {
    if (productQuery) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(productQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [productQuery, products]);

  const toggleFormOpen = () => {
    setIsFormOpen(!isFormOpen);
    setNewOrder({
      customer: null,
      method: null,
      discount: null,
      round: null,
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

  const calculateTotalPrice = () => {
    let total = newOrder.items.reduce((sum, item) => {
      const price = item.product?.selling_price || 0;
      return sum + price * item.quantity;
    }, 0);

    if (newOrder.discount) {
      total = total * (parseInt(newOrder.discount) / 100);
    }

    if (newOrder.round) {
      total = total - parseFloat(newOrder.round);
    }

    return total.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newOrder.method) {
      setErrorMessage("Please select a payment method.");
      return;
    }

    const formattedOrder = {
      method: newOrder.method,
      customer: newOrder.customer?.id,
      items: newOrder.items
        .map((item) => {
          const selectedStock = item.product?.stocks.find(
            (stock) => stock.size === item.size && stock.color === item.color
          );

          if (!selectedStock) {
            console.error(
              "No matching stock found for product, size, and color"
            );
            return null;
          }

          return {
            product: item.product?.id,
            stock_id: selectedStock.id,
            quantity: parseInt(item.quantity),
          };
        })
        .filter((item) => item !== null),
    };

    setCreatingOrder(true);

    try {
      const createdOrder = await createOrder(formattedOrder);

      setNewOrder({
        customer: null,
        method: null,
        discount: null,
        round: null,
        items: [{ product: null, size: null, color: null, quantity: 1 }],
      });
      setIsFormOpen(false);
      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders.results);
      setTotalOrders(updatedOrders.count);
    } catch (err) {
      setErrorMessage("Error creating order.");
      console.error("Error creating order:", err);
    } finally {
      setCreatingOrder(false);
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

  if (loading) {
    return <Loading />;
  }

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
      {creatingOrder ? (
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
        isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div
              className="bg-white w-full max-w-xl p-6 shadow-lg rounded-lg relative overflow-auto"
              style={{ maxHeight: "85vh" }}
            >
              <div className="text-right">
                <button className="text-gray-600" onClick={toggleFormOpen}>
                  <X size={24} />
                </button>
              </div>
              <h2 className="text-2xl font-semibold mb-4">Create New Order</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2">Customer</label>
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
                      onClick={() => setQuery("")}
                      onFocus={() => setQuery("")}
                      onChange={(event) => setQuery(event.target.value)}
                      className={clsx(
                        "max-w-40 rounded-lg text-black",
                        "focus:outline-none"
                      )}
                    />
                    <ComboboxOptions
                      anchor="bottom"
                      className={clsx(
                        "w-[var(--input-width)] rounded-xl bg-white border p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                        "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-50"
                      )}
                    >
                      {filteredCustomers.map((person) => (
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
                    const productStocks = item.product
                      ? item.product.stocks
                      : [];
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
                            handleProductChange(
                              index,
                              "product",
                              selectedProduct
                            )
                          }
                        >
                          <ComboboxInput
                            aria-label="Product"
                            displayValue={(product) => product?.name}
                            onClick={() => setProductQuery("")}
                            onFocus={() => setProductQuery("")}
                            onChange={(event) =>
                              setProductQuery(event.target.value)
                            }
                            className={clsx(
                              "w-full rounded-lg text-black",
                              "focus:outline-none"
                            )}
                          />
                          <ComboboxOptions
                            anchor="bottom"
                            className={clsx(
                              "w-[var(--input-width)] rounded-xl bg-white border p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                              "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-50"
                            )}
                          >
                            {filteredProducts.map((product) => (
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
                            onClick={() => setSizeQuery("")}
                            onFocus={() => setSizeQuery("")}
                            onChange={(e) => setSizeQuery(e.target.value)}
                            className={clsx(
                              "w-full rounded-lg text-black",
                              "focus:outline-none"
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
                            onClick={() => setColorQuery("")}
                            onFocus={() => setColorQuery("")}
                            onChange={(e) => setColorQuery(e.target.value)}
                            className={clsx(
                              "w-full rounded-lg text-black",
                              "focus:outline-none"
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
                            handleProductChange(
                              index,
                              "quantity",
                              e.target.value
                            )
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

                <div className="mb-4">
                  <span>Payment:</span>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <div className="border flex items-center p-2">
                      <input
                        id="wechat"
                        type="radio"
                        value="wechat"
                        name="payment"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={() =>
                          setNewOrder((prev) => ({ ...prev, method: "WE" }))
                        }
                      />
                      <label
                        htmlFor="wechat"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center"
                      >
                        <FaWeixin className="mr-2 w-4" /> WeChat
                      </label>
                    </div>
                    <div className="border flex items-center p-2">
                      <input
                        id="alipay"
                        type="radio"
                        value="alipay"
                        name="payment"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={() =>
                          setNewOrder((prev) => ({ ...prev, method: "AL" }))
                        }
                      />
                      <label
                        htmlFor="alipay"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center"
                      >
                        <FaAlipay className="mr-2 w-4" /> AliPay
                      </label>
                    </div>
                    <div className="border flex items-center p-2">
                      <input
                        id="transfer"
                        type="radio"
                        value="transfer"
                        name="payment"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={() =>
                          setNewOrder((prev) => ({ ...prev, method: "TR" }))
                        }
                      />
                      <label
                        htmlFor="transfer"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center"
                      >
                        <FaExchangeAlt className="mr-2 w-4" /> Transfer
                      </label>
                    </div>
                    <div className="border flex items-center p-2">
                      <input
                        id="cash"
                        type="radio"
                        value="cash"
                        name="payment"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={() =>
                          setNewOrder((prev) => ({ ...prev, method: "CA" }))
                        }
                      />
                      <label
                        htmlFor="cash"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center"
                      >
                        <FaMoneyBill className="mr-2 w-4" /> Cash
                      </label>
                    </div>
                    <div className="border flex items-center p-2">
                      <input
                        id="creditcard"
                        type="radio"
                        value="creditcard"
                        name="payment"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={() =>
                          setNewOrder((prev) => ({ ...prev, method: "CC" }))
                        }
                      />
                      <label
                        htmlFor="creditcard"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center"
                      >
                        <FaCreditCard className="mr-2 w-4" /> Card
                      </label>
                    </div>
                    <div className="border flex items-center p-2">
                      <input
                        id="credit"
                        type="radio"
                        value="credit"
                        name="payment"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={() =>
                          setNewOrder((prev) => ({ ...prev, method: "CR" }))
                        }
                      />
                      <label
                        htmlFor="credit"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center"
                      >
                        <FaCoins className="mr-2 w-4" /> Credit
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col mb-4">
                  <span className="mr-2">Discount:</span>
                  <div className="flex">
                    <input
                      type="text"
                      id="discount"
                      className="rounded-s-lg max-w-14 bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 text-sm border-gray-300 p-2.5"
                      placeholder="90"
                      onChange={(e) =>
                        setNewOrder((prev) => ({
                          ...prev,
                          discount: e.target.value,
                        }))
                      }
                    />
                    <span className="inline-flex items-center px-3 border-s-0 text-md text-gray-500 bg-gray-200 border border-gray-300 rounded-e-md">
                      %
                    </span>
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <span className="mr-2">Round:</span>
                  <div className="flex">
                    <input
                      type="text"
                      id="round"
                      className="rounded-lg max-w-24 bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 text-sm border-gray-300 p-2.5"
                      onChange={(e) =>
                        setNewOrder((prev) => ({
                          ...prev,
                          round: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Total Price Calculation */}
                <div className="mb-4">
                  <span className="mr-2 text-lg font-bold">Total Price:</span>
                  <span className="text-lg font-bold">
                    ${calculateTotalPrice()}
                  </span>
                </div>

                {errorMessage && (
                  <div className="text-red-500 text-sm mb-4">
                    {errorMessage}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    {creatingOrder ? (
                      <Oval
                        height={20}
                        width={20}
                        color="#fff"
                        visible={true}
                        ariaLabel="oval-loading"
                        secondaryColor="#fff"
                        strokeWidth={2}
                        strokeWidthSecondary={2}
                      />
                    ) : (
                      "Create Order"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      )}

      <span className="text-xs text-gray-500 mt-2">{totalOrders} orders</span>

      <div className="flex flex-col mt-8 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between border-b">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by order name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="bg-white text-black rounded-2xl pl-10 pr-4 py-2 w-full border-none border-transparent focus:border-transparent focus:ring-0"
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

          {orders.map((order, index) => (
            <Order
              key={order.id}
              order={order}
              setOrders={setOrders}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            />
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
