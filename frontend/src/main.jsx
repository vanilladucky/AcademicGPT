import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorPage from "./pages/error-page";
import ProtectedRoute from "./pages/ProtectedRoute";
import VerificationCode from "./pages/VerificationCode";
import ErrorPageGeneral from "./pages/error-page";
import HomePage from "./pages/HomePage";
import Introduction from "./pages/Introduction";

const router = createBrowserRouter([
  {
    path: "/chat",
    element: <ProtectedRoute/>,
    errorElement: <ErrorPage />,
    children:[
      {
        path:"/chat/",
        element: <Chat/>
      }
    ]
  },
  {
    path: "/",
    element: <HomePage/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/introduction",
    element: <Introduction/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/verify/:uid",
    element: <VerificationCode />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/error",
    element: <ErrorPageGeneral />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(

    <RouterProvider router={router} />

);