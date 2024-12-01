import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App2";
import Login from "./login";
import NewOrder from "./newOrder";
import Invoice from "./invoice";
import Admin from "./admin";
import AppBar from "./dashboard/appbar";
import Customers from "./viewCustomers.js";
import Items from "./items.js";
import NoMatch from "./nomatch";
import reportWebVitals from "./reportWebVitals";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NewOrderHome from "./orderHome";

import {
  RouterProvider,
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Dashboard from "./dashboard/dashboard";
import SelectCustomer from "./customers.js";
import CustomerInformation from "./customerInfo.js";
import EditOrderHome from "./editOrderHome.js";
import SelectItems from "./newOrder.js";
import ReadOnlyCustomer from "./readOnlyCustomer.js";
import EditInvoice from "./editInvoice.js";
import { Skeleton } from "@mui/material";
import Orders from './orders.js'
import NewItem from './newItem.js'

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <AppBar />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "items",
        element: <Items />,
      },
      {
        path: "orders",
        element: <Orders />
      },
      {
        path: "newOrder",
        element: <NewOrderHome />,
        children: [
          {
            index: true,
            element: <SelectCustomer />,
          },
          {
            path: "selectItems", // Nested route within "newOrder"
            element: <SelectItems />,
          },
          {
            path: "invoice", // Nested route within "newOrder"
            element: <Invoice />,
          },
        ],
      },
      {
        path: "editOrder/:orderID",
        element: <EditOrderHome />,
        children: [
          {
            index: true,
            element: <ReadOnlyCustomer />,
          },
          {
            path: "selectItems",
            element: <SelectItems />,
          },
          {
            path: "editInvoice",
            element: <EditInvoice />,
          },
        ],
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "customerInfo/:customerId",
        element: <CustomerInformation />,
      },
      {path:"newItem",
        element: <NewItem />
      },
      {
        path: "*",
        element: <NoMatch />,
      },
    ],
  },
]);

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
