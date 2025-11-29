import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../pages/DashboardLayout";
import PageNotFound from "../pages/PageNotFound";
import Dashboard from "../pages/Dashboard";
import Books from "../pages/Books";
import Students from "../pages/Students";
import Transactions from "../pages/Transactions";
import Login from "../pages/LoginForm";
import Signup from "../pages/SignupForm";

export default createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: <PageNotFound />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/books", element: <Books /> },
      { path: "/students", element: <Students /> },
      { path: "/transactions", element: <Transactions /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Signup /> },
]);
