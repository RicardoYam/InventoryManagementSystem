import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./pages/Error.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Customers from "./pages/Customers.jsx";
import Statisitcs from "./pages/Statistics.jsx";
import Inventory from "./pages/Inventory.jsx";
import Orders from "./pages/Orders.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "dashboard/",
        element: <Dashboard />,
      },
      {
        path: "statistics/",
        element: <Statisitcs />,
      },
      {
        path: "customers/",
        element: <Customers />,
      },
      {
        path: "inventory/",
        element: <Inventory />,
      },
      {
        path: "orders/",
        element: <Orders />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
